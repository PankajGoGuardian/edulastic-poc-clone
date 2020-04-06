import {
  RECEIVE_ASSIGNMENTS_REQUEST,
  RECEIVE_ASSIGNMENTS_SUMMARY_REQUEST,
  RECEIVE_ASSIGNMENT_CLASS_LIST_REQUEST,
  FETCH_CURRENT_EDITING_ASSIGNMENT,
  UPDATE_RELEASE_SCORE_SETTINGS,
  FETCH_CURRENT_ASSIGNMENT,
  TOGGLE_RELEASE_GRADE_SETTINGS,
  SET_ASSIGNMENT_FILTER,
  ADVANCED_ASSIGNMENT_VIEW,
  SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_REQUEST
} from "../constants/actions";

export const googleSyncAssignmentAction = payload => ({
  type: SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_REQUEST,
  payload
});

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

export const receiveAssignmentByAssignmentIdAction = payload => ({
  type: FETCH_CURRENT_ASSIGNMENT,
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
