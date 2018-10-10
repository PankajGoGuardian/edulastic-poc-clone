import {
  LOAD_QUESTIONS,
  GOTO_QUESTION,
  AUTHOR_QUESTION,
  CREATE_QUESTION_REQUEST,
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

export const addQuestion = question => ({
  type: AUTHOR_QUESTION,
  payload: {
    ...question,
  },
});

export const createQuestionAction = data => ({
  type: CREATE_QUESTION_REQUEST,
  payload: data,
});
