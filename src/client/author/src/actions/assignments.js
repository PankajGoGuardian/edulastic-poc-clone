import {
  RECEIVE_ASSIGNMENTS_REQUEST,
  FETCH_CURRENT_EDITING_ASSIGNMENT,
  UPDATE_RELEASE_SCORE_SETTINGS,
  TOGGLE_RELEASE_GRADE_SETTINGS
} from "../constants/actions";

export const receiveAssignmentsAction = payload => ({
  type: RECEIVE_ASSIGNMENTS_REQUEST,
  payload
});

export const receiveAssignmentByIdAction = payload => ({
  type: FETCH_CURRENT_EDITING_ASSIGNMENT,
  payload
});

export const updateReleaseScoreSettingsAction = payload => ({
  type: UPDATE_RELEASE_SCORE_SETTINGS,
  payload
});
export const toggleReleaseScoreSettingsAction = payload => ({
  type: TOGGLE_RELEASE_GRADE_SETTINGS,
  payload
});
