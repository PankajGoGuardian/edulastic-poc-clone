import { isEmpty, get, keyBy } from 'lodash'
import {
  incorrect,
  yellow1,
  linkColor1,
  themeColorLighter,
  darkBlue2,
  greyLight1,
} from '@edulastic/colors'
import {
  testActivityStatus as testActivityStatusConstants,
  questionType,
} from '@edulastic/constants'

const { SUBMITTED } = testActivityStatusConstants

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
  unscoredItems: {
    className: 'unscoredItems',
    yAxisId: 'left',
    stackId: 'a',
    dataKey: 'unscoredItems',
    fill: greyLight1,
  },
}

export const convertData = (
  questionActivities,
  testItems,
  testActivityStatus
) => {
  let maxAttemps = 0
  let maxTimeSpent = 0
  let data = []

  if (isEmpty(questionActivities)) {
    return [maxAttemps, maxTimeSpent, data]
  }

  const activitiesByQid = keyBy(questionActivities, 'qid')
  const testItemById = keyBy(testItems, '_id')

  data = testItems
    .reduce((acc, curr) => [...acc, ...get(curr, 'data.questions', [])], [])
    .filter((x) => !x.scoringDisabled && x.type !== questionType.SECTION_LABEL)
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
        unscoredItems: 0,
      }

      const activity = activitiesByQid[question.id]
      if (isEmpty(activity)) {
        questionActivity.skippedNum = testActivityStatus === SUBMITTED ? 1 : 0
        return questionActivity
      }
      const {
        testItemId,
        graded,
        score,
        maxScore,
        timeSpent,
        pendingEvaluation,
      } = activity
      let { notStarted, skipped } = activity
      const { isPractice } = activity
      let skippedx = false

      if (testItemId) {
        questionActivity.itemLevelScoring = true
        questionActivity.itemId = testItemId
        if (skipped === true && testItemById[testItemId]) {
          const testItemQuestionsIds =
            testItemById[testItemId].data?.questions?.map(({ id }) => id) || []

          const itemUQAs = testItemQuestionsIds.map(
            (qId) => activitiesByQid[qId]
          )

          let skippedUQACount = testItemQuestionsIds.length - itemUQAs.length
          for (const q of itemUQAs) {
            if (q.skipped === true) {
              skippedUQACount++
            }
          }
          if (skippedUQACount !== testItemQuestionsIds.length) {
            skipped = false
          }
        }
      }

      if (!notStarted) {
        questionActivity.totalAttemps += 1
      } else if (score > 0) {
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
      if (isPractice) {
        questionActivity.unscoredItems += 1
      } else if (
        (graded === false && !notStarted && !skipped && !score) ||
        pendingEvaluation
      ) {
        questionActivity.manualGradedNum += 1
      } else if (score === maxScore && !notStarted && score > 0) {
        questionActivity.correctAttemps += 1
      } else if (score === 0 && !notStarted && maxScore > 0 && !skippedx) {
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
