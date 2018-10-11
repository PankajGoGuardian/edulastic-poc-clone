import {
  RECEIVE_QUESTION_REQUEST,
  RECEIVE_QUESTION_SUCCESS,
  RECEIVE_QUESTION_ERROR,
  SAVE_QUESTION_REQUEST,
  SAVE_QUESTION_SUCCESS,
  SAVE_QUESTION_ERROR,
  SET_QUESTION_DATA,
} from '../constants/actions';

const initialState = {
  entity: null,
  loading: false,
  saving: false,
  error: null,
  saveError: null,
};

const question = (state = initialState, { type, payload }) => {
  switch (type) {
    case RECEIVE_QUESTION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_QUESTION_SUCCESS:
      return {
        ...state,
        loading: false,
        entity: payload.entity,
      };
    case RECEIVE_QUESTION_ERROR:
      return {
        ...state,
        loading: false,
        error: payload.error,
      };

    case SAVE_QUESTION_REQUEST:
      return {
        ...state,
        saving: true,
      };
    case SAVE_QUESTION_SUCCESS:
      return {
        ...state,
        saving: false,
      };
    case SAVE_QUESTION_ERROR:
      return {
        ...state,
        saving: false,
        saveError: payload.error,
      };

    case SET_QUESTION_DATA:
      return {
        ...state,
        entity: { ...state.entity, data: payload.data },
      };

    default:
      return state;
  }
};

export default question;
