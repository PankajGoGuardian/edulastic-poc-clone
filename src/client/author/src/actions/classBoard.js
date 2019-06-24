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
  UPDATE_STUDENT_ACTIVITY
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

export const releaseScoreAction = (assignmentId, classId, isReleaseScore) => ({
  type: UPDATE_RELEASE_SCORE,
  payload: { assignmentId, classId, isReleaseScore }
});

export const setShowScoreAction = payload => ({
  type: SET_SHOW_SCORE,
  payload
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

export const updateStudentActivityAction = payload => ({
  type: UPDATE_STUDENT_ACTIVITY,
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
