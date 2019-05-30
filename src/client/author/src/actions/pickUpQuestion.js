import { SET_QUESTION_CATEGORY, SET_QUESTION_TAB } from "../constants/actions";

export const setQuestionCategory = payload => ({
  type: SET_QUESTION_CATEGORY,
  payload
});

export const setQuestionTab = payload => ({
  type: SET_QUESTION_TAB,
  payload
});
