import { groupBy, head, uniqBy, capitalize, last, ceil, orderBy, find, map, forEach, round, filter } from "lodash";
import { percentage } from "../../../../common/util";

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
    sorter: (a, b) => {
      const aName = `${a.firstName} ${b.lastName}`;
      const bName = `${b.firstName} ${b.lastName}`;

      if (aName > bName) return 1;
      else if (aName < bName) return -1;
      return 0;
    },
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
    key: "gender",
    render: gender => (gender === "M" ? "Male" : "Female")
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

const chartDataByStandards = (report, chartFilters) => {
  const { studInfo, metricInfo, teacherInfo, skillInfo } = report;
  const filteredMetrics = chartFilterMetricInfo(studInfo, metricInfo, teacherInfo, chartFilters, skillInfo);

  const metricsByStandardId = groupBy(filteredMetrics, "standardId");

  const metric = Object.keys(metricsByStandardId).map(chartGetAverageScoreByStandards(metricsByStandardId));

  return metric;
};

const chartDataByDomains = (report, chartFilters) => {
  const { skillInfo, studInfo, metricInfo, teacherInfo } = report;
  const filteredMetrics = chartFilterMetricInfo(studInfo, metricInfo, teacherInfo, chartFilters, skillInfo);

  const skillInfoByDomain = groupBy(skillInfo, "domain");

  const metrics = Object.values(skillInfoByDomain);

  const defaultStandard = { totalScore: 0, maxScore: 1, masteryScore: 0 };

  const byDomains = metrics.map(studentStandards => {
    const totalScore = studentStandards.reduce((total, standard) => {
      const metric = filteredMetrics.find(m => m.standardId === standard.standardId) || defaultStandard;

      return total + metric.totalScore / metric.maxScore;
    }, 0);

    const totalMasteryScore = studentStandards.reduce((total, standard) => {
      const metric = filteredMetrics.find(m => m.standardId === standard.standardId) || defaultStandard;

      return total + metric.masteryScore;
    }, 0);

    return {
      totalScore: totalScore / studentStandards.length,
      masteryScore: totalMasteryScore / studentStandards.length,
      domainId: head(studentStandards).domainId
    };
  });

  return byDomains;
};

const makeStandardColumnData = (skillInfo, selectedDomains, selectedStandards) => {
  return {
    [viewByMode.STANDARDS]: {
      selectedData: selectedStandards,
      dataField: "standardId",
      standardColumnsData: skillInfo
    },
    [viewByMode.DOMAINS]: {
      selectedData: selectedDomains,
      dataField: "domainId",
      standardColumnsData: uniqBy(skillInfo, "domainId")
    }
  };
};

const groupAnalysisByCompare = (data, viewBy, compareBy) => {
  const groupingField = compareByColumns[compareBy].key;

  const viewByMetric = makeStandardColumnData()[viewBy].dataField;

  const grouped = groupBy(data, groupingField);

  const defaultMetric = { totalScore: 0, masteryScore: 0 };

  const reduced = Object.keys(grouped).reduce((result, field) => {
    const students = grouped[field];

    const gatheredStudents = students.reduce(
      (gathered, student) => {
        const standardMetrics = Object.keys(student.standardMetrics);

        return {
          ...student,
          [groupingField]: student[groupingField],
          standardMetrics: standardMetrics.reduce(
            (reducedMetrics, standardId) => ({
              ...reducedMetrics,
              [standardId]: {
                [viewByMetric]: standardId,
                totalScore:
                  (gathered.standardMetrics[standardId] || defaultMetric).totalScore +
                  student.standardMetrics[standardId].totalScore / students.length,
                masteryScore:
                  (gathered.standardMetrics[standardId] || defaultMetric).masteryScore +
                  student.standardMetrics[standardId].masteryScore / students.length
              }
            }),
            {}
          )
        };
      },
      {
        standardMetrics: {}
      }
    );

    return {
      ...result,
      [field]: gatheredStudents
    };
  }, {});

  return Object.values(reduced);
};

const analysisDataSource = (compareBy, studInfo, teacherInfo) => ({
  dataSource: [compareByMode.SCHOOL, compareByMode.TEACHER, compareByMode.CLASS].includes(compareBy)
    ? teacherInfo
    : studInfo,
  dataField: compareByColumns[compareBy].key
});

const analysisStandardsData = (viewBy, compareBy, studInfo, teacherInfo, metricInfo) => {
  const { dataSource, dataField } = analysisDataSource(compareBy, studInfo, teacherInfo);

  const metricInfoWithStudentInfo = augmentMetricInfoWithStudentInfo(studInfo, teacherInfo, metricInfo);

  const data = dataSource.map(item => {
    const metrics = metricInfoWithStudentInfo.filter(metric => metric[dataField] === item[dataField]);

    const metricsGroupedByStandard = groupBy(metrics, "standardId");

    const metricsWithAverageScore = Object.keys(metricsGroupedByStandard).reduce(
      (result, standardId) => ({
        ...result,
        [standardId]: metricsGroupedByStandard[standardId].reduce(
          (reducedStandard, standard) => {
            const total = metricsGroupedByStandard[standardId].length;

            const average = reducedStandard.totalScore + standard.totalScore / standard.maxScore / total;
            const masteryAverage = reducedStandard.masteryScore + standard.masteryScore / total;

            return {
              standardId,
              totalScore: average,
              masteryScore: masteryAverage
            };
          },
          {
            totalScore: 0,
            masteryScore: 0
          }
        )
      }),
      {}
    );

    return {
      ...item,
      standardMetrics: metricsWithAverageScore
    };
  });

  return groupAnalysisByCompare(data, viewBy, compareBy);
};

const analysisDomainsData = (viewBy, compareBy, studInfo, teacherInfo, skillInfo, metricInfo) => {
  const { dataSource, dataField } = analysisDataSource(compareBy, studInfo, teacherInfo);

  const skillsByStandardId = groupBy(skillInfo, "standardId");

  const domainByStandardId = skillInfo.reduce((total, skill) => {
    return {
      ...total,
      [skill.standardId]: skillsByStandardId[skill.standardId][0].domainId
    };
  }, {});

  const metricInfoWithStudentInfo = augmentMetricInfoWithStudentInfo(studInfo, teacherInfo, metricInfo);

  const defaultDomain = { totalScore: 0, masteryScore: 0 };

  const data = dataSource.map(item => {
    const standardMetrics = metricInfoWithStudentInfo.filter(metric => metric[dataField] === item[dataField]);

    const metricsByStandardId = groupBy(standardMetrics, "standardId");

    const metricsLength = Object.keys(metricsByStandardId).length || 1;

    const averageByStandardId = Object.keys(metricsByStandardId).reduce((total, standardId) => {
      const amountOfMetrics = metricsByStandardId[standardId].length || 1;

      const metrics = metricsByStandardId[standardId].reduce(
        (result, metric) => ({
          standardId,
          totalScore: result.totalScore + metric.totalScore / metric.maxScore / amountOfMetrics,
          masteryScore: result.masteryScore + metric.masteryScore / amountOfMetrics
        }),
        {
          totalScore: 0,
          masteryScore: 0
        }
      );

      const domainId = domainByStandardId[metrics.standardId];

      return {
        ...total,
        [domainId]: {
          domainId: domainByStandardId[metrics.standardId],
          totalScore: (total[domainId] || defaultDomain).totalScore + metrics.totalScore / metricsLength,
          masteryScore: (total[domainId] || defaultDomain).masteryScore + metrics.masteryScore / metricsLength
        }
      };
    }, {});

    return {
      ...item,
      standardMetrics: averageByStandardId
    };
  });

  return groupAnalysisByCompare(data, viewBy, compareBy);
};

const augmentMetricInfoWithMasteryScore = report => {
  const { scaleInfo, metricInfo } = report;
  const worstMastery = last(scaleInfo);

  const scaleByThreshold = score => scale => score >= scale.threshold;

  return metricInfo.map(metric => {
    const { totalScore, maxScore } = metric;
    const relativeScore = (totalScore / maxScore) * 100;

    const masteryLevel = scaleInfo.find(scaleByThreshold(relativeScore));

    return {
      ...metric,
      masteryScore: (masteryLevel || worstMastery).score
    };
  });
};

export const chartParseData = (report, viewBy, filter) => {
  const augumentedReport = {
    ...report,
    metricInfo: augmentMetricInfoWithMasteryScore(report)
  };

  switch (viewBy) {
    case "standards":
      return chartDataByStandards(augumentedReport, filter);
    case "domains":
      return chartDataByDomains(augumentedReport, filter);
    default:
      return [];
  }
};

export const analysisParseData = (report, viewBy, compareBy) => {
  const { studInfo, teacherInfo, skillInfo } = report;

  const metricInfo = augmentMetricInfoWithMasteryScore(report);

  switch (viewBy) {
    case viewByMode.STANDARDS:
      return analysisStandardsData(viewBy, compareBy, studInfo, teacherInfo, metricInfo);
    case viewByMode.DOMAINS:
      return analysisDomainsData(viewBy, compareBy, studInfo, teacherInfo, skillInfo, metricInfo);
    default:
      return [];
  }
};

export const reduceAverageStandardScore = (data, field) => {
  if (!data.length) {
    return {};
  }

  const standards = Object.keys(data[0].standardMetrics);

  return standards.reduce((pointsByStandards, standardId) => {
    const averagePoints = data.reduce((total, item) => total + item.standardMetrics[standardId][field], 0);

    return {
      ...pointsByStandards,
      [standardId]: averagePoints / data.length
    };
  }, {});
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

  const item = find(groupedSkillInfo[dataGroup], item => item[field] == id) || {};

  return item;
};

export const getParsedGroupedMetricData = (report = {}, chartFilters, viewBy) => {
  const { metricInfo = {}, scaleInfo = {}, skillInfo = [], studInfo = [], teacherInfo = [] } = report;

  const groupByKey = viewBy === viewByMode.STANDARDS ? "standardId" : "domainId";

  let filteredMetrics = chartFilterMetricInfo(studInfo, metricInfo, teacherInfo, chartFilters, skillInfo);

  const parsedMetricInfo = map(filteredMetrics, metric => {
    const masteryPercentage = percentage(metric.totalScore, metric.maxScore);
    const masteryLevel = getMasteryLevel(masteryPercentage, scaleInfo);
    const skill = findSkillUsingStandard(metric.standardId, skillInfo);

    return {
      ...metric,
      masteryScore: masteryLevel.score,
      masteryLabel: masteryLevel.masteryLabel,
      domainId: skill.domainId,
      domain: skill.domain,
      standard: skill.standard
    };
  });

  let metricByViewBy = groupBy(parsedMetricInfo, groupByKey);
  let metricByViewByWithMasteryCount = {};

  for (const viewByKey in metricByViewBy) {
    metricByViewByWithMasteryCount[viewByKey] = {};

    forEach(scaleInfo, scale => {
      metricByViewByWithMasteryCount[viewByKey][scale.masteryLabel] = 0;
      metricByViewByWithMasteryCount[viewByKey][`${scale.masteryLabel} Percentage`] = 0;
    });

    const metricByMastery = groupBy(metricByViewBy[viewByKey], "masteryLabel");

    Object.keys(metricByMastery).forEach(key => {
      const masteryScorePercentage = round(percentage(metricByMastery[key].length, metricByViewBy[viewByKey].length));
      metricByViewByWithMasteryCount[viewByKey][key] = metricByMastery[key].length;
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
