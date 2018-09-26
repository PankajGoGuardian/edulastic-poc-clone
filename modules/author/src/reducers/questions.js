import {
  LOAD_QUESTIONS, GOTO_QUESTION,
} from '../constants/actions';

const initialState = {
  currentQuestion: 0,
  questions: [],
};

const questions = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_QUESTIONS:
      return {
        ...state,
        questions: action.payload.questions,
      };
    case GOTO_QUESTION:
      return {
        ...state,
        currentQuestion: action.payload.question,
      };
    default:
      return state;
  }
};

export default questions;
