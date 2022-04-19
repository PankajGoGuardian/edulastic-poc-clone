import {
  SAVE_HINT_USAGE,
  SHOW_HINTS,
  Hide_HINTS,
  CLEAR_HINT_USAGE,
  SET_PASSAGE_CURRENT_PAGE,
} from '../constants/actions'

export const saveHintUsageAction = (payload) => ({
  type: SAVE_HINT_USAGE,
  payload,
})

export const clearHintUsageAction = (payload) => ({
  type: CLEAR_HINT_USAGE,
  payload,
})

export const showHintsAction = () => ({ type: SHOW_HINTS })

export const hideHintsAction = () => ({ type: Hide_HINTS })

export const setPassageCurrentPageAction = (payload) => ({
  type: SET_PASSAGE_CURRENT_PAGE,
  payload,
})
