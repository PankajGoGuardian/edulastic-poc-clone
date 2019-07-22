import next from "immer";
import { groupBy, map, sumBy, forEach, find, round, head, values, filter, orderBy, ceil, maxBy } from "lodash";
import { getOverallScore, filterAccordingToRole, getHSLFromRange1 } from "../../../../common/util";

import dropDownData from "../static/json/dropDownData.json";

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
            return metric.id == school.schoolId;
          }) || {};

        return { ...metric, ...relatedSchool };
      });
    case "group":
      return map(metricInfo, metric => {
        const relatedGroup =
          find(dataSource, school => {
            return metric.id == school.groupId;
          }) || {};

        return { ...metric, ...relatedGroup };
      });
    case "teacher":
      return map(metricInfo, metric => {
        const relatedTeacher =
          find(dataSource, school => {
            return metric.id == school.teacherId;
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

export const getLeastProficiencyBand = (bandInfo = []) =>
  orderBy(bandInfo, "threshold", ["desc"])[bandInfo.length - 1] || {};

export const getProficiencyBand = (score, bandInfo, field = "threshold") => {
  const bandInfoWithColor = map(orderBy(bandInfo, "threshold"), (band, index) => {
    return {
      ...band,
      color: getHSLFromRange1(round((100 / (bandInfo.length - 1)) * index))
    };
  });
  const orderedScaleInfo = orderBy(bandInfoWithColor, "threshold", ["desc"]);
  return find(orderedScaleInfo, info => ceil(score) >= info[field]) || getLeastProficiencyBand(orderedScaleInfo);
};

export const parseTrendData = (metricInfo = [], compareBy = "", orgData = [], selectedTrend = "") => {
  const groupedMetric = groupByCompareKey(metricInfo, compareBy);

  const parsedGroupedMetric = map(groupedMetric, (value, metricId) => {
    const groupByTests = groupBy(value, "testId");
    const tests = {};

    forEach(groupByTests, (value, key) => {
      const maxStudents = maxBy(value, item => parseInt(item.studentCount || 0)) || {};
      tests[key] = {
        records: value,
        score: getOverallScore(value),
        rawScore: `${round(sumBy(value, "totalScore"), 2)} / ${sumBy(value, "maxScore")}`,
        studentCount: parseInt(maxStudents.studentCount) || 0
      };
    });

    return {
      tests,
      studentCount: maxBy(values(tests), "studentCount").studentCount,
      id: metricId
    };
  });

  const [dataWithTrend, trendCount] = calculateTrend(parsedGroupedMetric);
  const augmentedData = augmentWithData(dataWithTrend, compareBy, orgData);
  const filteredTrendData = filter(augmentedData, record => (selectedTrend ? record.trend === selectedTrend : true));

  return [filteredTrendData, trendCount];
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
    let allAssessments = values(d.tests).sort(function(a, b) {
      return a.records[0].assessmentDate - b.records[0].assessmentDate;
    });

    const n = allAssessments.length;

    forEach(allAssessments, (ob, index) => {
      sum_x += index + 1;
      sum_y += ob.score;
      sum_xx += (index + 1) * (index + 1);
      sum_xy += (index + 1) * ob.score;
    });

    if (n === 0 || n === 1) {
      trend = "No Trend";
      return {
        ...d,
        trend
      };
    }

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
      trend
    };
  });

  return [dataWithTrend, counts];
};
