import { LOAD_QUESTIONS, GOTO_QUESTION } from '../constants/actions';

const initialState = {
  currentQuestion: 0,
  questions: [],
};

const questions = (state = initialState, { type, payload }) => {
  switch (type) {
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
