import {
  LOAD_TEST,
  FINISH_TEST,
  LOAD_PREVIOUS_RESPONSES,
  SET_PASSWORD_VALIDATE_STATUS,
  GET_ASSIGNMENT_PASSWORD,
  SET_PASSWORD_STATUS_MESSAGE,
  TEST_ACTIVITY_LOADING,
  UPDATE_CURRENT_AUDIO_DEATILS,
  SWITCH_LANGUAGE,
  LANG_CHANGE_SUCCESS,
  SET_VIEW_TEST_INFO_SUCCESS,
  SET_TEST_LOADING_STATUS,
  SET_PREVIEW_LANGUAGE,
  SET_IS_TEST_PREVIEW_VISIBLE,
  RESET_TEST_ITEMS,
  SET_SUBMIT_TEST_COMPLETE,
  CLOSE_TEST_TIMED_OUT_ALERT_MODAL,
  SET_ANTI_CHEATING_ENABLED,
} from '../constants/actions'

export const loadTestAction = (payload) => ({
  type: LOAD_TEST,
  payload,
})

export const finishTestAcitivityAction = (payload) => ({
  type: FINISH_TEST,
  payload,
})

export const loadPreviousReponseAction = () => ({
  type: LOAD_PREVIOUS_RESPONSES,
})

export const setPasswordValidateStatusAction = (payload) => ({
  type: SET_PASSWORD_VALIDATE_STATUS,
  payload,
})

export const getAssigmentPasswordAction = (payload) => ({
  type: GET_ASSIGNMENT_PASSWORD,
  payload,
})

export const setPasswordStatusAction = (payload) => ({
  type: SET_PASSWORD_STATUS_MESSAGE,
  payload,
})

export const setTestActivityLoadingAction = (payload) => ({
  type: TEST_ACTIVITY_LOADING,
  payload,
})

export const setCurrentAudioDetailsAction = (payload) => ({
  type: UPDATE_CURRENT_AUDIO_DEATILS,
  payload,
})

export const switchLanguageAction = (payload) => ({
  type: SWITCH_LANGUAGE,
  payload,
})

export const languageChangeSuccessAction = (payload) => ({
  type: LANG_CHANGE_SUCCESS,
  payload,
})

export const setShowTestInfoSuccesAction = (payload) => ({
  type: SET_VIEW_TEST_INFO_SUCCESS,
  payload,
})

export const setTestLoadingAction = (payload) => ({
  type: SET_TEST_LOADING_STATUS,
  payload,
})

export const setPreviewLanguageAction = (payload) => ({
  type: SET_PREVIEW_LANGUAGE,
  payload,
})

export const setIsTestPreviewVisibleAction = (payload) => ({
  type: SET_IS_TEST_PREVIEW_VISIBLE,
  payload,
})

export const resetStudentAttemptAction = (payload) => ({
  type: RESET_TEST_ITEMS,
  payload,
})

export const setSubmitTestCompleteAction = (payload) => ({
  type: SET_SUBMIT_TEST_COMPLETE,
  payload,
})

export const closeTestTimeoutAlertModalAction = (payload) => ({
  type: CLOSE_TEST_TIMED_OUT_ALERT_MODAL,
  payload,
})

export const setIsAntiCheatingEnabled = (payload) => ({
  type: SET_ANTI_CHEATING_ENABLED,
  payload,
})
