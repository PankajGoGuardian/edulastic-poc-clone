import {
  LOAD_QUESTIONS,
  GOTO_QUESTION,
} from '../constants/actions';

export const loadQuestions = questions => ({
  type: LOAD_QUESTIONS,
  payload: {
    questions,
  },
});

export const gotoQuestion = question => ({
  type: GOTO_QUESTION,
  payload: {
    question,
  },
});
