import { createAction } from "redux-starter-kit";

import {
  RECEIVE_CLASS_RESPONSE_REQUEST,
  RECEIVE_STUDENT_RESPONSE_REQUEST,
  RECEIVE_CLASSSTUDENT_RESPONSE_REQUEST,
  RECEIVE_FEEDBACK_RESPONSE_REQUEST,
  CLEAR_FEEDBACK_RESPONSE,
  RECEIVE_GRADEBOOK_REQUEST,
  RECEIVE_TESTACTIVITY_REQUEST,
  UPDATE_RELEASE_SCORE,
  SET_SHOW_SCORE,
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
  UPDATE_STUDENT_ACTIVITY,
  UPDATE_REMOVED_STUDENTS_LIST,
  REMOVE_STUDENTS,
  UPDATE_STUDENTS_LIST,
  SET_CURRENT_TESTACTIVITY,
  GET_ALL_TESTACTIVITIES_FOR_STUDENT,
  SET_ALL_TESTACTIVITIES_FOR_STUDENT,
  UPDATE_CLASS_STUDENTS_LIST,
  FETCH_STUDENTS,
  ADD_STUDENTS,
  SET_STUDENTS_GRADEBOOK,
  UPDATE_SUBMITTED_STUDENTS,
  REDIRECT_TO_ASSIGNMENTS,
  TOGGLE_VIEW_PASSWORD_MODAL,
  REGENERATE_PASSWORD,
  UPDATE_PASSWORD_DETAILS,
  CANVAS_SYNC_GRADES
} from "../constants/actions";

export const receiveClassResponseAction = data => ({
  type: RECEIVE_CLASS_RESPONSE_REQUEST,
  payload: data
});

export const receiveStudentResponseAction = data => ({
  type: RECEIVE_STUDENT_RESPONSE_REQUEST,
  payload: data
});

export const receiveClassStudentResponseAction = data => ({
  type: RECEIVE_CLASSSTUDENT_RESPONSE_REQUEST,
  payload: data
});

export const receiveFeedbackResponseAction = data => ({
  type: RECEIVE_FEEDBACK_RESPONSE_REQUEST,
  payload: data
});

export const clearFeedbackResponseAction = () => ({
  type: CLEAR_FEEDBACK_RESPONSE
});

export const receiveGradeBookdAction = (assignmentId, classId) => ({
  type: RECEIVE_GRADEBOOK_REQUEST,
  payload: { assignmentId, classId }
});

export const receiveTestActivitydAction = (assignmentId, classId) => ({
  type: RECEIVE_TESTACTIVITY_REQUEST,
  payload: { assignmentId, classId }
});

export const releaseScoreAction = (assignmentId, classId, releaseScore, testId, filterState) => ({
  type: UPDATE_RELEASE_SCORE,
  payload: { assignmentId, classId, releaseScore, testId, filterState }
});

export const receiveStudentQuestionAction = (assignmentId, classId, questionId, studentId, testItemId) => ({
  type: RECEIVE_STUDENT_QUESTION_REQUEST,
  payload: { assignmentId, classId, questionId, studentId, testItemId }
});

export const receiveAnswersAction = (assignmentId, classId, questionId, itemId) => ({
  type: RECEIVE_CLASS_QUESTION_REQUEST,
  payload: { assignmentId, classId, questionId, itemId }
});

export const markAsDoneAction = (assignmentId, classId) => ({
  type: SET_MARK_AS_DONE,
  payload: { assignmentId, classId }
});

export const openAssignmentAction = (assignmentId, classId) => ({
  type: OPEN_ASSIGNMENT,
  payload: { assignmentId, classId }
});

export const closeAssignmentAction = (assignmentId, classId) => ({
  type: CLOSE_ASSIGNMENT,
  payload: { assignmentId, classId }
});

export const markAbsentAction = (assignmentId, classId, students) => ({
  type: MARK_AS_ABSENT,
  payload: { assignmentId, classId, students }
});

export const markSubmittedAction = (assignmentId, classId, students) => ({
  type: MARK_AS_SUBMITTED,
  payload: { assignmentId, classId, students }
});

export const downloadGradesResponseAction = (assignmentId, classId, students, isResponseRequired) => ({
  type: DOWNLOAD_GRADES_RESPONSES,
  payload: { assignmentId, classId, students, isResponseRequired }
});

export const updateStudentActivityAction = payload => ({
  type: UPDATE_REMOVED_STUDENTS_LIST,
  payload
});

export const updateSubmittedStudentsAction = payload => ({
  type: UPDATE_SUBMITTED_STUDENTS,
  payload
});

export const removeStudentAction = (assignmentId, classId, students) => ({
  type: REMOVE_STUDENTS,
  payload: { assignmentId, classId, students }
});

export const addStudentsAction = (assignmentId, classId, students, endDate) => ({
  type: ADD_STUDENTS,
  payload: { assignmentId, classId, students, endDate }
});

export const updateRemovedStudentsAction = payload => ({
  type: UPDATE_STUDENTS_LIST,
  payload
});

export const setStudentsGradeBookAction = payload => ({
  type: SET_STUDENTS_GRADEBOOK,
  payload
});

export const updateClassStudentsAction = payload => ({
  type: UPDATE_CLASS_STUDENTS_LIST,
  payload
});

export const fetchClassStudentsAction = payload => ({
  type: FETCH_STUDENTS,
  payload
});

export const updateAssignmentStatusAction = status => ({
  type: UPDATE_ASSIGNMENT_STATUS,
  payload: status
});

export const updateOpenAssignmentsAction = classId => ({
  type: UPDATE_OPEN_ASSIGNMENTS,
  payload: { classId }
});

export const updateCloseAssignmentsAction = classId => ({
  type: UPDATE_CLOSE_ASSIGNMENTS,
  payload: { classId }
});

export const saveOverallFeedbackAction = (testActivityId, groupId, feedback) => ({
  type: SAVE_OVERALL_FEEDBACK,
  payload: { testActivityId, groupId, feedback }
});

export const updateOverallFeedbackAction = payload => ({
  type: UPDATE_OVERALL_FEEDBACK,
  payload
});

export const togglePauseAssignmentAction = payload => ({
  type: TOGGLE_PAUSE_ASSIGNMENT,
  payload
});

export const setIsPausedAction = payload => ({
  type: SET_IS_PAUSED,
  payload
});

export const setCurrentTestActivityIdAction = createAction(SET_CURRENT_TESTACTIVITY);
export const getAllTestActivitiesForStudentAction = createAction(GET_ALL_TESTACTIVITIES_FOR_STUDENT);
export const setAllTestActivitiesForStudentAction = createAction(SET_ALL_TESTACTIVITIES_FOR_STUDENT);
export const redirectToAssignmentsAction = createAction(REDIRECT_TO_ASSIGNMENTS);
export const toggleViewPasswordAction = createAction(TOGGLE_VIEW_PASSWORD_MODAL);
export const regeneratePasswordAction = createAction(REGENERATE_PASSWORD);
export const updatePasswordDetailsAction = createAction(UPDATE_PASSWORD_DETAILS);
export const canvasSyncGradesAction = createAction(CANVAS_SYNC_GRADES);
