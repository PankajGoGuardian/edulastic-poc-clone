import {
  LOAD_QUESTIONS,
  GOTO_QUESTION,
  CREATE_QUESTION_REQUEST,
  CREATE_QUESTION_SUCCESS,
  CREATE_QUESTION_ERROR,
} from '../constants/actions';

const initialState = {
  currentQuestion: 0,
  questions: [],
  creating: false,
  createError: null,
};

const questions = (state = initialState, { type, payload }) => {
  switch (type) {
    case CREATE_QUESTION_REQUEST:
      return {
        ...state,
        creating: true,
      };
    case CREATE_QUESTION_SUCCESS:
      return {
        ...state,
        creating: false,
        questions: [...state.questions, payload.question],
      };
    case CREATE_QUESTION_ERROR:
      return {
        ...state,
        creating: false,
        createError: payload.error,
      };

    case LOAD_QUESTIONS:
      return {
        ...state,
        questions: payload.questions,
      };
    case GOTO_QUESTION:
      return {
        ...state,
        currentQuestion: payload.question,
      };
    default:
      return state;
  }
};

export default questions;
