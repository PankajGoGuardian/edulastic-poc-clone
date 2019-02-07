import {
  SET_DEFAULT_TEST_DATA,
  SET_ASSIGNMENT,
  UPDATE_SET_ASSIGNMENT,
  LOAD_ASSIGNMENTS,
  REMOVE_ASSIGNMENT,
  SET_TEST_DATA,
  UPDATE_TEST_IMAGE,
  RECEIVE_TEST_BY_ID_REQUEST,
  RECEIVE_TEST_BY_ID_SUCCESS,
  RECEIVE_TEST_BY_ID_ERROR,
  CREATE_TEST_REQUEST,
  UPDATE_TEST_REQUEST,
  CREATE_TEST_ERROR,
  UPDATE_TEST_ERROR,
  SET_MAX_ATTEMPT,
  CREATE_TEST_SUCCESS,
  UPDATE_TEST_SUCCESS
} from '../constants/actions';

const initialTestState = {
  title: 'New Test',
  description: '',
  maxAttempts: 3,
  releaseScore: true,
  activityReview: true,
  renderingType: 'assessment',
  status: 'draft',
  thumbnail: 'https://fakeimg.pl/500x135/',
  createdBy: {
    id: '',
    firstName: '',
    lastName: '',
    email: ''
  },
  tags: [],
  scoring: {
    total: 0,
    testItems: []
  },
  testItems: [],
  assignments: [],
  standardsTag: {
    curriculum: '',
    standards: []
  },
  grades: [],
  subjects: [],
  courses: [],
  collections: '',
  analytics: {
    usage: '0',
    likes: '0'
  }
};

const initialState = {
  entity: initialTestState,
  error: null,
  page: 1,
  limit: 20,
  count: 0,
  loading: false,
  creating: false
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_DEFAULT_TEST_DATA:
      return { ...state, entity: initialTestState };
    case SET_ASSIGNMENT:
      return {
        ...state,
        entity: {
          ...state.entity,
          assignments: [...state.entity.assignments, payload.obj]
        }
      };
    case RECEIVE_TEST_BY_ID_REQUEST:
      return { ...state, loading: true };
    case RECEIVE_TEST_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        entity: payload.entity
      };
    case RECEIVE_TEST_BY_ID_ERROR:
      return { ...state, loading: false, error: payload.error };

    case CREATE_TEST_REQUEST:
    case UPDATE_TEST_REQUEST:
      return { ...state, creating: true };
    case CREATE_TEST_SUCCESS:
    case UPDATE_TEST_SUCCESS:
      return {
        ...state,
        creating: false
      };
    case CREATE_TEST_ERROR:
    case UPDATE_TEST_ERROR:
      return { ...state, creating: false, error: payload.error };
    case UPDATE_SET_ASSIGNMENT:
      return {
        ...state,
        entity: {
          ...state.entity,
          assignments: state.entity.assignments.map(item =>
            payload.id === item._id ? payload.data : item
          )
        }
      };
    case REMOVE_ASSIGNMENT:
      return {
        ...state,
        entity: {
          ...state.entity,
          assignments: state.entity.assignments.filter(
            item => item._id !== payload.id
          )
        }
      };
    case LOAD_ASSIGNMENTS:
      return {
        ...state,
        entity: {
          ...state.entity,
          assignments: payload.data
        }
      };
    case SET_TEST_DATA:
      return {
        ...state,
        entity: {
          ...state.entity,
          ...payload.data
        }
      };
    case UPDATE_TEST_IMAGE:
      return {
        ...state,
        entity: {
          ...state.entity,
          thumbnail: payload.fileUrl
        }
      };
    case SET_MAX_ATTEMPT:
      return {
        ...state,
        entity: {
          ...state.entity,
          maxAttempts: payload.data
        }
      };
    default:
      return state;
  }
};

export default reducer;
