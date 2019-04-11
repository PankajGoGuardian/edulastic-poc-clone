import {
  RECEIVE_FEEDBACK_RESPONSE_REQUEST,
  RECEIVE_FEEDBACK_RESPONSE_SUCCESS,
  RECEIVE_FEEDBACK_RESPONSE_ERROR,
  CLEAR_FEEDBACK_RESPONSE
} from "../constants/actions";

const initialState = {
  data: "",
  error: null,
  loading: false
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case RECEIVE_FEEDBACK_RESPONSE_REQUEST:
      return { ...initialState, loading: true };
    case CLEAR_FEEDBACK_RESPONSE:
      return initialState;
    case RECEIVE_FEEDBACK_RESPONSE_SUCCESS:
      return {
        error: null,
        loading: false,
        data: payload
      };
    case RECEIVE_FEEDBACK_RESPONSE_ERROR:
      return { data: "", loading: false, error: payload.error };
    default:
      return state;
  }
};

export default reducer;
