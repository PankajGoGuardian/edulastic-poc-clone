import {
  RECEIVE_QUESTION_REQUEST,
  SAVE_QUESTION_REQUEST,
  SET_QUESTION_DATA,
  SET_QUESTION_ALIGNMENT_ROW,
  SET_QUESTION_ALIGNMENT_ROW_STANDARDS,
  SET_QUESTION_ALIGNMENT_ADD_ROW,
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

export function setQuestionAlignmentRowAction(index, alignmentRow) {
  return {
    type: SET_QUESTION_ALIGNMENT_ROW,
    payload: { index, alignmentRow }
  };
}

export function setQuestionAlignmentRowStandardsAction(index, alignmentStandards) {
  return {
    type: SET_QUESTION_ALIGNMENT_ROW_STANDARDS,
    payload: { index, alignmentStandards }
  };
}

export function setQuestionAlignmentAddRowAction() {
  return {
    type: SET_QUESTION_ALIGNMENT_ADD_ROW
  };
}

export function setQuestionAction(data) {
  return {
    type: SET_QUESTION,
    payload: { data }
  };
}
