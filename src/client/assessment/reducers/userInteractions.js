import { createReducer } from 'redux-starter-kit'
import {
  SAVE_HINT_USAGE,
  CLEAR_HINT_USAGE,
  SET_PASSAGE_CURRENT_PAGE,
} from '../constants/actions'

const initialState = {
  passages: {},
}

const saveHintUsage = (state, { payload }) => {
  const { itemId, hintUsage } = payload

  return {
    ...state,
    [itemId]: [...(state[itemId] || []), hintUsage],
  }
}

const clearHintUsage = (state, { payload }) => {
  return {
    ...initialState,
  }
}

const setPassageCurrentPage = (state, { payload }) => {
  const { passageId, page } = payload
  const passageData = state.passages?.[passageId] || {}

  return {
    ...state,
    passages: {
      ...state.passages,
      [passageId]: {
        ...passageData,
        currentPage: page,
      },
    },
  }
}

export default createReducer(initialState, {
  [SAVE_HINT_USAGE]: saveHintUsage,
  [CLEAR_HINT_USAGE]: clearHintUsage,
  [SET_PASSAGE_CURRENT_PAGE]: setPassageCurrentPage,
})
