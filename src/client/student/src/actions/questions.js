import {
  LOAD_QUESTIONS,
  GOTO_QUESTION,
  CHECK_ANSWER,
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

export const checkAnswer = (qid, answer) => ({
  type: CHECK_ANSWER,
  payload: {
    answer,
    qid,
  },
});
