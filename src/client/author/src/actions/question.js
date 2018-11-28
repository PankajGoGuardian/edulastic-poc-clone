import {
  RECEIVE_QUESTION_REQUEST,
  SAVE_QUESTION_REQUEST,
  SET_QUESTION_DATA,
  SET_QUESTION
} from '../constants/actions';

export const receiveQuestionByIdAction = id => ({
  type: RECEIVE_QUESTION_REQUEST,
  payload: {
    id
  }
});

export function saveQuestionAction() {
  return {
    type: SAVE_QUESTION_REQUEST
  };
}

export function setQuestionDataAction(data) {
  return {
    type: SET_QUESTION_DATA,
    payload: { data }
  };
}

export function setQuestionAction(data) {
  return {
    type: SET_QUESTION,
    payload: { data }
  };
}
