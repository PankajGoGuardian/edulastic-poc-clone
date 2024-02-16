import { scrollTo } from '@edulastic/common'

import {
  incorrect,
  yellow1,
  linkColor1,
  themeColorLighter,
  darkBlue2,
  greyLight1,
  brownDark,
} from '@edulastic/colors'
import produce from 'immer'
import { isEmpty } from 'lodash'

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
  hiddenAttempt: {
    className: 'hiddenAttempt',
    yAxisId: 'left',
    stackId: 'a',
    dataKey: 'hiddenAttempt',
    fill: brownDark,
  },
}

/**
 * @param {string} qid
 */
export const _scrollTo = (qid, el) => {
  /**
   * when lcb-student-sticky-bar is made sticky padding 10px is added, before there is no padding
   * 2 because the position of sticky bar changes when it is made sticky,
   * before it has a proper position with respect to its parent...
   * the position of all the elements changes when sticky bar is made sticky
   */
  scrollTo(
    document.querySelector(`.question-container-id-${qid}`),
    (document.querySelector('.lcb-student-sticky-bar')?.offsetHeight + 10) *
      2 || 0,
    el
  )
}

export const getQuestionStatusCounts = (questionActivities) => {
  const activeQuestions = questionActivities.filter(
    (x) => !(x.disabled || x.scoringDisabled)
  )

  return activeQuestions.reduce(
    (acc, cur) => {
      if (!cur.isPractice && cur.score === cur.maxScore && cur.score > 0) {
        acc.correctNumber += 1
      }
      if (
        !cur.isPractice &&
        cur.score === 0 &&
        cur.maxScore > 0 &&
        cur.graded &&
        !cur.skipped
      ) {
        acc.wrongNumber += 1
      }
      if (!cur.isPractice && cur.score > 0 && cur.score < cur.maxScore) {
        acc.partiallyCorrectNumber += 1
      }
      if (!cur.isPractice && cur.skipped && cur.score === 0) {
        acc.skippedNumber += 1
      }
      if (!cur.isPractice && !cur.skipped && cur.graded === false) {
        acc.notGradedNumber += 1
      }
      if (cur.isPractice) {
        acc.unscoredItems += 1
      }
      return acc
    },
    {
      totalNumber: activeQuestions.length,
      correctNumber: 0,
      wrongNumber: 0,
      partiallyCorrectNumber: 0,
      skippedNumber: 0,
      notGradedNumber: 0,
      unscoredItems: 0,
    }
  )
}

export const getStudentWorkData = (testItem) =>
  produce(testItem, (draft) => {
    const { rows } = draft
    if (!isEmpty(rows)) {
      draft.rows = rows
        .map((row) => {
          let { widgets = [] } = row
          widgets = widgets
            .map((widget) => {
              if (widget.type !== 'passage') {
                return widget
              }
              return null
            })
            .filter((x) => x)
          if (!isEmpty(widgets)) {
            return { ...row, widgets }
          }
          return null
        })
        .filter((x) => x)
    }
  })

export const getEvaluationStatus = (questionActivities) =>
  questionActivities.reduce((acc, curr) => {
    if (curr.pendingEvaluation) {
      acc[`${curr.testItemId}_${curr.qid}`] = 'pending'
    } else {
      acc[`${curr.testItemId}_${curr.qid}`] = curr.evaluation
    }

    return acc
  }, {})

export const getAiEvaluationStatus = (questionActivities) =>
  questionActivities.reduce((acc, curr) => {
    if (curr.aiEvaluationStatus) {
      acc[`${curr.testItemId}_${curr.qid}`] = {
        status: curr.aiEvaluationStatus,
        isGradedExternally: curr.isGradedExternally,
      }
    }
    return acc
  }, {})
