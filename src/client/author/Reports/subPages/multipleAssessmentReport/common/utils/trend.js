import next from "immer";
import { groupBy, map, sumBy, forEach, find, round, head, values, filter, orderBy, maxBy } from "lodash";
import { filterAccordingToRole, percentage } from "../../../../common/util";

import dropDownData from "../static/json/dropDownData.json";

const sanitizeNullNumberFields = (records, fields = []) => {
  let allAbsent = true;
  const sanitizedRecords = map(records, record => {
    return next(record, draftRecord => {
      forEach(fields, field => {
        if (record[field] === null || typeof record[field] === "undefined") {
          draftRecord[field] = 0;
        }
        // progressStatus 2 is absent
        if (allAbsent && record.progressStatus !== 2) {
          allAbsent = false;
        }
      });
    });
  });
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
  student: "studentName"
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
          find(dataSource, school => {
            return metric.id === school.schoolId;
          }) || {};

        return { ...metric, ...relatedSchool };
      });
    case "group":
      return map(metricInfo, metric => {
        const relatedGroup =
          find(dataSource, school => {
            return metric.id === school.groupId;
          }) || {};

        return { ...metric, ...relatedGroup };
      });
    case "teacher":
      return map(metricInfo, metric => {
        const relatedTeacher =
          find(dataSource, school => {
            return metric.id === school.teacherId;
          }) || {};

        return { ...metric, ...relatedTeacher };
      });
    case "student":
      return map(metricInfo, metric => {
        const firstTest = head(values(metric.tests)) || {};
        const firstRecord = head(firstTest.records || []) || {};
        const { firstName = "", lastName = "", groupId = "" } = firstRecord;
        return { ...metric, firstName, lastName, studentName: `${firstName} ${lastName}`, groupId };
      });
    default:
      return [];
  }
};

export const parseTrendData = (metricInfo = [], compareBy = "", orgData = [], selectedTrend = "") => {
  const groupedMetric = groupByCompareKey(metricInfo, compareBy);

  const parsedGroupedMetric = map(groupedMetric, (value, metricId) => {
    const groupByTests = groupBy(value, "testId");
    const tests = {};
    const { sisId, assignmentId, testActivityId, assessmentDate } = value[0];

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
    return {
      tests,
      studentCount: maxBy(values(tests), "studentCount").studentCount,
      id: metricId,
      assessmentDate: assessmentDate,
      sisId,
      assignmentId,
      testActivityId
    };
  });

  const [dataWithTrend, trendCount] = calculateTrend(parsedGroupedMetric);
  const augmentedData = augmentWithData(dataWithTrend, compareBy, orgData);
  const filteredTrendData = filter(augmentedData, record => (selectedTrend ? record.trend === selectedTrend : true));
  const sortedFilteredTrendData = orderBy(filteredTrendData, [compareByMap[compareBy]], ["asc"]);
  return [sortedFilteredTrendData, trendCount];
};

export const calculateTrend = groupedData => {
  let counts = {
    up: 0,
    flat: 0,
    down: 0
  };

  const dataWithTrend = map(groupedData, d => {
    let slope = 0,
      sum_xy = 0,
      sum_xx = 0,
      sum_x = 0,
      sum_y = 0,
      trend = "flat";
    let allAssessments = values(d.tests)
      .filter(a => !a.allAbsent)
      .sort(function(a, b) {
        return a.records[0].assessmentDate - b.records[0].assessmentDate;
      });

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
