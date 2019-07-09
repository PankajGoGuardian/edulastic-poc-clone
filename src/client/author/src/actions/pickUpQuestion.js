import { SET_QUESTION_CATEGORY, SET_QUESTION_TAB, SET_SCROLL_TOP } from "../constants/actions";

export const setQuestionCategory = payload => ({
  type: SET_QUESTION_CATEGORY,
  payload
});

export const setQuestionTab = payload => ({
  type: SET_QUESTION_TAB,
  payload
});

export const saveScrollTop = value => {
  return {
    type: SET_SCROLL_TOP,
    payload: value
  };
};
