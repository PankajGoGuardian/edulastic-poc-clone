import moment from "moment";
import { map, get, find, round, sumBy, groupBy, capitalize, reduce, values } from "lodash";
import { percentage, getProficiencyBand } from "../../../../../common/util";

export const getData = (rawData = {}, bandInfo = []) => {
  const { districtAvg = [], groupAvg = [], metricInfo = [], schoolAvg = [] } = rawData;

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

    const testInfo = { testId };

    const testDistrictAvg = round(get(find(districtAvg, testInfo), "districtAvgPerf", 0));
    const testGroupAvg = round(get(find(groupAvg, testInfo), "groupAvgPerf", 0));
    const testSchoolAvg = round(get(find(schoolAvg, testInfo), "schoolAvgPerf", 0));
    const scoreAvg = round(percentage(sumBy(assignments, "score"), sumBy(assignments, "maxScore")));
    const rawScore = `${round(sumBy(assignments, "score"), 2)} / ${round(sumBy(assignments, "maxScore"), 2)}`;

    const assignmentDateFormatted = assignment.assignmentDate
      ? moment(parseInt(assignment.assignmentDate)).format("MMMM DD, YYYY")
      : "N/A";
    const band = getProficiencyBand(scoreAvg, bandInfo);

    return {
      totalQuestions: 0,
      ...assignment,
      assignmentDateFormatted,
      districtAvg: testDistrictAvg,
      groupAvg: testGroupAvg,
      schoolAvg: testSchoolAvg,
      score: scoreAvg,
      uniqId: testId + testType,
      testType: capitalize(testType),
      diffScore: 100 - scoreAvg,
      rawScore,
      band
    };
  });

  return parsedData;
};
