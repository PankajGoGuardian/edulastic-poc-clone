import { createSelector } from 'reselect'
import { last } from 'lodash'
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

export const getIsAntiCheatingEnabled = createSelector(
  stateSelector,
  (state) => state.isAntiCheatingEnabled
)

export const getItemGroupsSelector = createSelector(
  stateSelector,
  (state) => state.itemGroups
)

export const getPreventSectionNavigationSelector = createSelector(
  stateSelector,
  (state) => state.preventSectionNavigation
)

export const getAssignmentSettingsSelector = createSelector(
  stateSelector,
  (state) => state.settings
)

export const hasSectionsSelector = createSelector(
  stateSelector,
  (state) => state.hasSections
)

export const routeSelector = (state) => state.router.location.pathname

/* 
  Always expecting itemId in url and last value in url to be the itemId. 
  Split the url with "/" will return an array of values where last value 
  will be the current attempting ItemId and with this it is easy to find 
  the section being attempted. 
*/
export const getSectionIdSelector = createSelector(
  getItemGroupsSelector,
  routeSelector,
  (itemGroups, path) => {
    const itemId = last(path.split('/'))
    const { _id: currentSectionId } =
      itemGroups?.find(({ items }) => items.some((i) => i._id === itemId)) || {}
    return currentSectionId
  }
)

export const getCalcTypeSelector = createSelector(
  getItemGroupsSelector,
  hasSectionsSelector,
  getSectionIdSelector,
  getAssignmentSettingsSelector,
  (itemGroups, hasSections, sectionId, assignmentSettings) => {
    let calcTypes = assignmentSettings.calcTypes
    if (hasSections && itemGroups.length && sectionId) {
      const { settings: currentSectionTestSettings } =
        itemGroups?.find((item) => item._id === sectionId) || {}
      if (currentSectionTestSettings?.calcTypes?.length > 0)
        calcTypes = currentSectionTestSettings.calcTypes
    }
    return calcTypes
  }
)

/* 
  To disable items in question dropdown. This creates a map of true false with item index as the key. 
  For the section being attempted will be always false and items in other sections will be disabled true.
  eg:
  [0]: false
  [1]: false
  [2]: true
  [3]: true
  where 0 and 1 are from section 1 and currently attempting first question
*/
export const getDisabledQuestionDropDownIndexMapSelector = createSelector(
  getSectionIdSelector,
  getItemGroupsSelector,
  getPreventSectionNavigationSelector,
  (sectionId, itemGroups, preventSectionNavigation) => {
    const disabledItems = {}
    // TODO: In teacher preview sectionId has to be derived. As there is no itemId in url params.
    if (!preventSectionNavigation || !sectionId) {
      return disabledItems
    }
    let index = 0
    for (const itemGroup of itemGroups) {
      itemGroup.items.forEach(
        // eslint-disable-next-line no-loop-func
        () => {
          disabledItems[index] = itemGroup._id !== sectionId
          index++
        }
      )
    }

    return disabledItems
  }
)
