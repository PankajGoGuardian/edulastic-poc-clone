import {
  RECEIVE_DICT_CURRICULUMS_REQUEST,
  RECEIVE_DICT_STANDARDS_REQUEST,
  CLEAR_DICT_STANDARDS,
  ADD_NEW_ALIGNMENT,
  REMOVE_EXISTED_ALIGNMENT,
  UPDATE_RECENT_STANDARDS,
  CLEAR_DICT_ALIGNMENTS,
  UPDATE_DICT_ALIGNMENT,
  UPDATE_DEFAULT_CURRICULUM,
  RESET_DICT_ALIGNMENTS,
  UPDATE_RECENT_COLLECTIONS,
  RECEIVE_TLO_STANDARDS_REQUEST,
  RECEIVE_ELO_STANDARDS_REQUEST,
  RECEIVE_ELO_STANDARDS_SUCCESS,
  SET_ELOS_BY_TLO_ID,
  CLEAR_TLO_AND_ELO,
} from '../constants/actions'

export const getDictCurriculumsAction = () => ({
  type: RECEIVE_DICT_CURRICULUMS_REQUEST,
})

export const getStandardTlosAction = (payload) => ({
  type: RECEIVE_TLO_STANDARDS_REQUEST,
  payload,
})

export const getStandardElosAction = (payload) => ({
  type: RECEIVE_ELO_STANDARDS_REQUEST,
  payload,
})

export const getElosSuccessAction = (payload) => ({
  type: RECEIVE_ELO_STANDARDS_SUCCESS,
  payload,
})

export const setElosByTloIdAction = (payload) => ({
  type: SET_ELOS_BY_TLO_ID,
  payload,
})

export const getDictStandardsForCurriculumAction = (
  curriculumId,
  grades,
  search
) => ({
  type: RECEIVE_DICT_STANDARDS_REQUEST,
  payload: { curriculumId, grades, search },
})

export const clearDictStandardsAction = () => ({
  type: CLEAR_DICT_STANDARDS,
})

export const clearTloAndEloAction = () => ({
  type: CLEAR_TLO_AND_ELO,
})

export const clearDictAlignmentAction = () => ({
  type: CLEAR_DICT_ALIGNMENTS,
})

export const resetDictAlignmentsAction = () => ({
  type: RESET_DICT_ALIGNMENTS,
})

export const addNewAlignmentAction = (alignment) => ({
  type: ADD_NEW_ALIGNMENT,
  payload: alignment,
})

export const removeExistedAlignmentAction = (curriculumId) => ({
  type: REMOVE_EXISTED_ALIGNMENT,
  payload: curriculumId,
})

export const updateDictAlignmentAction = (alignmentIndex, payload) => ({
  type: UPDATE_DICT_ALIGNMENT,
  payload: {
    index: alignmentIndex,
    changedFields: payload,
  },
})

export const updateDefaultCurriculumAction = (payload) => ({
  type: UPDATE_DEFAULT_CURRICULUM,
  payload,
})

export const updateRecentStandardsAction = (payload) => ({
  type: UPDATE_RECENT_STANDARDS,
  payload,
})

export const updateRecentCollectionsAction = (payload) => ({
  type: UPDATE_RECENT_COLLECTIONS,
  payload,
})
