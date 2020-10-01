import { createReducer } from 'redux-starter-kit'
import { isUndefined } from 'lodash'
import { LOAD_QUESTIONS, TOGGLE_ADVANCED_SECTIONS } from '../constants/actions'

const initialState = {
  byId: {},
  advancedAreOpen: false,
}

const loadQuestions = (state, { payload }) => {
  state.byId = payload
}

const toggleAdvancedSections = (state, { payload: { isOpen } }) => {
  if (isUndefined(isOpen)) {
    state.advancedAreOpen = !state.advancedAreOpen
  } else {
    state.advancedAreOpen = isOpen
  }
}

export default createReducer(initialState, {
  [LOAD_QUESTIONS]: loadQuestions,
  [TOGGLE_ADVANCED_SECTIONS]: toggleAdvancedSections,
})
