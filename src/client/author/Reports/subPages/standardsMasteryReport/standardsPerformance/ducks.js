import { takeEvery, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";

const GET_REPORTS_STANDARDS_PERFORMANCE_SUMMARY_REQUEST = "[reports] get reports standards performance summary request";
const GET_REPORTS_STANDARDS_PERFORMANCE_SUMMARY_REQUEST_SUCCESS =
  "[reports] get reports standards performance summary success";
const GET_REPORTS_STANDARDS_PERFORMANCE_SUMMARY_REQUEST_ERROR =
  "[reports] get reports standards performance summary error";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getStandardsPerformanceSummaryRequestAction = createAction(
  GET_REPORTS_STANDARDS_PERFORMANCE_SUMMARY_REQUEST
);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportStandardsPerformanceSummaryReducer;

export const getReportsStandardsPerformanceSummary = createSelector(
  stateSelector,
  state => state.standardsPerformanceSummary
);

export const getReportsStandardsPerformanceSummaryLoader = createSelector(
  stateSelector,
  state => state.loading
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  standardsPerformanceSummary: {},
  loading: true
};

export const reportStandardsPerformanceSummaryReducer = createReducer(initialState, {
  [GET_REPORTS_STANDARDS_PERFORMANCE_SUMMARY_REQUEST]: (state, { payload }) => {
    state.loading = true;
  },
  [GET_REPORTS_STANDARDS_PERFORMANCE_SUMMARY_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.standardsPerformanceSummary = payload.standardsPerformanceSummary;
  },
  [GET_REPORTS_STANDARDS_PERFORMANCE_SUMMARY_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  }
});

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsStandardsPerformanceSummaryRequest({ payload }) {
  try {
    const standardsPerformanceSummary = yield call(reportsApi.fetchStandardsPerformanceSummaryReport, payload);
    // const standardsPerformanceSummary = { data: tempData };

    yield put({
      type: GET_REPORTS_STANDARDS_PERFORMANCE_SUMMARY_REQUEST_SUCCESS,
      payload: { standardsPerformanceSummary }
    });
  } catch (error) {
    console.log("err", error.stack);
    let msg = "Failed to fetch reports standards performance Please try again...";

    yield call(message.error, msg);
    yield put({
      type: GET_REPORTS_STANDARDS_PERFORMANCE_SUMMARY_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

export function* reportStandardsPerformanceSummarySaga() {
  yield all([
    yield takeEvery(GET_REPORTS_STANDARDS_PERFORMANCE_SUMMARY_REQUEST, getReportsStandardsPerformanceSummaryRequest)
  ]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
