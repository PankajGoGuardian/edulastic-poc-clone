import { createSelector } from 'reselect'
import { values } from 'lodash'
import { hasValidAnswers } from '../utils/answer'

export const getAnswersListSelector = (state) => state.answers
export const getPreviousAnswersListSelector = (state) => state.previousAnswers
export const getStudentItemsStateSelector = (state) => state.studentTestItems

export const getAnswersArraySelector = createSelector(
  getAnswersListSelector,
  (answers) => values(answers)
)

export const getAnswerByQuestionIdSelector = (
  testItemId,
  questionId,
  answers
) =>
  questionId && testItemId ? answers[`${testItemId}_${questionId}`] : undefined

const getActivityFromPropsSelector = (state, props) => props.activity

// eslint-disable-next-line no-unused-vars
const isReviewTabSelector = (state, props) => !!props.isReviewTab
export const getQuestionIdFromPropsSelector = (state, props) => {
  const id = props?.data?.id
  const questionId = props?.questionId
  return questionId || id
}

export const getTestItemIdFromPropsSelector = (state, props) => {
  let itemId = props.data?.itemId || props.itemId || props.testItemId
  if (!itemId) {
    const studentItemsData = getStudentItemsStateSelector(state)
    itemId = studentItemsData?.items[studentItemsData?.current]?._id
  }
  return itemId || 'new'
}

const getQuestionId = (questionId) => questionId || 'tmp'

export const getUserAnswerSelector = createSelector(
  [
    getActivityFromPropsSelector,
    getTestItemIdFromPropsSelector,
    getQuestionIdFromPropsSelector,
    getAnswersListSelector,
  ],
  (activity, testItemId, questionId, answers) => {
    if (!questionId || !testItemId) return undefined

    let userAnswer
    if (activity && activity.userResponse) {
      userAnswer = activity.userResponse
    } else {
      userAnswer = getAnswerByQuestionIdSelector(
        testItemId,
        questionId,
        answers
      )
    }
    return userAnswer
  }
)

export const getUserPrevAnswerSelector = createSelector(
  [
    getTestItemIdFromPropsSelector,
    getQuestionIdFromPropsSelector,
    getPreviousAnswersListSelector,
  ],
  (testItemId, questionId, previousAnswers) => {
    if (!questionId || !testItemId) return undefined
    return getAnswerByQuestionIdSelector(
      testItemId,
      questionId,
      previousAnswers
    )
  }
)

export const getEvaluationSelector = (state, props) =>
  props.evaluation || state.evaluation

export const getEvaluationByIdSelector = createSelector(
  [
    getEvaluationSelector,
    getQuestionIdFromPropsSelector,
    getTestItemIdFromPropsSelector,
  ],
  (evaluation, questionId, itemId) =>
    evaluation[`${itemId}_${getQuestionId(questionId)}`]
)

export const getAIEvaluationSelector = (state, props) =>
  props.aiEvaluationStatus || state.aiEvaluationStatus

export const getAIEvaluationByIdSelector = createSelector(
  [
    getAIEvaluationSelector,
    getQuestionIdFromPropsSelector,
    getTestItemIdFromPropsSelector,
  ],
  (aiEvaluationStatus, questionId, itemId) =>
    aiEvaluationStatus?.[`${itemId}_${getQuestionId(questionId)}`]
)

// selectors
const itemsSelector = (state) => state.test.items
const answersSelector = (state) => state.answers

export const getSkippedAnswerSelector = createSelector(
  [itemsSelector, answersSelector],
  (items, answers) => {
    const skippedItems = []
    items.forEach((item, index) => {
      const questions = item.data.questions.map((q) => ({
        id: q.id,
        type: q.type,
      }))
      const isAnswered = questions.some((q) =>
        hasValidAnswers(q.type, answers[`${item._id}_${q.id}`])
      )
      skippedItems[index] = !isAnswered
    })
    return skippedItems
  }
)

const studentAssignmentSelector = (state) => state?.studentAssignment

export const assignmentLevelSettingsSelector = createSelector(
  studentAssignmentSelector,
  (studentAssignment = {}) => {
    const { current, byId = {} } = studentAssignment
    return byId[current] || {}
  }
)
