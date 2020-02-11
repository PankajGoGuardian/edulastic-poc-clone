import {
  RECEIVE_CLASS_QUESTION_REQUEST,
  RECEIVE_CLASS_QUESTION_SUCCESS,
  RECEIVE_CLASS_QUESTION_ERROR,
  RESPONSE_ENTRY_SCORE_SUCCESS
} from "../constants/actions";

const initialState = {
  data: [],
  error: null,
  loading: false
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case RECEIVE_CLASS_QUESTION_REQUEST:
      return { ...state, loading: true };
    case RECEIVE_CLASS_QUESTION_SUCCESS:
      return {
        ...state,
        loading: false,
        data: payload
      };
    case RESPONSE_ENTRY_SCORE_SUCCESS:
      return {
        ...state,
        data: state.data.map(d => {
          const qActivity = payload.questionActivities.find(qa => qa._id === d._id);
          if (qActivity) return qActivity;
          else return d;
        })
      };

    case RECEIVE_CLASS_QUESTION_ERROR:
      return { ...state, loading: false, error: payload.error };
    default:
      return state;
  }
};

export default reducer;
