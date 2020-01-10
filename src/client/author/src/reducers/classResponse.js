import {
  RECEIVE_CLASS_RESPONSE_SUCCESS,
  RECEIVE_CLASS_RESPONSE_ERROR,
  UPDATE_STUDENT_TEST_ITEMS
} from "../constants/actions";

const initialState = {
  data: {},
  error: null,
  loading: true
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case RECEIVE_CLASS_RESPONSE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: payload
      };
    case UPDATE_STUDENT_TEST_ITEMS:
      return {
        ...state,
        data: {
          ...state.data,
          itemGroups: payload.itemGroups,
          testItems: payload.testItems
        }
      };
    case RECEIVE_CLASS_RESPONSE_ERROR:
      return { ...state, loading: false, error: payload.error };
    default:
      return state;
  }
};

export default reducer;
