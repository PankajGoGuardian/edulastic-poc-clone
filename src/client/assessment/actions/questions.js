import { createAction } from "redux-starter-kit";
import {
  LOAD_QUESTIONS,
  GOTO_QUESTION,
  AUTHOR_QUESTION,
  ADD_ANSWER,
  TOGGLE_ADVANCED_SECTIONS
} from "../constants/actions";

export const loadQuestionsAction = createAction(LOAD_QUESTIONS);

export const gotoQuestion = question => ({
  type: GOTO_QUESTION,
  payload: {
    question
  }
});

export const addQuestion = question => ({
  type: AUTHOR_QUESTION,
  payload: {
    ...question
  }
});

export const addAnswer = (qid, answer) => ({
  type: ADD_ANSWER,
  payload: {
    qid,
    answer
  }
});

export const toggleAdvancedSections = () => ({
  type: TOGGLE_ADVANCED_SECTIONS
});
