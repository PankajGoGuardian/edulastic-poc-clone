import { isEmpty, get, keyBy } from 'lodash'
import {
  incorrect,
  yellow1,
  linkColor1,
  themeColorLighter,
  darkBlue2,
} from '@edulastic/colors'
import { isPracticeUsage } from '../../../author/ItemDetail/Transformer'

export const NUMBER_OF_BARS = 10

export const bars = {
  correctAttemps: {
    className: 'correctAttemps',
    yAxisId: 'left',
    stackId: 'a',
    dataKey: 'correctAttemps',
    fill: themeColorLighter,
  },
  incorrectAttemps: {
    className: 'incorrectAttemps',
    yAxisId: 'left',
    stackId: 'a',
    dataKey: 'incorrectAttemps',
    fill: incorrect,
  },
  partialAttempts: {
    className: 'partialAttempts',
    yAxisId: 'left',
    stackId: 'a',
    dataKey: 'partialAttempts',
    fill: yellow1,
  },
  skippedNum: {
    className: 'skippedNum',
    yAxisId: 'left',
    stackId: 'a',
    dataKey: 'skippedNum',
    fill: linkColor1,
  },
  manualGradedNum: {
    className: 'manualGradedNum',
    yAxisId: 'left',
    stackId: 'a',
    dataKey: 'manualGradedNum',
    fill: darkBlue2,
  },
}

export const convertData = (questionActivities, testItems) => {
  let maxAttemps = 0
  let maxTimeSpent = 0
  let data = []

  if (isEmpty(questionActivities)) {
    return [maxAttemps, maxTimeSpent, data]
  }

  const activitiesByQid = keyBy(questionActivities, 'qid')

  data = testItems
    .reduce((acc, curr) => [...acc, ...get(curr, 'data.questions', [])], [])
    .filter((x) => !x.scoringDisabled)
    .map((question, index) => {
      const { barLabel } = question
      const questionActivity = {
        index,
        qid: question.id,
        name: barLabel,
        totalAttemps: 0,
        correctAttemps: 0,
        partialAttempts: 0,
        incorrectAttemps: 0,
        notStarted: true,
        itemLevelScoring: false,
        itemId: null,
        avgTimeSpent: 0,
        skippedNum: 0,
        notStartedNum: 0,
        timeSpent: 0,
        manualGradedNum: 0,
      }

      const activity = activitiesByQid[question.id]
      if (isEmpty(activity)) {
        return questionActivity
      }
      const {
        testItemId,
        graded,
        score,
        maxScore,
        timeSpent,
        pendingEvaluation,
        correct,
      } = activity
      let { notStarted, skipped } = activity
      const practiceUsage = isPracticeUsage([question])
      let skippedx = false

      if (testItemId) {
        questionActivity.itemLevelScoring = true
        questionActivity.itemId = testItemId
      }

      if (!notStarted) {
        questionActivity.totalAttemps += 1
      } else if (score > 0 || practiceUsage) {
        notStarted = false
      } else {
        questionActivity.notStartedNum += 1
      }

      if (skipped && score === 0) {
        questionActivity.skippedNum += 1
        skippedx = true
      }

      if (score > 0) {
        skipped = false
      }

      if (
        (graded === false && !notStarted && !skipped && !score) ||
        pendingEvaluation
      ) {
        questionActivity.manualGradedNum += 1
      } else if (
        (score === maxScore && !notStarted && score > 0) ||
        (practiceUsage && correct)
      ) {
        questionActivity.correctAttemps += 1
      } else if (
        score === 0 &&
        !notStarted &&
        (maxScore > 0 || practiceUsage) &&
        !skippedx
      ) {
        questionActivity.incorrectAttemps += 1
      } else if (score > 0 && score < maxScore) {
        questionActivity.partialAttempts += 1
      }
      if (timeSpent && !notStarted) {
        questionActivity.timeSpent += timeSpent
      }

      questionActivity.avgTimeSpent =
        questionActivity.timeSpent / (questionActivity.totalAttemps || 1)

      if (questionActivity.totalAttemps > maxAttemps) {
        maxAttemps = questionActivity.totalAttemps
      }
      if (questionActivity.avgTimeSpent > maxTimeSpent) {
        maxTimeSpent = questionActivity.avgTimeSpent
      }

      return questionActivity
    })

  return [maxAttemps, maxTimeSpent, data]
}
