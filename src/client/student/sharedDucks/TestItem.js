import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { keyBy, get } from 'lodash'
import { releaseGradeLabels } from '@edulastic/constants/const/test'

// types
export const SET_TEST_ITEM = '[studentTestItem] set test item'
export const SET_CURRENT_ITEM = '[studentTestItem] set current item'

// actions
export const setTestItemsAction = createAction(SET_TEST_ITEM)
export const setCurrentItemAction = createAction(SET_CURRENT_ITEM)

// initial state
const initialState = {
  items: [],
  current: 0,
}

// set test items
const setTestItems = (state, { payload }) => {
  state.items = payload
}

// set current item
const setCurrentItem = (state, { payload }) => {
  state.current = payload
}

// reducer
export default createReducer(initialState, {
  [SET_TEST_ITEM]: setTestItems,
  [SET_CURRENT_ITEM]: setCurrentItem,
})

// get testITem questions
export const getTestItemQuestions = (item) => {
  if (item && item.data) {
    const { questions = [], resources = [] } = item.data
    return [...questions, ...resources]
  }
  return []
}
// selectors
const _module = 'studentTestItems'
export const getCurrentItemSelector = (state) => state[_module].current
export const getItemCountSelector = (state) => state[_module].items.length
export const getItemsSelector = (state) => state[_module].items
export const getTestFeedbackSelector = (state) => state.testFeedback
export const userWorkSelector = (state) => state.userWork.present

const studentReport = (state) => state.studentReport

export const getItemSelector = createSelector(
  getItemsSelector,
  getCurrentItemSelector,
  (items, current) => items[current]
)

export const getFeedbackTransformedSelector = createSelector(
  getTestFeedbackSelector,
  studentReport,
  (questionActivities, report) => {
    const releaseScore = get(report, 'testActivity.releaseScore', '')
    if (
      releaseScore === releaseGradeLabels.DONT_RELEASE &&
      questionActivities &&
      questionActivities.length
    ) {
      // mock the uqa score and maxscore so that it will create a graph
      return questionActivities.map((uqa) => ({
        ...uqa,
        score: 0,
        maxScore: 1,
      }))
    }
    return questionActivities
  }
)

// check if a particular has scratchPad data associated.
export const itemHasUserWorkSelector = createSelector(
  getItemSelector,
  (state) => state.userWork,
  (item = {}, userWork) => {
    const itemId = item._id
    return !!itemId && !!userWork.present[item._id]?.scratchpad
  }
)

export const getTestLevelUserWorkSelector = createSelector(
  userWorkSelector,
  (state) => state.attachments
)

export const questionActivityFromFeedbackSelector = createSelector(
  getItemSelector,
  getTestFeedbackSelector,
  (item, questionActivities) => {
    if (item) {
      const questionActivity =
        questionActivities.filter((act) => act.testItemId === item._id) || {}
      return questionActivity
    }
    return {}
  }
)

export const userWorkFromQuestionActivitySelector = createSelector(
  questionActivityFromFeedbackSelector,
  userWorkSelector,
  (questionActivities = [], userWork) => {
    const scratchPadData = (questionActivities || []).reduce((acc, curr) => {
      if (userWork[curr._id]) {
        acc[curr._id] = userWork[curr._id]
      }
      return acc
    }, {})

    return scratchPadData
  }
)

export const FeedbackByQIdSelector = createSelector(
  getTestFeedbackSelector,
  (testFeedback) => keyBy(testFeedback, 'qid')
)

export const feedbackByQIdAndTestItemIdSelector = createSelector(
  getTestFeedbackSelector,
  (testFeedback) => keyBy(testFeedback, (o) => `${o.qid}_${o.testItemId}`)
)

export const getMaxScoreFromCurrentItem = (state) => {
  const currentItem =
    state?.studentTestItems?.items?.[state?.studentTestItems?.current || 0]
  if (currentItem?.itemLevelScoring) {
    return currentItem?.itemLevelScore
  }
  return currentItem?.data?.questions?.reduce(
    (acc, q) => q?.validation?.validResponse?.score + acc,
    0
  )
}

export const highlightsStudentReportSelector = createSelector(
  userWorkSelector,
  getItemSelector,
  (state) => get(state, `[studentReport][testActivity]`, {}),
  (userWork, item, testActivity) => {
    const { passageId } = item
    const { _id: testActivityId } = testActivity
    return get(userWork, `[${passageId}][${testActivityId}].resourceId`, '')
  }
)
