import { isEmpty, get } from "lodash";
import { incorrect, yellow1, linkColor1, themeColorLighter, darkBlue2 } from "@edulastic/colors";

export const NUMBER_OF_BARS = 10;

export const bars = {
  correctAttemps: {
    className: "correctAttemps",
    yAxisId: "left",
    stackId: "a",
    dataKey: "correctAttemps",
    fill: themeColorLighter
  },
  incorrectAttemps: {
    className: "incorrectAttemps",
    yAxisId: "left",
    stackId: "a",
    dataKey: "incorrectAttemps",
    fill: incorrect
  },
  partialAttempts: {
    className: "partialAttempts",
    yAxisId: "left",
    stackId: "a",
    dataKey: "partialAttempts",
    fill: yellow1
  },
  skippedNum: {
    className: "skippedNum",
    yAxisId: "left",
    stackId: "a",
    dataKey: "skippedNum",
    fill: linkColor1
  },
  manualGradedNum: {
    className: "manualGradedNum",
    yAxisId: "left",
    stackId: "a",
    dataKey: "manualGradedNum",
    fill: darkBlue2
  }
};

export const convertData = (questionActivities, testItems) => {
  let maxAttemps = 0;
  let maxTimeSpent = 0;
  let data = [];
  if (isEmpty(questionActivities)) {
    return [maxAttemps, maxTimeSpent, data];
  }

  const testItemsById = testItems.reduce((acc, curr) => {
    acc[curr._id] = curr;
    return acc;
  }, {});

  data = questionActivities
    .filter(x => !x.disabled)
    .map((activity, index) => {
      const { _id, testItemId, graded, score, qLabel, timeSpent, pendingEvaluation } = activity;
      const maxScore = get(testItemsById[testItemId], "maxScore", activity.maxScore);

      let { notStarted, skipped } = activity;
      let skippedx = false;

      const questionActivity = {
        qid: _id,
        index,
        name: qLabel,
        totalAttemps: 0,
        correctAttemps: 0,
        partialAttempts: 0,
        incorrectAttemps: 0,
        itemLevelScoring: false,
        itemId: null,
        avgTimeSpent: 0,
        skippedNum: 0,
        notStartedNum: 0,
        timeSpent: 0,
        manualGradedNum: 0
      };

      if (testItemId) {
        questionActivity.itemLevelScoring = true;
        questionActivity.itemId = testItemId;
      }

      if (!notStarted) {
        questionActivity.totalAttemps += 1;
      } else if (score > 0) {
        notStarted = false;
      } else {
        questionActivity.notStartedNum += 1;
      }

      if (skipped && score === 0) {
        questionActivity.skippedNum += 1;
        skippedx = true;
      }
      if (score > 0) {
        skipped = false;
      }

      if ((graded === false && !notStarted && !skipped && !score) || pendingEvaluation) {
        questionActivity.manualGradedNum += 1;
      } else if (score === maxScore && !notStarted && score > 0) {
        questionActivity.correctAttemps += 1;
      } else if (score === 0 && !notStarted && maxScore > 0 && !skippedx) {
        questionActivity.incorrectAttemps += 1;
      } else if (score > 0 && score < maxScore) {
        questionActivity.partialAttempts += 1;
      }
      if (timeSpent && !notStarted) {
        questionActivity.timeSpent += timeSpent;
      }

      questionActivity.avgTimeSpent = questionActivity.timeSpent / (questionActivity.totalAttemps || 1);

      if (questionActivity.totalAttemps > maxAttemps) {
        maxAttemps = questionActivity.totalAttemps;
      }
      if (questionActivity.avgTimeSpent > maxTimeSpent) {
        maxTimeSpent = questionActivity.avgTimeSpent;
      }

      return questionActivity;
    });

  return [maxAttemps, maxTimeSpent, data];
};
