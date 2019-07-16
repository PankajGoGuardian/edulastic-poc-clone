import { groupBy, map, sumBy, forEach, find, round, head, values, filter } from "lodash";
import { getOverallScore } from "../../../../common/util";

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
        const { firstName = "", lastName = "" } = firstRecord;
        return { ...metric, firstName, lastName, studentName: `${firstName} ${lastName}` };
      });
    default:
      return [];
  }
};

export const parseData = (metricInfo = [], compareBy = "") => {
  const groupedMetric = groupByCompareKey(metricInfo, compareBy);

  const parsedGroupedMetric = map(groupedMetric, (value, metricId) => {
    const groupByTests = groupBy(value, "testId");
    const tests = {};

    forEach(groupByTests, (value, key) => {
      tests[key] = {
        records: value,
        score: getOverallScore(value),
        rawScore: `${round(sumBy(value, "totalScore"), 2)} / ${sumBy(value, "maxScore")}`
      };
    });

    return {
      tests,
      id: metricId
    };
  });

  return parsedGroupedMetric;
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
