import {
  RECEIVE_QUESTION_REQUEST,
  SAVE_QUESTION_REQUEST,
  // SET_QUESTION_DATA,
  SET_QUESTION_ALIGNMENT_ADD_ROW,
  SET_QUESTION_ALIGNMENT_REMOVE_ROW,
  SET_QUESTION,
  LOAD_QUESTION
} from "../constants/actions";
import { UPDATE_QUESTION } from "../../sharedDucks/questions";

export const receiveQuestionByIdAction = id => ({
  type: RECEIVE_QUESTION_REQUEST,
  payload: {
    id
  }
});

export const saveQuestionAction = () => ({
  type: SAVE_QUESTION_REQUEST
});

export const setQuestionDataAction = question => ({
  type: UPDATE_QUESTION,
  payload: question
});

export const setQuestionAlignmentAddRowAction = alignmentRow => ({
  type: SET_QUESTION_ALIGNMENT_ADD_ROW,
  payload: { alignmentRow }
});

export const setQuestionAlignmentRemoveRowAction = index => ({
  type: SET_QUESTION_ALIGNMENT_REMOVE_ROW,
  payload: { index }
});

export const setQuestionAction = data => ({
  type: SET_QUESTION,
  payload: { data }
});

export const loadQuestionAction = (data, rowIndex) => ({
  type: LOAD_QUESTION,
  payload: { data, rowIndex }
});
