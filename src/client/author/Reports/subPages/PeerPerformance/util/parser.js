import { groupBy } from "lodash";
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

    let avgStudentScore = Math.round(item.totalTotalScore / groupedData[data].length);
    let maxScore = groupedData[data][0].maxScore;
    let schoolName = groupedData[data][0].schoolName;
    let teacherName = groupedData[data][0].teacherName;
    let className = groupedData[data][0].className;
    let districtAvg = Math.round((rawData.districtAvg / 100) * maxScore);
    let interval = maxScore / 4;
    item = {
      ...item,
      maxScore: maxScore,
      avgStudentScore: avgStudentScore,
      correct: avgStudentScore,
      incorrect: Math.round(maxScore - avgStudentScore),
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
  const arr = Object.keys(groupedData).map((data, index) => {
    let item = groupedData[data].reduce(
      (total, currentValue, currentIndex) => {
        // a
        let { maxScore = 0, totalScore = 0 } = currentValue;
        return {
          maxScore: (total.maxScore += maxScore),
          totalScore: (total.totalScore += totalScore)
        };
      },
      { maxScore: 0, totalScore: 0 }
    );
    item.avgStudentScorePercent = (item.totalScore / item.maxScore) * 100;
    item.districtAvg = rawData.districtAvg;
    item.absent = 0;
    item.graded = groupedData[data].length;
    item[compareBy] = data[compareBy];
    return item;
  });
};

const analyseByProficiencyBand = (rawData, groupedData, compareBy) => {
  const arr = Object.keys(groupedData).map((data, index) => {
    let item = groupedData[data].reduce(
      (total, currentValue, currentIndex) => {
        // a
        let { maxScore = 0, totalScore = 0 } = currentValue;
        return {
          maxScore: (total.maxScore += maxScore),
          totalScore: (total.totalScore += totalScore)
        };
      },
      { maxScore: 0, totalScore: 0 }
    );
    item.avgStudentScore = (item.totalScore / item.maxScore) * 100;
    // item.districtAvg = (rawData.districtAvg / 100) * groupedData[0].maxScore;
    item.absent = 0;
    item.graded = groupedData[data].length;
    item[compareBy] = data[compareBy];
    return item;
  });
};

export const parseData = (rawData, data, filter) => {
  console.log("parsedData: filter", filter);
  let filteredData = filterData(data, filter);
  let groupedData = groupBy(filteredData, filter.compareBy);
  console.log("groupedData", groupedData);
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
  console.log("output = ", output);
  if (output) {
    return output;
  }
  return [];
};

// hsla(100, 100%, 18%, 1)
