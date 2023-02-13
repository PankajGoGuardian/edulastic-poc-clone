import { createSelector } from 'reselect'
import { test as testConstants } from '@edulastic/constants'
import { getAnswersListSelector } from './answers'

const { playerSkinValues } = testConstants

const stateSelector = (state) => state.test

export const currentItemIndexSelector = createSelector(
  stateSelector,
  (state) => state.currentItem
)

export const itemsSelector = createSelector(
  stateSelector,
  (state) => state.items
)

export const currentItemSelector = createSelector(
  itemsSelector,
  currentItemIndexSelector,
  (items, index) => items[index]
)

export const currentQuestions = createSelector(currentItemSelector, (item) => {
  const rows = Array.isArray(item.rows) ? item.rows : []
  return rows.reduce((acc, row) => {
    const widgets = Array.isArray(row.widgets) ? row.widgets : []
    return [...acc, ...widgets]
  }, [])
})

export const answersByQId = (answers, testItemId) => {
  const newAnswers = {}
  Object.keys(answers).forEach((key) => {
    const [itemId, qId] = key.split(/_(.+)/)
    if (testItemId === itemId) {
      // updating answer key as qId itself as it is for a single item evaluation.
      newAnswers[qId] = answers[key]
    }
  })
  return newAnswers
}

export const answersForCheck = createSelector(
  getAnswersListSelector,
  currentItemSelector,
  (answers, item) => answersByQId(answers, item._id)
)

export const itemQuestionsSelector = createSelector(
  currentItemSelector,
  (item) => {
    const questions = []
    item.rows.forEach((row) => {
      row.widgets.forEach((widget) => {
        const qid = widget.reference
        if (qid) questions.push(qid)
      })
    })
    return questions
  }
)

export const testLoadingSelector = createSelector(
  stateSelector,
  (state) => state.loading
)

export const testActivityLoadingSelector = createSelector(
  stateSelector,
  (state) => state.loadingTestActivity
)
export const answerChecksByIdSelector = createSelector(
  stateSelector,
  (state) => state.answerCheckByItemId
)

export const redirectPolicySelector = createSelector(
  stateSelector,
  (state) => state.settings.showPreviousAttempt
)

export const currentItemIdSelector = createSelector(
  currentItemSelector,
  (state) => state?._id
)

export const currentItemAnswerChecksSelector = createSelector(
  currentItemIdSelector,
  answerChecksByIdSelector,
  (current, answerCheckCounts) => answerCheckCounts[current] || 0
)

export const curentPlayerDetailsSelector = createSelector(
  stateSelector,
  (state) => state.currentPlayingDetails
)

export const originalPlayerSkinName = createSelector(stateSelector, (state) => {
  return state.playerSkinType
})

export const playerSkinTypeSelector = createSelector(stateSelector, (state) => {
  const { playerSkinType } = state
  return playerSkinValues[playerSkinType] || playerSkinValues.edulastic
})

export const getSubmitTestCompleteSelector = createSelector(
  stateSelector,
  (state) => state.submitTestComplete
)

export const getPreviewPlayerStateSelector = createSelector(
  stateSelector,
  (state) => ({
    pauseAllowed: state.settings.pauseAllowed,
    allowedTime: state.settings.allowedTime,
    timedAssignment: state.settings.timedAssignment,
    multiLanguageEnabled: state.previewState.multiLanguageEnabled,
    hasInstruction: state.previewState.hasInstruction,
    instruction: state.previewState.instruction,
    languagePreference: state.languagePreference,
    viewTestInfoSuccess: state.viewTestInfoSuccess,
  })
)

export const getIsPreviewModalVisibleSelector = createSelector(
  stateSelector,
  (state) => state.isTestPreviewModalVisible
)

export const checkAnswerInProgressSelector = createSelector(
  stateSelector,
  (test) => test.checkAnswerInProgress
)
