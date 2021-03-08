import { createAction, createReducer } from 'redux-starter-kit'

// constants

export const UPDATE_TEST_PLAYER = '[test player] update test player'
export const TOGGLE_TEST_PLAYER = '[test player] toggle passage tab test player'

// actions

export const updateTestPlayerAction = createAction(UPDATE_TEST_PLAYER)
export const togglePassageTabAction = createAction(TOGGLE_TEST_PLAYER)

// reducer

const initialState = {
  enableMagnifier: false,
  collapseDirection: {},
}

const updateTestPlayerReducer = (state, { payload }) => ({
  ...state,
  ...payload,
})

const togglePassageTabReducer = (state, { payload }) => ({
  ...state,
  collapseDirection: {
    ...state.collapseDirection,
    ...payload,
  },
})

export default createReducer(initialState, {
  [UPDATE_TEST_PLAYER]: updateTestPlayerReducer,
  [TOGGLE_TEST_PLAYER]: togglePassageTabReducer,
})
