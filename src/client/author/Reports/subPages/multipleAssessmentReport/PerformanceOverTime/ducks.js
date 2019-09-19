import { takeEvery, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";
import { keyBy } from "lodash";
import { getReportsMARFilterData, getReportsMARSelectedPerformanceBandProfile } from "../common/filterDataDucks";

const RESET_REPORTS_PERFORMANCE_OVER_TIME = "[reports] reset reports performance over time";
const GET_REPORTS_PERFORMANCE_OVER_TIME_REQUEST = "[reports] get reports performance over time request";
const GET_REPORTS_PERFORMANCE_OVER_TIME_REQUEST_SUCCESS = "[reports] get reports performance over time success";
const GET_REPORTS_PERFORMANCE_OVER_TIME_REQUEST_ERROR = "[reports] get reports performance over time error";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const resetPerformanceOverTimeAction = createAction(RESET_REPORTS_PERFORMANCE_OVER_TIME);
export const getPerformanceOverTimeRequestAction = createAction(GET_REPORTS_PERFORMANCE_OVER_TIME_REQUEST);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportPerformanceOverTimeReducer;

export const getReportsPerformanceOverTime = createSelector(
  stateSelector,
  getReportsMARSelectedPerformanceBandProfile,
  (state, selectedProfile) => {
    const thresholdNameIndexed = keyBy(selectedProfile?.performanceBand || [], "threshold");
    const metricInfo = (state?.performanceOverTime?.data?.result?.metricInfo || []).map(x => ({
      ...x,
      bandName: thresholdNameIndexed[x.bandScore].name
    }));
    return { data: { result: { metricInfo } } };
  }
);

export const getReportsPerformanceOverTimeLoader = createSelector(
  stateSelector,
  state => state.loading
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  performanceOverTime: {},
  loading: true
};

export const reportPerformanceOverTimeReducer = createReducer(initialState, {
  [RESET_REPORTS_PERFORMANCE_OVER_TIME]: (state, { payload }) => (state = initialState),
  [GET_REPORTS_PERFORMANCE_OVER_TIME_REQUEST]: (state, { payload }) => {
    state.loading = true;
  },
  [GET_REPORTS_PERFORMANCE_OVER_TIME_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.performanceOverTime = payload.performanceOverTime;
  },
  [GET_REPORTS_PERFORMANCE_OVER_TIME_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  }
});

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsPerformanceOverTimeRequest({ payload }) {
  try {
    const performanceOverTime = yield call(reportsApi.fetchPerformanceOverTimeReport, payload);
    const metricInfo = performanceOverTime?.data?.result?.metricInfo || [];

    yield put({
      type: GET_REPORTS_PERFORMANCE_OVER_TIME_REQUEST_SUCCESS,
      payload: { performanceOverTime }
    });
  } catch (error) {
    console.log("err", error.stack);
    let msg = "Failed to fetch performance over time Please try again...";
    yield call(message.error, msg);
    yield put({
      type: GET_REPORTS_PERFORMANCE_OVER_TIME_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

export function* reportPerformanceOverTimeSaga() {
  yield all([yield takeEvery(GET_REPORTS_PERFORMANCE_OVER_TIME_REQUEST, getReportsPerformanceOverTimeRequest)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
