import {
  RECEIVE_DICT_CURRICULUMS_REQUEST,
  RECEIVE_DICT_STANDARDS_REQUEST,
  CLEAR_DICT_STANDARDS,
  ADD_NEW_ALIGNMENT,
  REMOVE_EXISTED_ALIGNMENT,
  UPDATE_DICT_ALIGNMENT
} from "../constants/actions";

export const getDictCurriculumsAction = () => ({
  type: RECEIVE_DICT_CURRICULUMS_REQUEST
});

export const getDictStandardsForCurriculumAction = (curriculumId, grades, search) => ({
  type: RECEIVE_DICT_STANDARDS_REQUEST,
  payload: { curriculumId, grades, search }
});

export const clearDictStandardsAction = () => ({
  type: CLEAR_DICT_STANDARDS
});

export const addNewAlignmentAction = alignment => ({
  type: ADD_NEW_ALIGNMENT,
  payload: alignment
});

export const removeExistedAlignmentAction = curriculumId => ({
  type: REMOVE_EXISTED_ALIGNMENT,
  payload: curriculumId
});

export const updateDictAlignmentAction = (alignmentIndex, payload) => ({
  type: UPDATE_DICT_ALIGNMENT,
  payload: {
    index: alignmentIndex,
    changedFields: payload
  }
});
