import { takeEvery, call, all } from "redux-saga/effects";
import { createAction } from "redux-starter-kit";
import { classBoardApi } from "@edulastic/api";
import { notification } from "@edulastic/common";
import { downloadCSV } from "../Reports/common/util";

// constants
export const BULK_OPEN_ASSIGNMENT = "[test assignments] bulk open";
export const BULK_CLOSE_ASSIGNMENT = "[test assignments] bulk close";
export const BULK_PAUSE_ASSIGNMENT = "[test assignments] bulk pause";
export const BULK_MARK_AS_DONE_ASSIGNMENT = "[test assignments] bulk mark as done";
export const BULK_RELEASE_SCORE_ASSIGNMENT = "[test assignments] bulk release score";
export const BULK_UNASSIGN_ASSIGNMENT = "[test assignments] bulk unassign";
export const BULK_DOWNLOAD_GRADES_AND_RESPONSES = "[test assignments] bulk download grades and responses";

// actions
export const bulkOpenAssignmentAction = createAction(BULK_OPEN_ASSIGNMENT);
export const bulkCloseAssignmentAction = createAction(BULK_CLOSE_ASSIGNMENT);
export const bulkPauseAssignmentAction = createAction(BULK_PAUSE_ASSIGNMENT);
export const bulkMarkAsDoneAssignmentAction = createAction(BULK_MARK_AS_DONE_ASSIGNMENT);
export const bulkReleaseScoreAssignmentAction = createAction(BULK_RELEASE_SCORE_ASSIGNMENT);
export const bulkUnassignAssignmentAction = createAction(BULK_UNASSIGN_ASSIGNMENT);
export const bulkDownloadGradesAndResponsesAction = createAction(BULK_DOWNLOAD_GRADES_AND_RESPONSES);

// saga
function* bulkOpenAssignmentSaga({ payload }) {
  try {
    yield call(classBoardApi.bulkOpenAssignment, payload);
    notification({ type: "info", msg: "Starting Bulk Action Request" });
  } catch (err) {
    console.error(err);
    const errorMessage = err.data?.message || "Failed to start Bulk Action request";
    notification({ msg: errorMessage });
  }
}

function* bulkCloseAssignmentSaga({ payload }) {
  try {
    yield call(classBoardApi.bulkCloseAssignment, payload);
    notification({ type: "info", msg: "Starting Bulk Action Request" });
  } catch (err) {
    console.error(err);
    const errorMessage = err.data?.message || "Failed to start Bulk Action request";
    notification({ msg: errorMessage });
  }
}

function* bulkPauseAssignmentSaga({ payload }) {
  try {
    yield call(classBoardApi.bulkPauseAssignment, payload);
    notification({ type: "info", msg: "Starting Bulk Action Request" });
  } catch (err) {
    console.error(err);
    const errorMessage = err.data?.message || "Failed to start Bulk Action request";
    notification({ msg: errorMessage });
  }
}

function* bulkMarkAsDoneAssignmentSaga({ payload }) {
  try {
    yield call(classBoardApi.bulkMarkAsDoneAssignment, payload);
    notification({ type: "info", msg: "Starting Bulk Action Request" });
  } catch (err) {
    console.error(err);
    const errorMessage = err.data?.message || "Failed to start Bulk Action request";
    notification({ msg: errorMessage });
  }
}

function* bulkReleaseScoreAssignmentSaga({ payload }) {
  try {
    yield call(classBoardApi.bulkReleaseScoreAssignment, payload);
    notification({ type: "info", msg: "Starting Bulk Action Request" });
  } catch (err) {
    console.error(err);
    const errorMessage = err.data?.message || "Failed to start Bulk Action request";
    notification({ msg: errorMessage });
  }
}

function* bulkUnassignAssignmentSaga({ payload }) {
  try {
    yield call(classBoardApi.bulkUnassignAssignment, payload);
    notification({ type: "info", msg: "Starting Bulk Action Request" });
  } catch (err) {
    console.error(err);
    const errorMessage = err.data?.message || "Failed to start Bulk Action request";
    notification({ msg: errorMessage });
  }
}

function* bulkDownloadGradesAndResponsesSaga({ payload }) {
  try {
    const { data, testId, testType, testName, isResponseRequired = false } = payload;
    const _payload = {
      data: {
        assignmentGroups: data,
        isResponseRequired
      },
      testId,
      testType
    };
    notification({ type: "info", msg: "Starting Bulk Action Request" });
    const response = yield call(classBoardApi.bulkDownloadGrades, _payload);
    const fileName = `${testName}.csv`;
    downloadCSV(fileName, response);
  } catch (err) {
    console.error(err);
    const errorMessage = err.data?.message || "Failed to start Bulk Action request";
    notification({ msg: errorMessage });
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(BULK_OPEN_ASSIGNMENT, bulkOpenAssignmentSaga),
    yield takeEvery(BULK_CLOSE_ASSIGNMENT, bulkCloseAssignmentSaga),
    yield takeEvery(BULK_PAUSE_ASSIGNMENT, bulkPauseAssignmentSaga),
    yield takeEvery(BULK_MARK_AS_DONE_ASSIGNMENT, bulkMarkAsDoneAssignmentSaga),
    yield takeEvery(BULK_RELEASE_SCORE_ASSIGNMENT, bulkReleaseScoreAssignmentSaga),
    yield takeEvery(BULK_UNASSIGN_ASSIGNMENT, bulkUnassignAssignmentSaga),
    yield takeEvery(BULK_DOWNLOAD_GRADES_AND_RESPONSES, bulkDownloadGradesAndResponsesSaga)
  ]);
}
