import {
  CHECK_ANSWER_EVALUATION,
  SET_CHECK_ANSWER_PROGRESS_STATUS,
} from '../constants/actions'

export const checkAnswerEvaluation = (groupId) => ({
  type: CHECK_ANSWER_EVALUATION,
  payload: groupId,
})

export const setCheckAnswerInProgressStatusAction = (inProgress) => ({
  type: SET_CHECK_ANSWER_PROGRESS_STATUS,
  payload: inProgress,
})
