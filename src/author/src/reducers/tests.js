import {
  RECEIVE_TESTS_REQUEST,
  RECEIVE_TESTS_SUCCESS,
  RECEIVE_TESTS_ERROR,
  CREATE_TEST_REQUEST,
  CREATE_TEST_SUCCESS,
  CREATE_TEST_ERROR,
  RECEIVE_TEST_BY_ID_REQUEST,
  RECEIVE_TEST_BY_ID_SUCCESS,
  RECEIVE_TEST_BY_ID_ERROR,
  SET_TEST_DATA,
  UPDATE_TEST_REQUEST,
  UPDATE_TEST_SUCCESS,
  UPDATE_TEST_ERROR,
  SET_DEFAULT_TEST_DATA,
} from '../constants/actions';

const initialTestState = {
  title: 'New Test',
  description: '',
  renderingType: 'assessment',
  status: 'draft',
  createdBy: {
    id: 'demos-site',
    firstName: 'Demos',
    lastName: 'User',
    email: 'demos@snapwiz.com',
  },
  tags: [],
  testItems: [],
};

const initialState = {
  entities: [],
  entity: initialTestState,
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

    case RECEIVE_TEST_BY_ID_REQUEST:
      return { ...state, loading: true };
    case RECEIVE_TEST_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        entity: payload.entity,
      };
    case RECEIVE_TEST_BY_ID_ERROR:
      return { ...state, loading: false, error: payload.error };

    case SET_TEST_DATA:
      return { ...state, entity: payload.data };

    case SET_DEFAULT_TEST_DATA:
      return { ...state, entity: initialTestState };

    case CREATE_TEST_REQUEST:
    case UPDATE_TEST_REQUEST:
      return { ...state, creating: true };
    case CREATE_TEST_SUCCESS:
    case UPDATE_TEST_SUCCESS:
      return {
        ...state,
        creating: false,
        entities: [payload.entity, ...state.entities],
      };
    case CREATE_TEST_ERROR:
    case UPDATE_TEST_ERROR:
      return { ...state, creating: false, error: payload.error };

    default:
      return state;
  }
};

export default reducer;
