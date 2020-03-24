import { createAction, createReducer } from "redux-starter-kit";

// constants

export const UPDATE_TEST_PLAYER = "[test player] update test player";

// actions

export const updateTestPlayerAction = createAction(UPDATE_TEST_PLAYER);

// reducer

const initialState = {
  enableMagnifier: false
};

const updateTestPlayerReducer = (state, {payload}) => ({
  ...state,
  ...payload
});

export default createReducer(initialState, {
  [UPDATE_TEST_PLAYER]: updateTestPlayerReducer
});
