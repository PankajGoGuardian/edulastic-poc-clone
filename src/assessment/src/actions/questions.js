import {
  LOAD_QUESTIONS,
  GOTO_QUESTION,
  ADD_ANSWER,
  CHECK_ANSWER,
  AUTHOR_QUESTION,
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

export const addAnswer = (qid, answer) => ({
  type: ADD_ANSWER,
  payload: {
    qid,
    answer,
  },
});

export const checkAnswer = (qid, answer) => ({
  type: CHECK_ANSWER,
  payload: {
    answer,
    qid,
  },
});

export const addQuestion = payload => ({
  type: AUTHOR_QUESTION,
  payload,
});
