import {
  RECEIVE_TESTS_REQUEST,
  RECEIVE_TESTS_SUCCESS,
  RECEIVE_TESTS_ERROR,
  CREATE_TEST_REQUEST,
  CREATE_TEST_SUCCESS,
  CREATE_TEST_ERROR,
} from '../constants/actions';

const initialState = {
  entities: [],
  error: null,
  page: 1,
  limit: 5,
  count: 0,
  loading: false,
  creating: false,
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case RECEIVE_TESTS_REQUEST:
      return { ...state, loading: true };
    case RECEIVE_TESTS_SUCCESS:
      return {
        ...state,
        loading: false,
        entities: payload.entities,
        page: payload.page,
        limit: payload.limit,
        count: payload.count,
      };
    case RECEIVE_TESTS_ERROR:
      return { ...state, loading: false, error: payload.error };

    case CREATE_TEST_REQUEST:
      return { ...state, creating: true };
    case CREATE_TEST_SUCCESS:
      return {
        ...state,
        creating: false,
        entities: [payload.entity, ...state.entities],
      };
    case CREATE_TEST_ERROR:
      return { ...state, creating: false, error: payload.error };

    default:
      return state;
  }
};

export default reducer;
