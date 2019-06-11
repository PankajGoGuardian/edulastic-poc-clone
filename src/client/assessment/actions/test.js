import {
  LOAD_TEST,
  FINISH_TEST,
  LOAD_PREVIOUS_RESPONSES,
  SET_PASSWORD_VALIDATE_STATUS,
  GET_ASSIGNMENT_PASSWORD,
  SET_PASSWORD_STATUS_MESSAGE,
  TEST_ACTIVITY_LOADING
} from "../constants/actions";

export const loadTestAction = payload => ({
  type: LOAD_TEST,
  payload
});

export const finishTestAcitivityAction = () => ({
  type: FINISH_TEST
});

export const loadPreviousReponseAction = () => ({
  type: LOAD_PREVIOUS_RESPONSES
});

export const setPasswordValidateStatusAction = payload => ({
  type: SET_PASSWORD_VALIDATE_STATUS,
  payload
});

export const getAssigmentPasswordAction = payload => ({
  type: GET_ASSIGNMENT_PASSWORD,
  payload
});

export const setPasswordStatusAction = payload => ({
  type: SET_PASSWORD_STATUS_MESSAGE,
  payload
});

export const setTestActivityLoadingAction = payload => ({
  type: TEST_ACTIVITY_LOADING,
  payload
});
