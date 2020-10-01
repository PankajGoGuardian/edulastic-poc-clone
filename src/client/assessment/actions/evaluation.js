import { CHECK_ANSWER, CLEAR_ITEM_EVALUATION } from '../constants/actions'

export const evaluateAnswer = () => ({
  type: CHECK_ANSWER,
})

export const clearEvaluationAction = () => ({
  type: CLEAR_ITEM_EVALUATION,
})
