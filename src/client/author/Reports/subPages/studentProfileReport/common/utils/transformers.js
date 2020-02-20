import { groupBy, map, find, reduce, values, round, capitalize, sumBy, orderBy, filter, keys } from "lodash";
import { percentage, getProficiencyBand, testTypeHashMap } from "../../../../common/util";
import gradesMap from "../static/json/gradesMap.json";

const getCourses = classData => {
  const groupedByCourse = groupBy(classData, "courseId");

  return map(groupedByCourse, (course, courseId) => ({
    title: course[0].courseName,
    key: courseId
  }));
};

export const getStudentName = (selectedStudent, studInfo) => {
  if (selectedStudent.title) {
    return selectedStudent.title;
  }
  return `${studInfo.firstName || ""} ${studInfo.lastName || ""}`;
};

const getTerms = (terms = []) =>
  map(terms, term => {
    return {
      title: term.name,
      key: term._id
    };
  });

export const getFilterOptions = (classData = [], terms = []) => {
  const courseOptions = getCourses(classData);
  const termOptions = getTerms(terms);

  return {
    courseOptions,
    termOptions
  };
};

export const augementAssessmentChartData = (metricInfo = [], bandInfo = [], studentClassData = []) => {
  if (!metricInfo.length) {
    return [];
  }

  const groupedByTest = groupBy(metricInfo, "testId");

  const groupedTestsByType = reduce(
    groupedByTest,
    (data, value) => {
      const groupedByType = groupBy(value, "testType");
      return data.concat(values(groupedByType));
    },
    []
  );

  const parsedData = map(groupedTestsByType, assignments => {
    const assignment = assignments[0] || {};
    const { testType, testId } = assignment;
    const scoreAvg = round(percentage(sumBy(assignments, "score"), sumBy(assignments, "maxScore")));
    const band = getProficiencyBand(scoreAvg, bandInfo);
    const { standardSet, subject } = studentClassData.find(s => s.studentId === assignment.studentId) || {};
    return {
      ...assignment,
      score: scoreAvg,
      uniqId: testId + testType,
      testType: capitalize(testTypeHashMap[testType.toLowerCase()]),
      diffScore: 100 - scoreAvg,
      band,
      assignments,
      standardSet,
      subject
    };
  });

  return parsedData;
};

export const getMaxScale = (scaleInfo = []) => orderBy(scaleInfo, "thresold", ["desc"])[0] || {};

export const getOverallMasteryPercentage = (records, maxScale) => {
  const masteredStandards = filter(records, record => record.scale.masteryName === maxScale.masteryName);
  return percentage(masteredStandards.length, records.length);
};

export const getMasterySummary = (masteryScore, scaleInfo) => {
  let flag = true;
  const masterySummary = {
    masteryScore,
    masteryName: "",
    color: ""
  };
  scaleInfo.forEach(scale => {
    if (flag && masteryScore >= scale.threshold) {
      flag = false;
      masterySummary.masteryName = scale.masteryName;
      masterySummary.color = scale.color;
    }
  });
  return masterySummary;
};

export const getOverallMasteryCount = (records, maxScale) => {
  const masteredStandards = filter(records, record => record.scale.masteryName === maxScale.masteryName);
  return masteredStandards.length;
};

export const getStudentPerformancePieData = (metricInfo = [], scaleInfo = []) => {
  const groupedByMastery = groupBy(metricInfo, metric => metric.scale.masteryLabel);
  const pieData = map(groupedByMastery, (records, masteryLabel) => {
    const { masteryName = "", color = "" } = records[0].scale;
    return {
      percentage: round(percentage(records.length, metricInfo.length)),
      count: records.length,
      totalCount: metricInfo.length,
      masteryLabel,
      masteryName,
      color
    };
  });
  return pieData;
};

export const augmentStandardMetaInfo = (standards = [], skillInfo = [], scaleInfo) => {
  const groupedSkillsByStandard = groupBy(skillInfo, "standardId");

  const standardsWithInfo = map(standards, standard => {
    const currentStandardRecords = groupedSkillsByStandard[standard.standardId] || [];
    if (currentStandardRecords[0]) {
      const score = percentage(standard.totalScore, standard.maxScore);
      const scale = getProficiencyBand(score, scaleInfo);

      return {
        ...standard,
        ...currentStandardRecords[0],
        masteryName: scale.masteryName,
        score: round(score),
        scoreFormatted: `${round(score)}%`,
        assessmentCount: 0,
        totalQuestions: 0,
        scale
      };
    } else {
      return null;
    }
  }).filter(standard => standard);

  // returning data in the ascending order of domain and standard.
  return orderBy(standardsWithInfo, ["domain", "standard"], ["asc", "asc"]);
};

export const getDomains = (metricInfo = [], scaleInfo = [], studentClassInfo = {}, asessmentMetricInfo = []) => {
  if (!metricInfo.length) {
    return [];
  }

  const groupedByDomain = groupBy(metricInfo, "domainId");
  const maxScale = getMaxScale(scaleInfo);

  const domains = map(keys(groupedByDomain), domainId => {
    const standards = groupedByDomain[domainId];
    const { domainName = "", domain = "" } = standards[0] || {};
    const masteryScore = getOverallMasteryPercentage(standards, maxScale);
    const masterySummary = getMasterySummary(masteryScore, scaleInfo);

    return {
      domainId,
      standards,
      masteryScore,
      masterySummary,
      name: domain,
      description: domainName,
      subject: studentClassInfo?.subject,
      standardSet: studentClassInfo?.standardSet,
      assessmentCount: asessmentMetricInfo?.length || 0
    };
  });

  return domains;
};

export const getGrades = (grades = "") => {
  return grades
    .split(",")
    .map(grade => gradesMap[grade])
    .join(",");
};
