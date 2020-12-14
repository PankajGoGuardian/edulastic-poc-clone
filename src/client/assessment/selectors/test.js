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
    const [itemId, qId] = key.split('_')
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

export const playerSkinTypeSelector = createSelector(stateSelector, (state) => {
  const { playerSkinType } = state

  // TODO: need to remove once test APIs are done
  if (playerSkinType === playerSkinValues.testlet) {
    return playerSkinValues.testlet
  }

  if (playerSkinType === playerSkinValues.cmas) {
    return playerSkinValues.parcc
  }
  if (playerSkinType === playerSkinValues.casspp) {
    return playerSkinValues.sbac
  }
  return playerSkinType || playerSkinValues.edulastic
})
