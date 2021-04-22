import {
  RECEIVE_CLASSSTUDENT_RESPONSE_REQUEST,
  RECEIVE_CLASSSTUDENT_RESPONSE_SUCCESS,
  RECEIVE_CLASSSTUDENT_RESPONSE_ERROR,
  ADD_CLASS_STUDENT_RESPONSE,
  SET_CLASS_STUDENT_RESPONSES_LOADING,
} from '../constants/actions'

const initialState = {
  data: [],
  error: null,
  loading: false,
  printPreviewLoading: false,
}

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case RECEIVE_CLASSSTUDENT_RESPONSE_REQUEST:
      return { ...state, loading: true }
    case RECEIVE_CLASSSTUDENT_RESPONSE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: payload,
      }
    case ADD_CLASS_STUDENT_RESPONSE: {
      const { value, first = false, last = false } = payload
      let data
      if (first) {
        data = [value]
      } else {
        data = [...state.data, value]
      }
      return {
        ...state,
        loading: !last,
        data,
      }
    }
    case RECEIVE_CLASSSTUDENT_RESPONSE_ERROR:
      return { ...state, loading: false, error: payload.error }
    case SET_CLASS_STUDENT_RESPONSES_LOADING:
      return { ...state, printPreviewLoading: payload }
    default:
      return state
  }
}

export default reducer
