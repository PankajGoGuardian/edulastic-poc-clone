import { createAction, createReducer } from 'redux-starter-kit'

// constants

export const UPDATE_TEST_PLAYER = '[test player] update test player'
export const CHANGED_PLAYER_CONTENT = '[test player] content has been changed'

// actions

export const updateTestPlayerAction = createAction(UPDATE_TEST_PLAYER)
export const changedPlayerContentAction = createAction(CHANGED_PLAYER_CONTENT)

// reducer

const initialState = {
  enableMagnifier: false,
  contentChanged: '',
}

const updateTestPlayerReducer = (state, { payload }) => ({
  ...state,
  ...payload,
})

const changedPlayerContent = (state) => ({
  ...state,
  contentChanged: Date.now(),
})

export default createReducer(initialState, {
  [UPDATE_TEST_PLAYER]: updateTestPlayerReducer,
  [CHANGED_PLAYER_CONTENT]: changedPlayerContent,
})
