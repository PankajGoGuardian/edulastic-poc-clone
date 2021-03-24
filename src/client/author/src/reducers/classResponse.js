import {
  RECEIVE_CLASS_RESPONSE_SUCCESS,
  RECEIVE_CLASS_RESPONSE_ERROR,
  UPDATE_STUDENT_TEST_ITEMS,
  CORRECT_ITEM_UPDATE_REQUEST,
  CORRECT_ITEM_UPDATE_SUCCESS,
} from '../constants/actions'

const initialState = {
  data: {},
  error: null,
  loading: true,
  updating: false,
}

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case RECEIVE_CLASS_RESPONSE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: payload,
      }
    case UPDATE_STUDENT_TEST_ITEMS:
      return {
        ...state,
        data: {
          ...state.data,
          itemGroups: payload.itemGroups,
          testItems: payload.testItems,
        },
      }
    case RECEIVE_CLASS_RESPONSE_ERROR:
      return { ...state, loading: false, error: payload.error }
    case CORRECT_ITEM_UPDATE_REQUEST:
      return { ...state, updating: true }
    case CORRECT_ITEM_UPDATE_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          testItems: payload.testItems,
        },
        updating: false,
      }
    default:
      return state
  }
}

export default reducer
