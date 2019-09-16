import { takeEvery, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";

const RESET_REPORTS_STUDENT_PROGRESS = "[reports] reset reports student progress";
const GET_REPORTS_STUDENT_PROGRESS_REQUEST = "[reports] get reports student progress request";
const GET_REPORTS_STUDENT_PROGRESS_REQUEST_SUCCESS = "[reports] get reports student progress success";
const GET_REPORTS_STUDENT_PROGRESS_REQUEST_ERROR = "[reports] get reports student progress error";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const resetStudentProgressAction = createAction(RESET_REPORTS_STUDENT_PROGRESS);
export const getStudentProgressRequestAction = createAction(GET_REPORTS_STUDENT_PROGRESS_REQUEST);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportStudentProgressReducer;

export const getReportsStudentProgress = createSelector(
  stateSelector,
  state => state.studentProgress
);

export const getReportsStudentProgressLoader = createSelector(
  stateSelector,
  state => state.loading
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  studentProgress: {},
  loading: true
};

export const reportStudentProgressReducer = createReducer(initialState, {
  [RESET_REPORTS_STUDENT_PROGRESS]: (state, { payload }) => {
    state.loading = false;
    state.studentProgress = {};
  },
  [GET_REPORTS_STUDENT_PROGRESS_REQUEST]: (state, { payload }) => {
    state.loading = true;
  },
  [GET_REPORTS_STUDENT_PROGRESS_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.studentProgress = payload.studentProgress;
  },
  [GET_REPORTS_STUDENT_PROGRESS_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  }
});

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsStudentProgressRequest({ payload }) {
  try {
    const studentProgress = yield call(reportsApi.fetchStudentProgressReport, payload);

    yield put({
      type: GET_REPORTS_STUDENT_PROGRESS_REQUEST_SUCCESS,
      payload: { studentProgress }
    });
  } catch (error) {
    console.log("err", error.stack);
    let msg = "Failed to fetch student progress Please try again...";
    yield call(message.error, msg);
    yield put({
      type: GET_REPORTS_STUDENT_PROGRESS_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

export function* reportStudentProgressSaga() {
  yield all([yield takeEvery(GET_REPORTS_STUDENT_PROGRESS_REQUEST, getReportsStudentProgressRequest)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
