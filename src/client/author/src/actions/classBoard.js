import { createAction } from 'redux-starter-kit'

import {
  RECEIVE_CLASS_RESPONSE_REQUEST,
  RECEIVE_STUDENT_RESPONSE_REQUEST,
  RECEIVE_CLASSSTUDENT_RESPONSE_REQUEST,
  RECEIVE_FEEDBACK_RESPONSE_REQUEST,
  CLEAR_FEEDBACK_RESPONSE,
  RECEIVE_GRADEBOOK_REQUEST,
  RECEIVE_TESTACTIVITY_REQUEST,
  UPDATE_RELEASE_SCORE,
  RECEIVE_STUDENT_QUESTION_REQUEST,
  RECEIVE_CLASS_QUESTION_REQUEST,
  SET_MARK_AS_DONE,
  UPDATE_ASSIGNMENT_STATUS,
  OPEN_ASSIGNMENT,
  CLOSE_ASSIGNMENT,
  UPDATE_OPEN_ASSIGNMENTS,
  UPDATE_CLOSE_ASSIGNMENTS,
  SAVE_OVERALL_FEEDBACK,
  UPDATE_OVERALL_FEEDBACK,
  MARK_AS_ABSENT,
  MARK_AS_SUBMITTED,
  DOWNLOAD_GRADES_RESPONSES,
  TOGGLE_PAUSE_ASSIGNMENT,
  SET_IS_PAUSED,
  UPDATE_REMOVED_STUDENTS_LIST,
  REMOVE_STUDENTS,
  UPDATE_STUDENTS_LIST,
  SET_CURRENT_TESTACTIVITY,
  GET_ALL_TESTACTIVITIES_FOR_STUDENT,
  SET_ALL_TESTACTIVITIES_FOR_STUDENT,
  UPDATE_CLASS_STUDENTS_LIST,
  FETCH_STUDENTS,
  ADD_STUDENTS,
  UPDATE_SUBMITTED_STUDENTS,
  REDIRECT_TO_ASSIGNMENTS,
  TOGGLE_VIEW_PASSWORD_MODAL,
  REGENERATE_PASSWORD,
  UPDATE_PASSWORD_DETAILS,
  CANVAS_SYNC_GRADES,
  CANVAS_SYNC_ASSIGNMENT,
  FETCH_SERVER_TIME,
  PAUSE_STUDENTS,
  UPDATE_PAUSE_STATUS_ACTION,
  SET_UPDATED_ACTIVITY_IN_ENTITY,
  CORRECT_ITEM_UPDATE_REQUEST,
  RELOAD_LCB_DATA_IN_STUDENT_VIEW,
  REPLACE_ORIGINAL_ITEM,
  SET_CORRECT_ITEM_UPDATE_PROGRESS,
  SET_SILENT_CLONING,
  SET_REALTIME_ATTEMPT_DATA,
} from '../constants/actions'

export const receiveClassResponseAction = (data) => ({
  type: RECEIVE_CLASS_RESPONSE_REQUEST,
  payload: data,
})

export const receiveStudentResponseAction = (data) => ({
  type: RECEIVE_STUDENT_RESPONSE_REQUEST,
  payload: data,
})

export const receiveClassStudentResponseAction = (data) => ({
  type: RECEIVE_CLASSSTUDENT_RESPONSE_REQUEST,
  payload: data,
})

export const receiveFeedbackResponseAction = (data) => ({
  type: RECEIVE_FEEDBACK_RESPONSE_REQUEST,
  payload: data,
})

export const clearFeedbackResponseAction = () => ({
  type: CLEAR_FEEDBACK_RESPONSE,
})

export const receiveGradeBookdAction = (assignmentId, classId) => ({
  type: RECEIVE_GRADEBOOK_REQUEST,
  payload: { assignmentId, classId },
})

export const receiveTestActivitydAction = (
  assignmentId,
  classId,
  isQuestionsView = false,
  studentResponseParams
) => ({
  type: RECEIVE_TESTACTIVITY_REQUEST,
  payload: {
    assignmentId,
    classId,
    isQuestionsView,
    studentResponseParams,
    loader: true,
  },
})

// This new action is same as existing fetch action,
// however with the help of additional reload: false flag we are restricting loader to show in UI
export const receiveTestActivityRealTimeAction = ({
  assignmentId,
  classId,
  isQuestionsView = false,
  studentResponseParams,
  loader,
}) => ({
  type: RECEIVE_TESTACTIVITY_REQUEST,
  payload: {
    assignmentId,
    classId,
    isQuestionsView,
    studentResponseParams,
    loader,
  },
})

export const releaseScoreAction = (
  assignmentId,
  classId,
  releaseScore,
  testId,
  filterState
) => ({
  type: UPDATE_RELEASE_SCORE,
  payload: { assignmentId, classId, releaseScore, testId, filterState },
})

export const receiveStudentQuestionAction = (
  assignmentId,
  classId,
  questionId,
  studentId,
  testItemId,
  callItemLevel
) => ({
  type: RECEIVE_STUDENT_QUESTION_REQUEST,
  payload: {
    assignmentId,
    classId,
    questionId,
    studentId,
    testItemId,
    callItemLevel,
  },
})

export const receiveAnswersAction = (
  assignmentId,
  classId,
  questionId,
  itemId,
  questionIds = []
) => ({
  type: RECEIVE_CLASS_QUESTION_REQUEST,
  payload: { assignmentId, classId, questionId, itemId, questionIds },
})

export const markAsDoneAction = (assignmentId, classId, testId) => ({
  type: SET_MARK_AS_DONE,
  payload: { assignmentId, classId, testId },
})

export const openAssignmentAction = (assignmentId, classId, testId) => ({
  type: OPEN_ASSIGNMENT,
  payload: { assignmentId, classId, testId },
})

export const closeAssignmentAction = (assignmentId, classId, testId) => ({
  type: CLOSE_ASSIGNMENT,
  payload: { assignmentId, classId, testId },
})

export const markAbsentAction = (assignmentId, classId, students) => ({
  type: MARK_AS_ABSENT,
  payload: { assignmentId, classId, students },
})

export const markSubmittedAction = (assignmentId, classId, students) => ({
  type: MARK_AS_SUBMITTED,
  payload: { assignmentId, classId, students },
})

export const togglePauseStudentsAction = (
  assignmentId,
  classId,
  students,
  isPause
) => ({
  type: PAUSE_STUDENTS,
  payload: { assignmentId, classId, students, isPause },
})

export const downloadGradesResponseAction = (
  assignmentId,
  classId,
  students,
  isResponseRequired
) => ({
  type: DOWNLOAD_GRADES_RESPONSES,
  payload: { assignmentId, classId, students, isResponseRequired },
})

export const updateStudentActivityAction = (payload) => ({
  type: UPDATE_REMOVED_STUDENTS_LIST,
  payload,
})

export const updateSubmittedStudentsAction = (payload) => ({
  type: UPDATE_SUBMITTED_STUDENTS,
  payload,
})

export const removeStudentAction = (assignmentId, classId, students) => ({
  type: REMOVE_STUDENTS,
  payload: { assignmentId, classId, students },
})

export const addStudentsAction = (
  assignmentId,
  classId,
  students,
  endDate
) => ({
  type: ADD_STUDENTS,
  payload: { assignmentId, classId, students, endDate },
})

export const updateRemovedStudentsAction = (payload) => ({
  type: UPDATE_STUDENTS_LIST,
  payload,
})

export const updateClassStudentsAction = (payload) => ({
  type: UPDATE_CLASS_STUDENTS_LIST,
  payload,
})

export const fetchClassStudentsAction = (payload) => ({
  type: FETCH_STUDENTS,
  payload,
})

export const updateAssignmentStatusAction = (status) => ({
  type: UPDATE_ASSIGNMENT_STATUS,
  payload: status,
})

export const updateOpenAssignmentsAction = (classId) => ({
  type: UPDATE_OPEN_ASSIGNMENTS,
  payload: { classId },
})

export const updateCloseAssignmentsAction = (classId) => ({
  type: UPDATE_CLOSE_ASSIGNMENTS,
  payload: { classId },
})

export const saveOverallFeedbackAction = (
  testActivityId,
  groupId,
  feedback
) => ({
  type: SAVE_OVERALL_FEEDBACK,
  payload: { testActivityId, groupId, feedback },
})

export const updateOverallFeedbackAction = (payload) => ({
  type: UPDATE_OVERALL_FEEDBACK,
  payload,
})

export const togglePauseAssignmentAction = (payload) => ({
  type: TOGGLE_PAUSE_ASSIGNMENT,
  payload,
})

export const setIsPausedAction = (payload) => ({
  type: SET_IS_PAUSED,
  payload,
})

export const setCurrentTestActivityIdAction = createAction(
  SET_CURRENT_TESTACTIVITY
)
export const getAllTestActivitiesForStudentAction = createAction(
  GET_ALL_TESTACTIVITIES_FOR_STUDENT
)
export const setAllTestActivitiesForStudentAction = createAction(
  SET_ALL_TESTACTIVITIES_FOR_STUDENT
)
export const redirectToAssignmentsAction = createAction(REDIRECT_TO_ASSIGNMENTS)
export const toggleViewPasswordAction = createAction(TOGGLE_VIEW_PASSWORD_MODAL)
export const regeneratePasswordAction = createAction(REGENERATE_PASSWORD)
export const updatePasswordDetailsAction = createAction(UPDATE_PASSWORD_DETAILS)
export const canvasSyncGradesAction = createAction(CANVAS_SYNC_GRADES)
export const canvasSyncAssignmentAction = createAction(CANVAS_SYNC_ASSIGNMENT)
export const fetchServerTimeAction = createAction(FETCH_SERVER_TIME)
export const updatePauseStatusAction = createAction(UPDATE_PAUSE_STATUS_ACTION)
export const setUpdateActivityIdInEntityAction = createAction(
  SET_UPDATED_ACTIVITY_IN_ENTITY
)

export const updateCorrectTestItemAction = createAction(
  CORRECT_ITEM_UPDATE_REQUEST
)

export const reloadLcbDataInStudentViewAction = createAction(
  RELOAD_LCB_DATA_IN_STUDENT_VIEW
)

export const replaceOriginalItemAction = createAction(REPLACE_ORIGINAL_ITEM)

export const correctItemUpdateProgressAction = createAction(
  SET_CORRECT_ITEM_UPDATE_PROGRESS
)

export const setSilentCloningAction = createAction(SET_SILENT_CLONING)

export const setRealTimeAttemptDataAction = createAction(
  SET_REALTIME_ATTEMPT_DATA
)
