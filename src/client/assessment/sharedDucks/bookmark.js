import { createAction, createReducer } from "redux-starter-kit";

// types
export const TOGGLE_BOOKMARK = "[bookmark] toogle bookmark";

// actions
export const toggleBookmarkAction = createAction(TOGGLE_BOOKMARK);

// initial state
const intialState = {};

export default createReducer(intialState, {
  [TOGGLE_BOOKMARK]: (state, { payload }) => {
    state[payload] = !state[payload];
  }
});
