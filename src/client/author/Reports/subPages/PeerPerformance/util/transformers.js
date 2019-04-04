import { groupBy, minBy, cloneDeep } from "lodash";
import { getHSLFromRange1 } from "../../../common/util";

export const idToLabel = {
  schoolId: "schoolName",
  groupId: "className",
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
  let filteredData = data.filter((item, index) => {
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
  const arr = Object.keys(groupedData).map((data, index) => {
    let item = groupedData[data].reduce(
      (total, currentValue, currentIndex) => {
        let { maxScore = 0, totalScore = 0 } = currentValue;
        return {
          totalMaxScore: (total.totalMaxScore += maxScore),
          totalTotalScore: (total.totalTotalScore += totalScore)
        };
      },
      { totalMaxScore: 0, totalTotalScore: 0 }
    );
    let avgStudentScorePercent = Number(((item.totalTotalScore / item.totalMaxScore) * 100).toFixed(0));
    let schoolName = groupedData[data][0].schoolName;
    let teacherName = groupedData[data][0].teacherName;
    let className = groupedData[data][0].className;

    item = {
      ...item,
      avgStudentScorePercent: avgStudentScorePercent,
      correct: avgStudentScorePercent,
      incorrect: Number((100 - avgStudentScorePercent).toFixed(0)),
      districtAvg: Number(rawData.districtAvg.toFixed(0)),
      absent: 0,
      graded: groupedData[data].length,
      schoolName: schoolName,
      teacherName: teacherName,
      className: className,
      [compareBy]: data,
      compareBy: compareBy,
      compareBylabel: groupedData[data][0][idToLabel[compareBy]],
      fill: getHSLFromRange1(avgStudentScorePercent),
      dFill: getHSLFromRange1(rawData.districtAvg)
    };
    return item;
  });
  return arr;
};

const analyseByRawScore = (rawData, groupedData, compareBy) => {
  const arr = Object.keys(groupedData).map((data, index) => {
    let item = groupedData[data].reduce(
      (total, currentValue, currentIndex) => {
        let { maxScore = 0, totalScore = 0 } = currentValue;
        return {
          totalMaxScore: (total.totalMaxScore += maxScore),
          totalTotalScore: (total.totalTotalScore += totalScore)
        };
      },
      { totalMaxScore: 0, totalTotalScore: 0 }
    );

    let avgStudentScore = Number((item.totalTotalScore / groupedData[data].length).toFixed(2));
    let maxScore = groupedData[data][0].maxScore;
    let schoolName = groupedData[data][0].schoolName;
    let teacherName = groupedData[data][0].teacherName;
    let className = groupedData[data][0].className;
    let districtAvg = Number(((rawData.districtAvg / 100) * maxScore).toFixed(2));

    item = {
      ...item,
      maxScore: maxScore,
      avgStudentScore: avgStudentScore,
      correct: avgStudentScore,
      incorrect: Number((maxScore - avgStudentScore).toFixed(2)),
      districtAvg: districtAvg,
      absent: 0,
      graded: groupedData[data].length,
      schoolName: schoolName,
      teacherName: teacherName,
      className: className,
      [compareBy]: data,
      compareBy: compareBy,
      compareBylabel: groupedData[data][0][idToLabel[compareBy]],
      fill: getHSLFromRange1((avgStudentScore / maxScore) * 100),
      dFill: getHSLFromRange1((districtAvg / maxScore) * 100)
    };
    return item;
  });
  return arr;
};

const analyseByAboveBelowStandard = (rawData, groupedData, compareBy) => {
  const threshold = minBy(rawData.bandInfo, o => {
    if (o.aboveStandard === 1) {
      return o.threshold;
    }
    return Infinity;
  }).threshold;

  const getStandard = item => {
    if ((item.totalScore / item.maxScore) * 100 >= threshold) {
      return "aboveStandard";
    }
    return "belowStandard";
  };

  const arr = Object.keys(groupedData).map((data, index) => {
    let item = groupedData[data].reduce(
      (total, currentValue, currentIndex) => {
        let standard = getStandard(currentValue);
        return {
          ...total,
          [standard]: total[standard] + 1,
          total: total.total + 1
        };
      },
      { belowStandard: 0, aboveStandard: 0, total: 0 }
    );

    let belowStandardPercentage = -Math.round((item.belowStandard / item.total) * 100);
    let aboveStandardPercentage = Math.round((item.aboveStandard / item.total) * 100);

    let schoolName = groupedData[data][0].schoolName;
    let teacherName = groupedData[data][0].teacherName;
    let className = groupedData[data][0].className;

    item = {
      ...item,
      aboveStandardPercentage: aboveStandardPercentage,
      belowStandardPercentage: belowStandardPercentage,

      districtAvg: Math.round(rawData.districtAvg),
      absent: 0,
      graded: groupedData[data].length,
      schoolName: schoolName,
      teacherName: teacherName,
      className: className,
      [compareBy]: data,
      compareBy: compareBy,
      compareBylabel: groupedData[data][0][idToLabel[compareBy]],
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
  for (let o of rawData.bandInfo) {
    proficiencies[o.name] = 0;
    proficienciesDetail[o.name] = o;
  }

  bandInfo.sort((a, b) => {
    return b.threshold - a.threshold;
  });

  const bandInfoAsc = [...bandInfo];
  bandInfoAsc.reverse();

  const getProficiency = item => {
    for (let obj of bandInfo) {
      if ((item.totalScore / item.maxScore) * 100 >= obj.threshold) {
        return obj.name;
      }
    }
  };

  const arr = Object.keys(groupedData).map((data, index) => {
    let item = groupedData[data].reduce(
      (total, currentValue, currentIndex) => {
        let proficiency = getProficiency(currentValue);
        total[proficiency] += 1;
        total.total += 1;
        return {
          ...total
        };
      },
      { ...proficiencies, total: 0 }
    );

    let schoolName = groupedData[data][0].schoolName;
    let teacherName = groupedData[data][0].teacherName;
    let className = groupedData[data][0].className;

    const proficiencyPercentages = {};

    bandInfoAsc.map((o, index) => {
      let prof = Math.round((item[o.name] / item.total) * 100);
      let fill = Math.round((100 / (bandInfo.length - 1)) * index);
      if (proficienciesDetail[o.name].aboveStandard !== 1) {
        proficiencyPercentages[o.name + "Percentage"] = -prof;
      } else {
        proficiencyPercentages[o.name + "Percentage"] = prof;
      }
      proficiencyPercentages["fill_" + index] = getHSLFromRange1(fill);
    });

    item = {
      ...item,
      ...proficiencyPercentages,

      districtAvg: Number(rawData.districtAvg.toFixed(0)),
      absent: 0,
      graded: groupedData[data].length,
      schoolName: schoolName,
      teacherName: teacherName,
      className: className,
      [compareBy]: data,
      compareBy: compareBy,
      compareBylabel: groupedData[data][0][idToLabel[compareBy]]
    };

    return item;
  });
  return arr;
};

export const parseData = (rawData, data, filter) => {
  let filteredData = filterData(data, filter);
  let groupedData = groupBy(filteredData, filter.compareBy);
  let output = null;
  if (filter.analyseBy === "score(%)") {
    output = analyseByScorePercent(rawData, groupedData, filter.compareBy);
  } else if (filter.analyseBy === "rawScore") {
    output = analyseByRawScore(rawData, groupedData, filter.compareBy);
  } else if (filter.analyseBy === "aboveBelowStandard") {
    output = analyseByAboveBelowStandard(rawData, groupedData, filter.compareBy);
  } else if (filter.analyseBy === "proficiencyBand") {
    output = analyseByProficiencyBand(rawData, groupedData, filter.compareBy);
  }
  if (output) {
    return output;
  }
  return [];
};
