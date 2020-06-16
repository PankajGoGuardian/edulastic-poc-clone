import { groupBy, minBy, cloneDeep, countBy } from "lodash";
import { getHSLFromRange1 } from "../../../../common/util";
import {transformMetricForStudentGroups} from "../../common/utils/transformers";

export const idToLabel = {
  schoolId: "schoolName",
  groupId: "groupName",
  teacherId: "teacherName",
  race: "race",
  gender: "gender",
  frlStatus: "frlStatus",
  ellStatus: "ellStatus",
  iepStatus: "iepStatus"
};

export const idToName = {
  schoolId: "School",
  groupId: "Class",
  group : "Student Group",
  teacherId: "Teacher",
  race: "Race",
  gender: "Gender",
  frlStatus: "FRL Status",
  ellStatus: "ELL Status",
  iepStatus: "IEP Status"
};

export const analyseByToName = {
  "score(%)": "Score (%)",
  rawScore: "Raw Score",
  aboveBelowStandard: "Above/Below Standard",
  proficiencyBand: "Proficiency Band"
};

const filterData = (data, filter) => {
  const filteredData = data.filter((item) => {
    if (
      (item.gender.toLowerCase() === filter.gender.toLowerCase() || filter.gender === "all") &&
      (item.frlStatus.toLowerCase() === filter.frlStatus.toLowerCase() || filter.frlStatus === "all") &&
      (item.ellStatus.toLowerCase() === filter.ellStatus.toLowerCase() || filter.ellStatus === "all") &&
      (item.iepStatus.toLowerCase() === filter.iepStatus.toLowerCase() || filter.iepStatus === "all") &&
      (item.race.toLowerCase() === filter.race.toLowerCase() || filter.race === "all")
    ) {
      return true;
    }
    return false;
  });
  return filteredData;
};

const analyseByScorePercent = (rawData, groupedData, compareBy) => {
  const arr = Object.keys(groupedData).map((data) => {
    let item = groupedData[data].reduce(
      (total, currentValue) => {
        const { maxScore = 0, totalScore = 0, progressStatus } = currentValue;
        return {
          // progressStatus = 2 is for absent student, needs to be excluded
          totalMaxScore: (total.totalMaxScore += progressStatus === 2 ? 0 : maxScore),
          totalTotalScore: (total.totalTotalScore += totalScore)
        };
      },
      { totalMaxScore: 0, totalTotalScore: 0 }
    );

    let avgStudentScorePercentUnrounded = (item.totalTotalScore / item.totalMaxScore) * 100;
    avgStudentScorePercentUnrounded = !isNaN(avgStudentScorePercentUnrounded) ? avgStudentScorePercentUnrounded : 0;

    const avgStudentScorePercent = !isNaN(avgStudentScorePercentUnrounded)
      ? Math.round(avgStudentScorePercentUnrounded)
      : 0;
    const { schoolName, teacherName, groupName: className } = groupedData[data][0];
    const statusCounts = countBy(groupedData[data], o => o.progressStatus);

    item = {
      ...item,
      avgStudentScorePercentUnrounded,
      avgStudentScorePercent,
      correct: avgStudentScorePercent,
      incorrect: Math.round(100 - avgStudentScorePercent),
      districtAvg: Math.round(rawData.districtAvgPerf),
      absent: statusCounts[2] || 0,
      graded: statusCounts[1] || 0,
      schoolName,
      teacherName,
      className,
      [compareBy]: data,
      compareBy,
      compareBylabel: groupedData[data][0][idToLabel[compareBy]] ? groupedData[data][0][idToLabel[compareBy]] : "NA",
      fill: getHSLFromRange1(avgStudentScorePercent),
      dFill: getHSLFromRange1(rawData.districtAvgPerf)
    };
    return item;
  });
  return arr;
};

const analyseByRawScore = (rawData, groupedData, compareBy) => {
  const arr = Object.keys(groupedData).map((data) => {
    let item = groupedData[data].reduce(
      (total, currentValue) => {
        const { maxScore = 0, totalScore = 0, progressStatus } = currentValue;
        return {
          // progressStatus = 2 is for absent student, needs to be excluded
          totalMaxScore: (total.totalMaxScore += progressStatus === 2 ? 0 : maxScore),
          totalTotalScore: (total.totalTotalScore += totalScore)
        };
      },
      { totalMaxScore: 0, totalTotalScore: 0 }
    );

    const statusCounts = countBy(groupedData[data], o => o.progressStatus);
    let avgStudentScoreUnrounded = item.totalTotalScore / (statusCounts[1] || 1);
    avgStudentScoreUnrounded = !isNaN(avgStudentScoreUnrounded) ? avgStudentScoreUnrounded : 0;

    const avgStudentScore = !isNaN(avgStudentScoreUnrounded) ? Number(avgStudentScoreUnrounded.toFixed(2)) : 0;
    const { maxScore, schoolName, teacherName, groupName: className } = groupedData[data][0];

    item = {
      ...item,
      maxScore,
      avgStudentScoreUnrounded,
      avgStudentScore,
      correct: avgStudentScore,
      incorrect: Number((maxScore - avgStudentScore).toFixed(2)),
      districtAvg: Number(rawData.districtAvg.toFixed(2)),
      absent: statusCounts[2] || 0,
      graded: statusCounts[1] || 0,
      schoolName,
      teacherName,
      className,
      [compareBy]: data,
      compareBy,
      compareBylabel: groupedData[data][0][idToLabel[compareBy]] ? groupedData[data][0][idToLabel[compareBy]] : "NA",
      fill: getHSLFromRange1((avgStudentScore / maxScore) * 100),
      dFill: getHSLFromRange1(rawData.districtAvgPerf)
    };
    return item;
  });
  return arr;
};

const analyseByAboveBelowStandard = (rawData, groupedData, compareBy) => {
  const { threshold } = minBy(rawData.bandInfo, o => {
    if (o.aboveStandard === 1) {
      return o.threshold;
    }
    return Infinity;
  });

  const getStandard = item => {
    if ((item.totalScore / item.maxScore) * 100 >= threshold) {
      return "aboveStandard";
    }
    return "belowStandard";
  };

  const arr = Object.keys(groupedData).map((data) => {
    let item = groupedData[data].reduce(
      (total, currentValue) => {
        const standard = getStandard(currentValue);
        return {
          ...total,
          [standard]: total[standard] + (currentValue.progressStatus === 2 ? 0 : 1),
          total: total.total + (currentValue.progressStatus === 2 ? 0 : 1)
        };
      },
      { belowStandard: 0, aboveStandard: 0, total: 0 }
    );

    const belowStandardPercentage = -Math.round((item.belowStandard / (item.total || 1)) * 100);
    const aboveStandardPercentage = Math.round((item.aboveStandard / (item.total || 1)) * 100);

    const { schoolName, teacherName, groupName: className } = groupedData[data][0];
    const statusCounts = countBy(groupedData[data], o => o.progressStatus);

    item = {
      ...item,
      aboveStandardPercentage,
      belowStandardPercentage,
      districtAvg: Number(rawData.districtAvg.toFixed(2)),
      absent: statusCounts[2] || 0,
      graded: statusCounts[1] || 0,
      schoolName,
      teacherName,
      className,
      [compareBy]: data,
      compareBy,
      compareBylabel: groupedData[data][0][idToLabel[compareBy]] ? groupedData[data][0][idToLabel[compareBy]] : "NA",
      fill_0: getHSLFromRange1(100),
      fill_1: getHSLFromRange1(0)
    };

    return item;
  });
  return arr;
};

const analyseByProficiencyBand = (rawData, groupedData, compareBy) => {
  const bandInfo = cloneDeep(rawData.bandInfo);
  const proficiencies = {};
  const proficienciesDetail = {};
  for (const o of rawData.bandInfo) {
    proficiencies[o.name] = 0;
    proficienciesDetail[o.name] = o;
  }

  bandInfo.sort((a, b) => b.threshold - a.threshold);

  const bandInfoAsc = [...bandInfo];
  bandInfoAsc.reverse();

  const getProficiency = item => {
    for (const obj of bandInfo) {
      if ((item.totalScore / item.maxScore) * 100 >= obj.threshold) {
        return obj.name;
      }
    }
  };

  const arr = Object.keys(groupedData).map((data) => {
    let item = groupedData[data].reduce(
      (total, currentValue) => {
        const proficiency = getProficiency(currentValue);
        total[proficiency] += currentValue.progressStatus === 2 ? 0 : 1;
        total.total += currentValue.progressStatus === 2 ? 0 : 1;
        return {
          ...total
        };
      },
      { ...proficiencies, total: 0 }
    );

    const { schoolName, teacherName, groupName: className } = groupedData[data][0];

    const proficiencyPercentages = {};

    bandInfoAsc.map((o, index) => {
      const prof = Math.round((item[o.name] / (item.total || 1)) * 100);
      const fill = Math.round((100 / (bandInfo.length - 1)) * index);
      if (proficienciesDetail[o.name].aboveStandard !== 1) {
        proficiencyPercentages[`${o.name  }Percentage`] = -prof;
      } else {
        proficiencyPercentages[`${o.name  }Percentage`] = prof;
      }
      proficiencyPercentages[`fill_${  index}`] = getHSLFromRange1(fill);
    });

    const statusCounts = countBy(groupedData[data], o => o.progressStatus);

    item = {
      ...item,
      ...proficiencyPercentages,
      districtAvg: Number(rawData.districtAvg.toFixed(2)),
      absent: statusCounts[2] || 0,
      graded: statusCounts[1] || 0,
      schoolName,
      teacherName,
      className,
      [compareBy]: data,
      compareBy,
      compareBylabel: groupedData[data][0][idToLabel[compareBy]] ? groupedData[data][0][idToLabel[compareBy]] : "NA"
    };

    return item;
  });
  return arr;
};

export const parseData = (rawData, data, filter) => {
  let compareBy = filter.compareBy;
  if(filter.compareBy === "group") {
    data = transformMetricForStudentGroups(rawData.metaInfo, data);
    compareBy = "groupId";
  }
  const filteredData = filterData(data, filter);
  const groupedData = groupBy(filteredData, compareBy);
  let output = null;
  if (filter.analyseBy === "score(%)") {
    output = analyseByScorePercent(rawData, groupedData, compareBy);
  } else if (filter.analyseBy === "rawScore") {
    output = analyseByRawScore(rawData, groupedData, compareBy);
  } else if (filter.analyseBy === "aboveBelowStandard") {
    output = analyseByAboveBelowStandard(rawData, groupedData, compareBy);
  } else if (filter.analyseBy === "proficiencyBand") {
    output = analyseByProficiencyBand(rawData, groupedData, compareBy);
  }
  if (output) {
    return output;
  }
  return [];
};
