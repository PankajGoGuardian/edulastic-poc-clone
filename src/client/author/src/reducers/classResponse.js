import {
  RECEIVE_CLASS_RESPONSE_SUCCESS,
  RECEIVE_CLASS_RESPONSE_ERROR,
  UPDATE_STUDENT_TEST_ITEMS,
  SET_CORRECT_ITEM_UPDATE_PROGRESS,
  REPLACE_ORIGINAL_ITEM,
  SET_SILENT_CLONING,
} from '../constants/actions'

const initialState = {
  data: {},
  error: null,
  loading: true,
  updating: false,
  silentClone: false,
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
    case SET_CORRECT_ITEM_UPDATE_PROGRESS:
      return {
        ...state,
        updating: payload,
      }
    case SET_SILENT_CLONING:
      return {
        ...state,
        silentClone: payload,
      }
    case REPLACE_ORIGINAL_ITEM:
      return {
        ...state,
        data: {
          ...state.data,
          originalItems: state.data.originalItems.map((item) => {
            if (item._id === payload._id) {
              return payload
            }
            return item
          }),
        },
      }
    default:
      return state
  }
}

export default reducer
