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
  SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_REQUEST,
  SET_SHARE_WITH_GC_PROGRESS,
  TOGGLE_STUDENT_REPORT_CARD_SETTINGS,
  SYNC_ASSIGNMENT_GRADES_WITH_GOOGLE_CLASSROOM_REQUEST,
  SYNC_ASSIGNMENT_WITH_SCHOOLOGY_CLASSROOM_REQUEST,
  SYNC_ASSIGNMENT_GRADES_WITH_SCHOOLOGY_CLASSROOM_REQUEST,
  EDIT_TAGS_REQUEST,
  SET_TAGS_UPDATING_STATE,
  SYNC_ASSIGNMENT_GRADES_WITH_CLEVER_REQUEST,
  BULK_UPDATE_ASSIGNMENT_SETTINGS,
  SET_BULK_UPDATE_ASSIGNMENT_SETTINGS_CALL_STATE,
} from '../constants/actions'

export const googleSyncAssignmentAction = (payload) => ({
  type: SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_REQUEST,
  payload,
})

export const setShareWithGCProgressAction = (payload) => ({
  type: SET_SHARE_WITH_GC_PROGRESS,
  payload,
})

export const googleSyncAssignmentGradesAction = (payload) => ({
  type: SYNC_ASSIGNMENT_GRADES_WITH_GOOGLE_CLASSROOM_REQUEST,
  payload,
})

export const cleverSyncAssignmentGradesAction = (payload) => ({
  type: SYNC_ASSIGNMENT_GRADES_WITH_CLEVER_REQUEST,
  payload,
})

export const schoologySyncAssignmentAction = (payload) => ({
  type: SYNC_ASSIGNMENT_WITH_SCHOOLOGY_CLASSROOM_REQUEST,
  payload,
})

export const schoologySyncAssignmentGradesAction = (payload) => ({
  type: SYNC_ASSIGNMENT_GRADES_WITH_SCHOOLOGY_CLASSROOM_REQUEST,
  payload,
})

export const receiveAssignmentsAction = (payload) => ({
  type: RECEIVE_ASSIGNMENTS_REQUEST,
  payload,
})

export const receiveAssignmentsSummaryAction = (payload) => ({
  type: RECEIVE_ASSIGNMENTS_SUMMARY_REQUEST,
  payload,
})

export const receiveAssignmentByIdAction = (payload) => ({
  type: FETCH_CURRENT_EDITING_ASSIGNMENT,
  payload,
})

export const receiveAssignmentByAssignmentIdAction = (payload) => ({
  type: FETCH_CURRENT_ASSIGNMENT,
  payload,
})

export const updateReleaseScoreSettingsAction = (payload) => ({
  type: UPDATE_RELEASE_SCORE_SETTINGS,
  payload,
})

export const receiveAssignmentClassList = (payload) => ({
  type: RECEIVE_ASSIGNMENT_CLASS_LIST_REQUEST,
  payload,
})

export const toggleReleaseScoreSettingsAction = (payload) => ({
  type: TOGGLE_RELEASE_GRADE_SETTINGS,
  payload,
})

export const toggleAssignmentViewAction = () => ({
  type: ADVANCED_ASSIGNMENT_VIEW,
})

export const setAssignmentFiltersAction = (payload) => ({
  type: SET_ASSIGNMENT_FILTER,
  payload,
})

export const toggleStudentReportCardSettingsAction = (payload) => ({
  type: TOGGLE_STUDENT_REPORT_CARD_SETTINGS,
  payload,
})

export const editTagsRequestAction = (payload) => ({
  type: EDIT_TAGS_REQUEST,
  payload,
})

export const setTagsUpdatingStateAction = (payload) => ({
  type: SET_TAGS_UPDATING_STATE,
  payload,
})

export const setBulkUpdateAssignmentSettingState = (payload) => ({
  type: SET_BULK_UPDATE_ASSIGNMENT_SETTINGS_CALL_STATE,
  payload,
})

export const bulkUpdateAssignmentSettingsAction = (payload) => ({
  type: BULK_UPDATE_ASSIGNMENT_SETTINGS,
  payload,
})
