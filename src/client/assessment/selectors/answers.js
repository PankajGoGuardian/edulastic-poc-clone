import { createSelector } from 'reselect'
import { values } from 'lodash'
import { hasValidAnswers } from '../utils/answer'

export const getAnswersListSelector = (state) => state.answers
export const getPreviousAnswersListSelector = (state) => state.previousAnswers

export const getAnswersArraySelector = createSelector(
  getAnswersListSelector,
  (answers) => values(answers)
)

export const getAnswerByQuestionIdSelector = (questionId) => (answers) =>
  questionId ? answers[questionId] : undefined

const getActivityFromPropsSelector = (state, props) => props.activity

// eslint-disable-next-line no-unused-vars
const isReviewTabSelector = (state, props) => !!props.isReviewTab
const getQuestionIdFromPropsSelector = (state, props) => {
  const id = props?.data?.id
  const questionId = props?.questionId
  return questionId || id
}
// eslint-disable-next-line no-unused-vars
const getQuestionSelector = (state, props) => {
  const { data } = props
  return data
}

const getQuestionId = (questionId) => questionId || 'tmp'

export const getUserAnswerSelector = createSelector(
  [
    getActivityFromPropsSelector,
    getQuestionIdFromPropsSelector,
    getAnswersListSelector,
  ],
  (activity, questionId, answers) => {
    if (!questionId) return undefined

    let userAnswer
    if (activity && activity.userResponse) {
      userAnswer = activity.userResponse
    } else {
      const qId = getQuestionId(questionId)
      userAnswer = getAnswerByQuestionIdSelector(qId)(answers)
    }
    return userAnswer
  }
)

export const getUserPrevAnswerSelector = createSelector(
  [getQuestionIdFromPropsSelector, getPreviousAnswersListSelector],
  (questionId, previousAnswers) => {
    if (!questionId) return undefined

    const qId = getQuestionId(questionId)
    return getAnswerByQuestionIdSelector(qId)(previousAnswers)
  }
)

export const getEvaluationSelector = (state, props) =>
  props.evaluation || state.evaluation

export const getEvaluationByIdSelector = createSelector(
  [getEvaluationSelector, getQuestionIdFromPropsSelector],
  (evaluation, questionId) => evaluation[getQuestionId(questionId)]
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
        hasValidAnswers(q.type, answers[q.id])
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

export const languagePreferenceSelector = (state, props = {}) => {
  let preferredLanguage = 'en'
  const { isLCBView, isStudentReport } = props || {}
  if (isLCBView) {
    const { entities = [] } = state?.author_classboard_testActivity || {}
    const { studentId } = props
    if (studentId) {
      const currentUTA = entities.find((uta) => uta.studentId === studentId)
      if (currentUTA?.languagePreference) {
        preferredLanguage = currentUTA.languagePreference
      }
    }
  } else if (isStudentReport) {
    const { languagePreference = 'en' } =
      state?.studentReport?.testActivity || {}
    preferredLanguage = languagePreference
  }

  return preferredLanguage
}
