import {
  SAVE_USER_WORK,
  LOAD_SCRATCH_PAD,
  CLEAR_USER_WORK,
  RESET_ANNOTATIONS_UPDATE,
} from '../constants/actions'

export const saveUserWorkAction = (payload) => ({
  type: SAVE_USER_WORK,
  payload,
})

export const loadScratchPadAction = (payload) => ({
  type: LOAD_SCRATCH_PAD,
  payload,
})

export const clearUserWorkAction = (payload) => ({
  type: CLEAR_USER_WORK,
  payload,
})

export const resetAnnotationUpdateAction = (payload) => ({
  type: RESET_ANNOTATIONS_UPDATE,
  payload,
})
