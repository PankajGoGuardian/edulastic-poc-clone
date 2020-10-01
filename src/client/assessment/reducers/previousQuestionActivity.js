import {
  LOAD_PREVIOUS_RESPONSES,
  REMOVE_PREVIOUS_ANSWERS,
} from '../constants/actions'

const initialState = []

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case LOAD_PREVIOUS_RESPONSES:
      return {
        ...state,
        ...payload,
      }
    case REMOVE_PREVIOUS_ANSWERS:
      return {}
    default:
      return state
  }
}
