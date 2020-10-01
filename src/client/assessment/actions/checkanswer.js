import { CHECK_ANSWER_EVALUATION } from '../constants/actions'

export const checkAnswerEvaluation = (groupId) => ({
  type: CHECK_ANSWER_EVALUATION,
  payload: groupId,
})
