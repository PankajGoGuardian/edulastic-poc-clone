import {
  RECEIVE_QUESTION_REQUEST,
  SAVE_QUESTION_REQUEST,
  // SET_QUESTION_DATA,
  SET_QUESTION_ALIGNMENT_ADD_ROW,
  SET_QUESTION_ALIGNMENT_REMOVE_ROW,
  SET_QUESTION,
  LOAD_QUESTION,
  TOGGLE_QUESTION_EDIT_MODAL_LCB,
  SET_EDIT_ITEM_ID,
  SET_CURRENT_STUDENT_ID,
} from '../constants/actions'
import {
  UPDATE_QUESTION_REQUEST,
  SET_FIRST_MOUNT,
  CHANGE_ITEM,
  CHANGE_ITEM_UI_STYLE,
  CHANGE_LABEL,
} from '../../sharedDucks/questions'

export const receiveQuestionByIdAction = (id) => ({
  type: RECEIVE_QUESTION_REQUEST,
  payload: {
    id,
  },
})

export const toggleQuestionEditModalAction = (isOpen) => ({
  type: TOGGLE_QUESTION_EDIT_MODAL_LCB,
  payload: isOpen,
})

export const setEditingItemIdAction = (payload) => ({
  type: SET_EDIT_ITEM_ID,
  payload,
})

export const setCurrentStudentIdAction = (payload) => ({
  type: SET_CURRENT_STUDENT_ID,
  payload,
})

export const saveQuestionAction = () => ({
  type: SAVE_QUESTION_REQUEST,
})

export const changeLabelAction = (value) => ({
  type: CHANGE_LABEL,
  payload: value,
})

export const setQuestionDataAction = (question) => ({
  type: UPDATE_QUESTION_REQUEST,
  payload: question,
})

export const changeItemAction = (prop, value) => ({
  type: CHANGE_ITEM,
  payload: { prop, value },
})

export const changeUIStyleAction = (prop, value) => ({
  type: CHANGE_ITEM_UI_STYLE,
  payload: { prop, value },
})

export const setFirstMountAction = (id) => ({
  type: SET_FIRST_MOUNT,
  id,
})

export const setQuestionAlignmentAddRowAction = (alignmentRow) => ({
  type: SET_QUESTION_ALIGNMENT_ADD_ROW,
  payload: { alignmentRow },
})

export const setQuestionAlignmentRemoveRowAction = (index) => ({
  type: SET_QUESTION_ALIGNMENT_REMOVE_ROW,
  payload: { index },
})

export const setQuestionAction = (data) => ({
  type: SET_QUESTION,
  payload: { data },
})

export const loadQuestionAction = (data, rowIndex) => ({
  type: LOAD_QUESTION,
  payload: { data, rowIndex },
})
