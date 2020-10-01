import {
  SET_TEST_LEVEL_USER_WORK,
  LOAD_TEST_LEVEL_USER_WORK,
} from '../constants/actions'

const initialState = {}

const testUserWork = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_TEST_LEVEL_USER_WORK:
      return {
        ...state,
        ...payload,
      }
    case LOAD_TEST_LEVEL_USER_WORK:
      return {
        ...state,
        ...payload,
      }
    default:
      return state
  }
}

export default testUserWork
