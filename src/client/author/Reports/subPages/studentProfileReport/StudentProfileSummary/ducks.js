import { takeLatest, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import  {notification} from "@edulastic/common";
import { createAction, createReducer } from "redux-starter-kit";

import { RESET_ALL_REPORTS } from "../../../common/reportsRedux";

const GET_REPORTS_STUDENT_PROFILE_SUMMARY_REQUEST = "[reports] get reports student profile summary request";
const GET_REPORTS_STUDENT_PROFILE_SUMMARY_REQUEST_SUCCESS = "[reports] get reports student profile summary success";
const GET_REPORTS_STUDENT_PROFILE_SUMMARY_REQUEST_ERROR = "[reports] get reports student profile summary error";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getStudentProfileSummaryRequestAction = createAction(GET_REPORTS_STUDENT_PROFILE_SUMMARY_REQUEST);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportReducer.reportStudentProfileSummaryReducer;

export const getReportsStudentProfileSummary = createSelector(
  stateSelector,
  state => state.studentProfileSummary
);

export const getReportsStudentProfileSummaryLoader = createSelector(
  stateSelector,
  state => state.loading
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  studentProfileSummary: {},
  loading: false
};

export const reportStudentProfileSummaryReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state, { payload }) => (state = initialState),
  [GET_REPORTS_STUDENT_PROFILE_SUMMARY_REQUEST]: (state, { payload }) => {
    state.loading = true;
  },
  [GET_REPORTS_STUDENT_PROFILE_SUMMARY_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.studentProfileSummary = payload.studentProfileSummary;
  },
  [GET_REPORTS_STUDENT_PROFILE_SUMMARY_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  }
});

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsStudentProfileSummaryRequest({ payload }) {
  try {
    const studentProfileSummary = yield call(reportsApi.fetchStudentProfileSummaryReport, payload);

    yield put({
      type: GET_REPORTS_STUDENT_PROFILE_SUMMARY_REQUEST_SUCCESS,
      payload: { studentProfileSummary }
    });
  } catch (error) {
    console.log("err", error.stack);
    let msg = "Failed to fetch student profile summary Please try again...";
    notification({msg:msg});
    yield put({
      type: GET_REPORTS_STUDENT_PROFILE_SUMMARY_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

export function* reportStudentProfileSummarySaga() {
  yield all([yield takeLatest(GET_REPORTS_STUDENT_PROFILE_SUMMARY_REQUEST, getReportsStudentProfileSummaryRequest)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
