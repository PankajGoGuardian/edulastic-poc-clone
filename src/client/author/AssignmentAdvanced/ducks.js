import { takeEvery, call, all } from "redux-saga/effects";
import { createAction } from "redux-starter-kit";
import { classBoardApi } from "@edulastic/api";

// constants
export const BULK_OPEN_ASSIGNMENT = "[test assignments] bulk open";
export const BULK_CLOSE_ASSIGNMENT = "[test assignments] bulk close";
export const BULK_PAUSE_ASSIGNMENT = "[test assignments] bulk pause";
export const BULK_MARK_AS_DONE_ASSIGNMENT = "[test assignments] bulk mark as done";
export const BULK_RELEASE_SCORE_ASSIGNMENT = "[test assignments] bulk release score";

// actions
export const bulkOpenAssignmentAction = createAction(BULK_OPEN_ASSIGNMENT);
export const bulkCloseAssignmentAction = createAction(BULK_CLOSE_ASSIGNMENT);
export const bulkPauseAssignmentAction = createAction(BULK_PAUSE_ASSIGNMENT);
export const bulkMarkAsDoneAssignmentAction = createAction(BULK_MARK_AS_DONE_ASSIGNMENT);
export const bulkReleaseScoreAssignmentAction = createAction(BULK_RELEASE_SCORE_ASSIGNMENT);

// saga
function* bulkOpenAssignmentSaga({ payload }) {
  try {
    yield call(classBoardApi.bulkOpenAssignment, payload);
  } catch (err) {
    console.error(err);
  }
}

function* bulkCloseAssignmentSaga({ payload }) {
  try {
    yield call(classBoardApi.bulkCloseAssignment, payload);
  } catch (err) {
    console.error(err);
  }
}

function* bulkPauseAssignmentSaga({ payload }) {
  try {
    yield call(classBoardApi.bulkPauseAssignment, payload);
  } catch (err) {
    console.error(err);
  }
}

function* bulkMarkAsDoneAssignmentSaga({ payload }) {
  try {
    yield call(classBoardApi.bulkMarkAsDoneAssignment, payload);
  } catch (err) {
    console.error(err);
  }
}

function* bulkReleaseScoreAssignmentSaga({ payload }) {
  try {
    yield call(classBoardApi.bulkMarkAsDoneAssignment, payload);
  } catch (err) {
    console.error(err);
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(BULK_OPEN_ASSIGNMENT, bulkOpenAssignmentSaga),
    yield takeEvery(BULK_CLOSE_ASSIGNMENT, bulkCloseAssignmentSaga),
    yield takeEvery(BULK_PAUSE_ASSIGNMENT, bulkPauseAssignmentSaga),
    yield takeEvery(BULK_MARK_AS_DONE_ASSIGNMENT, bulkMarkAsDoneAssignmentSaga),
    yield takeEvery(BULK_RELEASE_SCORE_ASSIGNMENT, bulkReleaseScoreAssignmentSaga)
  ]);
}
