import { groupBy, map, sumBy, forEach, find, round } from "lodash";
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
        // const { firstName = '', lastName = ''} = metric.tests[0]
        return { ...metric, studentName: "Student Name" };
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
        ...value,
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
