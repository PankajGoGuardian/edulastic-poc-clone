import next from "immer";
import moment from "moment";
import { groupBy, sumBy, round, maxBy, minBy, get, map, head, forEach } from "lodash";
import { percentage } from "../../../../common/util";
import { getLeastProficiencyBand } from "../../common/utils/trend";

export const convertToBandData = (metricInfo = [], bandInfo = []) => {
  const convertedBandData = map(metricInfo, metric => {
    let scaleData = {
      aboveStandard: 0,
      belowStandard: 0
    };

    forEach(metric.records, record => {
      scaleData[record.bandName] = parseInt(record.totalAssigned);
      const calculatedPercentage = round(percentage(parseInt(record.totalAssigned), metric.totalAssigned));
      scaleData[`${record.bandName} Percentage`] =
        record.bandName == getLeastProficiencyBand(bandInfo).name ? -calculatedPercentage : calculatedPercentage;

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
      testId: metric.testId
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
  const parsedData = map(groupedByTest, (records, testId) => {
    const totalAssigned = sumBy(records, test => parseInt(test.totalAssigned));
    const totalScore = sumBy(records, "totalScore");
    const totalMaxScore = sumBy(records, test => test.maxScore * parseInt(test.totalAssigned));
    const score = round(percentage(totalScore, totalMaxScore));
    const rawScore = totalScore / totalAssigned;
    const assessmentDate = records[0].assessmentDate;
    const assessmentDateFormatted = assessmentDate ? moment(parseInt(assessmentDate)).format("MMMM DD, YYYY") : "N/A";

    return {
      testId,
      maxScore: get(maxBy(records, "maxScore"), "maxScore", 0),
      minScore: get(minBy(records, "minScore"), "minScore", 0),
      maxPossibleScore: records[0].maxPossibleScore,
      totalAbsent: sumBy(records, test => parseInt(test.totalAbsent)),
      totalGraded: sumBy(records, test => parseInt(test.totalGraded)),
      assessmentDate,
      assessmentDateFormatted,
      totalAssigned,
      totalScore,
      totalMaxScore,
      score,
      rawScore,
      records,
      diffScore: 100 - round(score)
    };
  });

  return parsedData;
};
