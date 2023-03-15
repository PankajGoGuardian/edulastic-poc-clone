import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'

// constants

export const UPDATE_TEST_PLAYER = '[test player] update test player'
export const CHANGED_PLAYER_CONTENT = '[test player] content has been changed'
export const SET_CURRENT_CALCULATOR_TYPE =
  '[test player] set current calculator type'

// actions

export const updateTestPlayerAction = createAction(UPDATE_TEST_PLAYER)
export const changedPlayerContentAction = createAction(CHANGED_PLAYER_CONTENT)

// reducer

const initialState = {
  enableMagnifier: false,
  contentChanged: '',
  ttsPlaybackSpeed: localStorage.getItem('ttsPlaybackSpeed') || '1',
  currentCalculatorType: '',
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

export const testPlayerSelector = (state) => state.testPlayer

export const getTextToSpeechPlaybackSpeed = createSelector(
  testPlayerSelector,
  (testPlayer) => testPlayer?.ttsPlaybackSpeed || '1'
)

export const getCurrentCalculatorTypeSelector = createSelector(
  testPlayerSelector,
  (testPlayer) => testPlayer?.currentCalculatorType
)
