import { SET_ANSWER, REMOVE_ANSWERS } from '../constants/actions'

export const setUserAnswerAction = (itemId, questionId, data) => ({
  type: SET_ANSWER,
  payload: {
    itemId,
    id: questionId,
    data,
  },
})

export const removeUserAnswerAction = () => ({ type: REMOVE_ANSWERS })
