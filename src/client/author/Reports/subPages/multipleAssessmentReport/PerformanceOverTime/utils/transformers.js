import next from "immer";
import moment from "moment";
import { groupBy, sumBy, round, maxBy, minBy, get, map, head, forEach, values, reduce, capitalize } from "lodash";
import { percentage, getLeastProficiencyBand } from "../../../../common/util";

export const convertToBandData = (metricInfo = [], bandInfo = []) => {
  const leastProficiency = getLeastProficiencyBand(bandInfo);

  // add default scale information
  const defaultScaleData = reduce(
    bandInfo,
    (result, band) => {
      result[band.name] = 0;
      result[`${band.name} Percentage`] = 0;
      return result;
    },
    {
      aboveStandard: 0,
      belowStandard: 0,
      "aboveStandard Percentage": 0,
      "belowStandard Percentage": 0
    }
  );

  const convertedBandData = map(metricInfo, metric => {
    let scaleData = { ...defaultScaleData };

    forEach(metric.records, record => {
      scaleData[record.bandName] = parseInt(record.totalAssigned);
      const calculatedPercentage = round(percentage(parseInt(record.totalAssigned), parseInt(metric.totalAssigned)));
      scaleData[`${record.bandName} Percentage`] =
        record.bandName == leastProficiency.name ? -calculatedPercentage : calculatedPercentage;

      if (parseInt(record.aboveStandard) > 0) {
        scaleData["aboveStandard"] += parseInt(record.totalAssigned);
      } else {
        scaleData["belowStandard"] += parseInt(record.totalAssigned);
      }
    });

    scaleData["aboveStandard Percentage"] = round(percentage(scaleData.aboveStandard, metric.totalAssigned));
    scaleData["belowStandard Percentage"] = -round(percentage(scaleData.belowStandard, metric.totalAssigned));

    return {
      ...scaleData,
      testName: metric.testName,
      testId: metric.testId,
      uniqId: metric.uniqId
    };
  });

  return convertedBandData;
};

export const augmentTestData = (metricInfo = [], testData = []) => {
  if (!metricInfo.length) {
    return [];
  }

  const groupedByTest = groupBy(testData, "testId");

  return map(metricInfo, metric => {
    return next(metric, draftMetric => {
      const selectedTestRecords = groupedByTest[metric.testId];
      const selectedTest = head(selectedTestRecords);

      draftMetric.testName = "N/A";
      draftMetric.totalTestItems = 0;

      if (selectedTest) {
        draftMetric.testName = selectedTest.testName || "N/A";
        draftMetric.totalTestItems = selectedTest.totalTestItems || 0;
      }
    });
  });
};

export const parseData = (rawData = {}) => {
  const { metricInfo = [], bandInfo = {} } = rawData;

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

  const parsedData = map(groupedTestsByType, records => {
    const { assessmentDate, testId, testType } = records[0];
    const totalAssigned = sumBy(records, test => parseInt(test.totalAssigned));
    const totalScore = sumBy(records, test => parseFloat(test.totalScore || 0));
    const totalMaxScore = sumBy(records, test => parseFloat(test.maxScore || 0) * parseInt(test.totalAssigned));

    const score = round(percentage(totalScore, totalMaxScore));
    const rawScore = totalScore / totalAssigned;
    const assessmentDateFormatted = assessmentDate ? moment(parseInt(assessmentDate)).format("MMMM DD, YYYY") : "N/A";

    return {
      maxScore: get(maxBy(records, "maxScore"), "maxScore", 0),
      minScore: get(minBy(records, "minScore"), "minScore", 0),
      maxPossibleScore: records[0].maxPossibleScore,
      totalAbsent: sumBy(records, test => parseInt(test.totalAbsent)),
      totalGraded: sumBy(records, test => parseInt(test.totalGraded)),
      diffScore: 100 - round(score),
      testId,
      uniqId: testId + testType,
      testType: capitalize(testType),
      assessmentDate,
      assessmentDateFormatted,
      totalAssigned,
      totalScore,
      totalMaxScore,
      score,
      rawScore,
      records
    };
  });

  return parsedData;
};
