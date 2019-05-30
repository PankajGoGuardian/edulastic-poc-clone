import { SET_QUESTION_CATEGORY, SET_QUESTION_TAB } from "../constants/actions";

const initialState = {
  selectedCategory: "multiple-choice",
  selectedTab: "question-tab"
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
    default:
      return state;
  }
};

export default reducer;
