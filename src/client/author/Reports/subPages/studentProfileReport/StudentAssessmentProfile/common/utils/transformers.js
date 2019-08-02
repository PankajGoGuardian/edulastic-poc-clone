import moment from "moment";
import { map, get, find, round, sumBy } from "lodash";

export const getData = (rawData = {}, tests = [], bandInfo = []) => {
  if (!tests.length) {
    return [];
  }

  const { districtAvg = [], groupAvg = [], schoolAvg = [] } = rawData;

  const parsedData = map(tests, test => {
    const { testType, testId, assignments } = test;

    const testInfo = { testId };

    const testDistrictAvg = round(get(find(districtAvg, testInfo), "districtAvgPerf", 0));
    const testGroupAvg = round(get(find(groupAvg, testInfo), "groupAvgPerf", 0));
    const testSchoolAvg = round(get(find(schoolAvg, testInfo), "schoolAvgPerf", 0));
    const rawScore = `${round(sumBy(assignments, "score"), 2)} / ${round(sumBy(assignments, "maxScore"), 2)}`;

    const assignmentDateFormatted = test.assignmentDate
      ? moment(parseInt(test.assignmentDate)).format("MMMM DD, YYYY")
      : "N/A";

    return {
      totalQuestions: 0,
      ...test,
      assignmentDateFormatted,
      districtAvg: testDistrictAvg,
      groupAvg: testGroupAvg,
      schoolAvg: testSchoolAvg,
      rawScore
    };
  });

  return parsedData;
};
