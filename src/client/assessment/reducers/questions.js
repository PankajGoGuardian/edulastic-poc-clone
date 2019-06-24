import { createReducer } from "redux-starter-kit";
import { LOAD_QUESTIONS, TOGGLE_ADVANCED_SECTIONS } from "../constants/actions";

const initialState = {
  byId: {},
  advancedAreOpen: false
};

const loadQuestions = (state, { payload }) => {
  state.byId = payload;
};

const toggleAdvancedSections = state => {
  state.advancedAreOpen = !state.advancedAreOpen;
};

export default createReducer(initialState, {
  [LOAD_QUESTIONS]: loadQuestions,
  [TOGGLE_ADVANCED_SECTIONS]: toggleAdvancedSections
});
