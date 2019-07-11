import { SET_QUESTION_CATEGORY, SET_QUESTION_TAB, SET_SCROLL_TOP } from "../constants/actions";

const initialState = {
  selectedCategory: "multiple-choice",
  selectedTab: "question-tab",
  savedWindowScrollTop: 0
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_QUESTION_CATEGORY:
      return {
        ...state,
        selectedCategory: payload
      };
    case SET_QUESTION_TAB:
      return {
        ...state,
        selectedTab: payload
      };
    case SET_SCROLL_TOP:
      return {
        ...state,
        savedWindowScrollTop: payload
      };
    default:
      return state;
  }
};

export default reducer;
