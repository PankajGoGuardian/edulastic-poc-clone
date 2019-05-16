import { SET_ANSWER, REMOVE_ANSWERS } from "../constants/actions";

export const setUserAnswerAction = (questionId, data) => ({
  type: SET_ANSWER,
  payload: {
    id: questionId,
    data
  }
});

export const removeUserAnswerAction = () => ({ type: REMOVE_ANSWERS });
