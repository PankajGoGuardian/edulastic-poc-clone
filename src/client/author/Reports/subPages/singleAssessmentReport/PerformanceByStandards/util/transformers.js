import {
  groupBy,
  head,
  uniqBy,
  capitalize,
  last,
  ceil,
  orderBy,
  find,
  map,
  forEach,
  round,
  filter,
  sumBy,
  mapValues,
  reduce
} from "lodash";
import { percentage, ceilingPercentage } from "../../../../common/util";
import next from "immer";

export const viewByMode = {
  STANDARDS: "standards",
  DOMAINS: "domains"
};

export const analyzeByMode = {
  SCORE: "score",
  RAW_SCORE: "rawScore",
  MASTERY_LEVEL: "masteryLevel",
  MASTERY_SCORE: "masteryScore"
};

export const compareByMode = {
  SCHOOL: "school",
  TEACHER: "teacher",
  CLASS: "class",
  STUDENTS: "students",
  RACE: "race",
  GENDER: "gender",
  FRL_STATUS: "frlStatus",
  ELL_STATUS: "ellStatus",
  IEP_STATUS: "iepStatus"
};

const lexicSort = field => (a, b) => (a[field] >= b[field] ? (a[field] === b[field] ? 0 : 1) : -1);

export const getYLabelString = analyzeBy => {
  switch (analyzeBy) {
    case analyzeByMode.RAW_SCORE:
      return "Avg. score";
    case analyzeByMode.MASTERY_LEVEL:
    case analyzeByMode.MASTERY_SCORE:
      return "Student (%)";
    default:
      return "Avg. score (%)";
  }
};

export const compareByColumns = {
  [compareByMode.SCHOOL]: {
    title: "School",
    dataIndex: "schoolId",
    key: "schoolId",
    sorter: lexicSort("schoolName"),
    render: (schoolId, school) => school.schoolName
  },
  [compareByMode.TEACHER]: {
    title: "Teacher",
    dataIndex: "teacherId",
    key: "teacherId",
    sorter: lexicSort("teacherName"),
    render: (teacherId, teacher) => teacher.teacherName
  },
  [compareByMode.CLASS]: {
    title: "Class",
    dataIndex: "groupId",
    key: "groupId",
    sorter: lexicSort("className"),
    render: (groupId, studentClass) => studentClass.className
  },
  [compareByMode.STUDENTS]: {
    title: "Student",
    dataIndex: "studentId",
    key: "studentId",
    sorter: (a, b) => a["lastName"].localeCompare(b["lastName"]),
    render: (studentId, student) => `${student.firstName} ${student.lastName}`
  },
  [compareByMode.RACE]: {
    title: "Race",
    dataIndex: "race",
    key: "race",
    sorter: lexicSort("race"),
    render: capitalize
  },
  [compareByMode.GENDER]: {
    title: "Gender",
    dataIndex: "gender",
    key: "gender"
  },
  [compareByMode.FRL_STATUS]: {
    title: "FRL Status",
    dataIndex: "frlStatus",
    key: "frlStatus",
    render: capitalize
  },
  [compareByMode.ELL_STATUS]: {
    title: "ELL Status",
    dataIndex: "ellStatus",
    key: "ellStatus",
    render: capitalize
  },
  [compareByMode.IEP_STATUS]: {
    title: "IEP Status",
    dataIndex: "iepStatus",
    key: "iepStatus",
    render: capitalize
  }
};

export const getOverallRawScore = (metrics = []) => sumBy(metrics, "totalScore") / metrics.length;

export const getOverallScore = (metrics = []) =>
  ceilingPercentage(sumBy(metrics, "totalScore"), sumBy(metrics, "maxScore"));

const chartGetAverageScoreByStandards = studentMetrics => standardId => {
  // get list of metrics by students for a standard
  const metricsList = studentMetrics[standardId];

  // calculate average score for a standard by all it's students
  const totalScore = metricsList.reduce((score, current) => score + current.totalScore / current.maxScore, 0);
  const masteryScore = metricsList.reduce((score, current) => score + current.masteryScore, 0);

  const averageStandardScore = totalScore / metricsList.length;
  const averageMasteryScore = masteryScore / metricsList.length;

  return {
    standardId,
    totalScore: averageStandardScore,
    masteryScore: averageMasteryScore
  };
};

const augmentMetricInfoWithStudentInfo = (studInfo, teacherInfo, metricInfo) => {
  const normalizedStudInfo = studInfo.reduce(
    (total, student) => ({
      ...total,
      [student.studentId]: student
    }),
    {}
  );

  const normalizedTeacherInfo = teacherInfo.reduce(
    (total, teacher) => ({
      ...total,
      [teacher.groupId]: teacher
    }),
    {}
  );

  return metricInfo.map(metric => ({
    ...metric,
    ...normalizedStudInfo[metric.studentId],
    ...normalizedTeacherInfo[metric.groupId]
  }));
};

const chartFilterMetricInfo = (studInfo, metricInfo, teacherInfo, chartFilters, skillInfo = []) => {
  const filtersList = Object.keys(chartFilters).map(key => ({
    key,
    value: chartFilters[key]
  }));

  const filteredMetrics = filter(metricInfo, metric => find(skillInfo, skill => skill.standardId == metric.standardId));

  const metricsWithStudent = augmentMetricInfoWithStudentInfo(studInfo, teacherInfo, filteredMetrics);

  return filtersList.reduce((filteredMetrics, filter) => {
    const byStudentInfo = metric => (filter.value === "all" ? true : metric[filter.key] === filter.value);
    return filteredMetrics.filter(byStudentInfo);
  }, metricsWithStudent);
};

const getStandardMetrics = (data = {}, scaleInfo = []) => {
  return next(data, draft => {
    Object.keys(draft).forEach(dataId => {
      const score = getOverallScore(draft[dataId].metric);
      const masteryLevel = getMasteryLevel(score, scaleInfo);
      draft[dataId] = {
        masteryScore: masteryLevel.score,
        masteryLabel: masteryLevel.masteryLabel,
        avgScore: score,
        rawScore: getOverallRawScore(draft[dataId].metric),
        maxScore: draft[dataId].maxScore,
        records: draft[dataId].metric
      };
    });
  });
};

const analysisStandardsData = (compareBy, studInfo, teacherInfo, metricInfo, scaleInfo) => {
  const metricInfoWithStudentInfo = augmentMetricInfoWithStudentInfo(studInfo, teacherInfo, metricInfo);

  const groupingField = compareByColumns[compareBy].key;

  const grouped = groupBy(metricInfoWithStudentInfo, groupingField);

  const data = Object.keys(grouped).map(groupId => {
    const groupedByStandard = groupBy(grouped[groupId], "standardId");

    let standardsData = {};

    Object.keys(groupedByStandard).forEach(standardId => {
      let currentStandard = standardsData[standardId];

      if (currentStandard) {
        currentStandard = {
          maxScore: currentStandard.maxScore + groupedByStandard[standardId][0].maxScore,
          metric: currentStandard.metric.concat(groupedByStandard[standardId])
        };
      } else {
        currentStandard = {
          maxScore: groupedByStandard[standardId][0].maxScore,
          metric: groupedByStandard[standardId]
        };
      }

      standardsData[standardId] = currentStandard;
    });

    return {
      ...grouped[groupId][0],
      standardMetrics: getStandardMetrics(standardsData, scaleInfo)
    };
  });

  let totalPoints = mapValues(data[0].standardMetrics, metric => metric.maxScore);

  return [data, totalPoints];
};

const analysisDomainsData = (compareBy, studInfo, teacherInfo, skillInfo, metricInfo, scaleInfo) => {
  const skillsByStandardId = groupBy(skillInfo, "standardId");

  const domainByStandardId = skillInfo.reduce((total, skill) => {
    return {
      ...total,
      [skill.standardId]: skillsByStandardId[skill.standardId][0].domainId
    };
  }, {});

  const metricInfoWithStudentInfo = augmentMetricInfoWithStudentInfo(studInfo, teacherInfo, metricInfo);

  const groupingField = compareByColumns[compareBy].key;

  const grouped = groupBy(metricInfoWithStudentInfo, groupingField);

  const data = Object.keys(grouped).map(groupId => {
    const groupedByStandard = groupBy(grouped[groupId], "standardId");

    let domainsData = {};

    Object.keys(groupedByStandard).forEach(standardId => {
      const domainId = domainByStandardId[standardId];
      if (domainId) {
        let currentDomain = domainsData[domainByStandardId[standardId]];

        if (currentDomain) {
          currentDomain = {
            maxScore: currentDomain.maxScore + groupedByStandard[standardId][0].maxScore,
            metric: currentDomain.metric.concat(groupedByStandard[standardId])
          };
        } else {
          currentDomain = {
            maxScore: groupedByStandard[standardId][0].maxScore,
            metric: groupedByStandard[standardId]
          };
        }

        domainsData[domainByStandardId[standardId]] = currentDomain;
      }
    });

    return {
      ...grouped[groupId][0],
      standardMetrics: getStandardMetrics(domainsData, scaleInfo)
    };
  });

  let totalPoints = mapValues(data[0].standardMetrics, metric => metric.maxScore);

  return [data, totalPoints];
};

export const analysisParseData = (report, viewBy, compareBy) => {
  const { studInfo, teacherInfo, skillInfo, scaleInfo } = report;

  const metricInfo = augmentMetricInfoWithMasteryScore(report.metricInfo, scaleInfo);

  switch (viewBy) {
    case viewByMode.STANDARDS:
      return analysisStandardsData(compareBy, studInfo, teacherInfo, metricInfo, scaleInfo);
    case viewByMode.DOMAINS:
      return analysisDomainsData(compareBy, studInfo, teacherInfo, skillInfo, metricInfo, scaleInfo);
    default:
      return [];
  }
};

export const getLeastMasteryLevel = (scaleInfo = []) =>
  orderBy(scaleInfo, "threshold", ["desc"])[scaleInfo.length - 1] || { masteryLabel: "", score: 0 };

export const getMasteryLevel = (score, scaleInfo, field = "threshold") => {
  const orderedScaleInfo = orderBy(scaleInfo, "threshold", ["desc"]);
  return find(orderedScaleInfo, info => ceil(score) >= info[field]) || getLeastMasteryLevel(scaleInfo);
};

export const getMasteryScore = (score, scaleInfo) => getMasteryLevel(score, scaleInfo).score;

export const findSkillUsingStandard = (standardId, skillInfo) =>
  find(skillInfo, skill => skill.standardId === standardId) || {};

const findGroupInfo = (id, viewBy, skillInfo) => {
  const isViewByStandards = viewBy == viewByMode.STANDARDS;

  const dataGroup = isViewByStandards ? "selectedStandards" : "selectedDomains";
  const field = isViewByStandards ? "standardId" : "domainId";

  let groupedSkillInfo = skillInfo.reduce(
    (total, { standardId, standard, domainId, domain }) => ({
      selectedStandards: total.selectedStandards.concat({
        name: standard,
        standard,
        standardId
      }),
      selectedDomains: total.selectedDomains.concat({
        name: domain,
        domain,
        domainId
      })
    }),
    {
      selectedStandards: [],
      selectedDomains: []
    }
  );

  groupedSkillInfo.selectedDomains = uniqBy(groupedSkillInfo.selectedDomains, "domainId");

  return find(groupedSkillInfo[dataGroup], item => item[field] == id) || {};
};

const augmentMetricInfoWithMasteryScore = (metricInfo = [], scaleInfo = []) => {
  return map(metricInfo, metric => {
    const masteryPercentage = percentage(metric.totalScore, metric.maxScore);
    const masteryLevel = getMasteryLevel(masteryPercentage, scaleInfo);

    return {
      ...metric,
      masteryScore: masteryLevel.score,
      masteryLabel: masteryLevel.masteryLabel
    };
  });
};

const augmentMetricInfoWithDomain = (metricInfo = [], skillInfo = []) => {
  return map(metricInfo, metric => {
    const skill = findSkillUsingStandard(metric.standardId, skillInfo);

    return {
      ...metric,
      domainId: skill.domainId,
      domain: skill.domain,
      standard: skill.standard
    };
  });
};

const getStandardMaxScore = (metricInfo = [], standardId) => {
  const groupedByStandard = groupBy(metricInfo, "standardId");
  return groupedByStandard[standardId] && groupedByStandard[standardId][0].maxScore;
};

const getDomainMaxScore = (metricInfo = [], domainId, skillInfo) => {
  const metricWithDomain = augmentMetricInfoWithDomain(metricInfo, skillInfo);

  const groupedByDomain = groupBy(metricWithDomain, "domainId");
  const domainRecords = groupedByDomain[domainId] || [];
  const relatedStandardsGroup = groupBy(domainRecords, "standardId");

  const maxScore = reduce(
    relatedStandardsGroup,
    (result, value) => {
      return result + value[0].maxScore;
    },
    0
  );

  return maxScore;
};

const groupByView = (report, chartFilters, viewBy) => {
  const { metricInfo = {}, scaleInfo = {}, skillInfo = [], studInfo = [], teacherInfo = [] } = report;
  const groupByKey = viewBy === viewByMode.STANDARDS ? "standardId" : "domainId";
  let filteredMetrics = filterAndAugmentMetricInfo(
    studInfo,
    metricInfo,
    teacherInfo,
    chartFilters,
    skillInfo,
    scaleInfo
  );
  // group data according to the chosen viewBy
  let metricByViewBy = groupBy(filteredMetrics, groupByKey);

  return metricByViewBy || {};
};

const filterAndAugmentMetricInfo = (studInfo, metricInfo, teacherInfo, chartFilters, skillInfo, scaleInfo) => {
  let filteredMetrics = chartFilterMetricInfo(studInfo, metricInfo, teacherInfo, chartFilters, skillInfo);

  const parsedMetricInfo = augmentMetricInfoWithDomain(
    augmentMetricInfoWithMasteryScore(filteredMetrics, scaleInfo),
    skillInfo
  );

  return parsedMetricInfo || [];
};

export const getChartMasteryData = (report = {}, chartFilters, viewBy) => {
  const { scaleInfo = {}, skillInfo = [] } = report;
  // group data according to the chosen viewBy
  let metricByViewBy = groupByView(report, chartFilters, viewBy);
  let metricByViewByWithMasteryCount = {};

  for (const viewByKey in metricByViewBy) {
    metricByViewByWithMasteryCount[viewByKey] = {};

    // create placeholder for each scale band to hold value and percentage
    forEach(scaleInfo, scale => {
      metricByViewByWithMasteryCount[viewByKey][scale.masteryLabel] = 0;
      metricByViewByWithMasteryCount[viewByKey][`${scale.masteryLabel} Percentage`] = 0;
    });

    const metricByMastery = groupBy(metricByViewBy[viewByKey], "masteryLabel");

    Object.keys(metricByMastery).forEach(key => {
      // find percentage of current scale records against total records
      const masteryScorePercentage = round(percentage(metricByMastery[key].length, metricByViewBy[viewByKey].length));
      metricByViewByWithMasteryCount[viewByKey][key] = metricByMastery[key].length;
      // if key is not mastered mark it negative
      metricByViewByWithMasteryCount[viewByKey][`${key} Percentage`] =
        key == "NM" ? -1 * masteryScorePercentage : masteryScorePercentage;
    });
  }

  let parsedGroupedMetricData = Object.keys(metricByViewByWithMasteryCount).map(id => ({
    ...findGroupInfo(id, viewBy, skillInfo),
    ...metricByViewByWithMasteryCount[id]
  }));

  return parsedGroupedMetricData.sort((a, b) => a.name.localeCompare(b.name));
};

export const getChartScoreData = (report = {}, chartFilters, viewBy) => {
  const { metricInfo = {}, skillInfo = [] } = report;
  // group data according to the chosen viewBy
  let metricByViewBy = groupByView(report, chartFilters, viewBy);

  return Object.keys(metricByViewBy).map(id => {
    const records = metricByViewBy[id];
    const avgScore = getOverallScore(records);
    let maxScore = 0;

    switch (viewBy) {
      case viewByMode.STANDARDS:
        maxScore = getStandardMaxScore(metricInfo, id);
        break;
      case viewByMode.DOMAINS:
        maxScore = getDomainMaxScore(metricInfo, id, skillInfo);
        break;
    }

    return {
      ...findGroupInfo(id, viewBy, skillInfo),
      rawScore: getOverallRawScore(records),
      avgScore,
      maxScore,
      records,
      diffScore: 100 - round(avgScore)
    };
  });
};
