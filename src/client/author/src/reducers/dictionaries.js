import {
  RECEIVE_DICT_CURRICULUMS_REQUEST,
  RECEIVE_DICT_CURRICULUMS_SUCCESS,
  RECEIVE_DICT_CURRICULUMS_ERROR,
  RECEIVE_DICT_STANDARDS_REQUEST,
  RECEIVE_DICT_STANDARDS_SUCCESS,
  RECEIVE_DICT_STANDARDS_ERROR
} from '../constants/actions';

const initialItemsState = {
  curriculums: {
    curriculums: [],
    loading: false,
    error: null
  },
  standards: {
    standards: [],
    loading: false,
    error: null
  }
};

const dictionariesReducer = (state = initialItemsState, { type, payload }) => {
  switch (type) {
    case RECEIVE_DICT_CURRICULUMS_REQUEST:
      return {
        ...state,
        curriculums: {
          ...state.curriculums,
          loading: true
        }
      };
    case RECEIVE_DICT_CURRICULUMS_SUCCESS:
      return {
        ...state,
        curriculums: {
          ...state.curriculums,
          curriculums: payload.items,
          loading: false
        }
      };
    case RECEIVE_DICT_CURRICULUMS_ERROR:
      return {
        ...state,
        curriculums: {
          ...state.curriculums,
          loading: false,
          error: payload.error
        }
      };
    case RECEIVE_DICT_STANDARDS_REQUEST:
      return {
        ...state,
        standards: {
          ...state.standards,
          loading: true
        }
      };
    case RECEIVE_DICT_STANDARDS_SUCCESS:
      return {
        ...state,
        standards: {
          ...state.standards,
          standards: payload.items,
          loading: false
        }
      };
    case RECEIVE_DICT_STANDARDS_ERROR:
      return {
        ...state,
        standards: {
          ...state.standards,
          loading: false,
          error: payload.error
        }
      };
    default:
      return state;
  }
};

export default dictionariesReducer;
