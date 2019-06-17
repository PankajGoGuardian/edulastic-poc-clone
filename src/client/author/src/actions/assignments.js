import {
  RECEIVE_ASSIGNMENTS_REQUEST,
  RECEIVE_ASSIGNMENTS_SUMMARY_REQUEST,
  RECEIVE_ASSIGNMENT_CLASS_LIST_REQUEST,
  FETCH_CURRENT_EDITING_ASSIGNMENT,
  UPDATE_RELEASE_SCORE_SETTINGS,
  TOGGLE_RELEASE_GRADE_SETTINGS,
  SET_ASSIGNMENT_FILTER,
  ADVANCED_ASSIGNMENT_VIEW
} from "../constants/actions";

export const receiveAssignmentsAction = payload => ({
  type: RECEIVE_ASSIGNMENTS_REQUEST,
  payload
});

export const receiveAssignmentsSummaryAction = payload => ({
  type: RECEIVE_ASSIGNMENTS_SUMMARY_REQUEST,
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

export const receiveAssignmentClassList = payload => ({
  type: RECEIVE_ASSIGNMENT_CLASS_LIST_REQUEST,
  payload
});

export const toggleReleaseScoreSettingsAction = payload => ({
  type: TOGGLE_RELEASE_GRADE_SETTINGS,
  payload
});

export const toggleAssignmentViewAction = () => ({
  type: ADVANCED_ASSIGNMENT_VIEW
});

export const setAssignmentFiltersAction = payload => ({
  type: SET_ASSIGNMENT_FILTER,
  payload
});
