import next from "immer";
import { groupBy, map, sumBy, forEach, find, round, head, values, filter, orderBy, maxBy, isEmpty } from "lodash";
import { filterAccordingToRole, percentage } from "../../../../common/util";

import dropDownData from "../static/json/dropDownData.json";

const sanitizeNullNumberFields = (records, fields = []) => {
  let allAbsent = true;
  const sanitizedRecords = map(records, record => next(record, draftRecord => {
      forEach(fields, field => {
        if (record[field] === null || typeof record[field] === "undefined") {
          draftRecord[field] = 0;
        }
        // progressStatus 2 is absent
        if (allAbsent && record.progressStatus !== 2) {
          allAbsent = false;
        }
      });
    }));
  return { sanitizedRecords, allAbsent };
};

const getOverallScore = (metrics = []) =>
  round(
    percentage(sumBy(metrics, item => parseFloat(item.totalScore)), sumBy(metrics, item => parseFloat(item.maxScore)))
  );

export const compareByMap = {
  school: "schoolName",
  teacher: "teacherName",
  group: "groupName",
  student: "studentName",
  race: "race",
  gender : "gender",
  ellStatus : "ellStatus",
  iepStatus : "iepStatus",
  frlStatus : "frlStatus"
};

const groupByCompareKey = (metricInfo, compareBy) => {
  switch (compareBy) {
    case "school":
      return groupBy(metricInfo, "schoolId");
    case "student":
      return groupBy(metricInfo, "studentId");
    case "group":
      return groupBy(metricInfo, "groupId");
    case "teacher":
      return groupBy(metricInfo, "teacherId");
    case "race":
      return groupBy(metricInfo, "race");
    case "gender":
      return groupBy(metricInfo, "gender");
    case "ellStatus":
      return groupBy(metricInfo, "ellStatus");
    case "iepStatus":
      return groupBy(metricInfo, "iepStatus");
    case "frlStatus":
      return groupBy(metricInfo, "frlStatus");
    default:
      return {};
  }
};

export const getCompareByOptions = (role = "") => filterAccordingToRole(dropDownData.compareByData, role);

export const augmentWithData = (metricInfo = [], compareBy = "", dataSource = []) => {
  switch (compareBy) {
    case "school":
      return map(metricInfo, metric => {
        const relatedSchool =
          find(dataSource, school => metric.id === school.schoolId) || {};

        return { ...metric, ...relatedSchool };
      });
    case "group":
      return map(metricInfo, metric => {
        const relatedGroup =
          find(dataSource, school => metric.id === school.groupId) || {};

        return { ...metric, ...relatedGroup };
      });
    case "teacher":
      return map(metricInfo, metric => {
        const relatedTeacher =
          find(dataSource, school => metric.id === school.teacherId) || {};

        return { ...metric, ...relatedTeacher };
      });
    case "student":
      return map(metricInfo, metric => {
        const firstTest = head(values(metric.tests)) || {};
        const firstRecord = head(firstTest.records || []) || {};
        const { firstName = "", lastName = "", groupId = "" } = firstRecord;
        return { ...metric, firstName, lastName, studentName: `${firstName} ${lastName}`, groupId };
      });
    case "race":
      return metricInfo;
    case "gender":
      return metricInfo;
    case "ellStatus":
      return metricInfo;
    case "iepStatus":
      return metricInfo;
    case "frlStatus":
      return metricInfo;
    default:
      return [];
  }
};

export const parseTrendData = (metricInfo = [], compareBy = "", orgData = [], selectedTrend = "") => {
  const groupedMetric = groupByCompareKey(metricInfo, compareBy);
  const parsedGroupedMetric = map(groupedMetric, (value, metricId) => {
    const groupByTests = groupBy(value, "testId");
    const tests = {};
    const { sisId, assignmentId, testActivityId, assessmentDate, startDate } = value[0];

    forEach(groupByTests, (value, key) => {
      const studentCountKey = compareBy === "group" ? "studentCount" : "totalStudentCount";
      const maxStudents = maxBy(value, item => parseInt(item[studentCountKey] || 0)) || {};
      const { sanitizedRecords, allAbsent } = sanitizeNullNumberFields(value, ["totalScore", "maxScore"]);
      tests[key] = {
        records: value,
        allAbsent,
        score: getOverallScore(sanitizedRecords),
        rawScore: `${(sumBy(sanitizedRecords, "totalScore") || 0).toFixed(2)} / ${sumBy(sanitizedRecords, "maxScore")}`,
        studentCount: parseInt(maxStudents[studentCountKey]) || 0
      };
    });
    const dInfo = {}
    if(["race", "gender", "ellStatus", "iepStatus", "frlStatus"].includes(compareBy)) {
      dInfo[compareBy] = isEmpty(metricId) ? "NA" : metricId;
    }
    return {
      tests,
      studentCount: maxBy(values(tests), "studentCount").studentCount,
      id: metricId,
      assessmentDate,
      startDate,
      sisId,
      assignmentId,
      testActivityId,
      ...dInfo
    };
  });

  const [dataWithTrend, trendCount] = calculateTrend(parsedGroupedMetric);
  const augmentedData = augmentWithData(dataWithTrend, compareBy, orgData);
  const filteredTrendData = filter(augmentedData, record => (selectedTrend ? record.trend === selectedTrend : true));
  const sortedFilteredTrendData = orderBy(filteredTrendData, [compareByMap[compareBy]], ["asc"]);
  return [sortedFilteredTrendData, trendCount];
};

export const calculateTrend = groupedData => {
  const counts = {
    up: 0,
    flat: 0,
    down: 0
  };

  const dataWithTrend = map(groupedData, d => {
    let slope = 0;
      let sum_xy = 0;
      let sum_xx = 0;
      let sum_x = 0;
      let sum_y = 0;
      let trend = "flat";
    const allAssessments = values(d.tests)
      .filter(a => !a.allAbsent)
      .sort((a, b) => a.records[0].startDate - b.records[0].startDate);

    const n = allAssessments.length;

    if (n === 0 || n === 1) {
      trend = "No Trend";
      return {
        ...d,
        trend,
        slope
      };
    }

    forEach(allAssessments, (ob, index) => {
      sum_x += index + 1;
      sum_y += ob.score;
      sum_xx += (index + 1) * (index + 1);
      sum_xy += (index + 1) * ob.score;
    });

    if (n * sum_xy - sum_x * sum_y === 0) {
      trend = "flat";

      if (!counts[trend]) {
        counts[trend] = 0;
      }

      counts[trend]++;
    } else {
      slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);

      if (Math.abs(slope) > 0.01) {
        if (slope > 0) {
          trend = "up";
        } else {
          trend = "down";
        }
      } else {
        trend = "flat";
      }
      if (!counts[trend]) {
        counts[trend] = 0;
      }

      counts[trend]++;
    }

    return {
      ...d,
      trend,
      slope
    };
  });

  return [dataWithTrend, counts];
};
