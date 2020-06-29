import { isEmpty } from "lodash";
import { takeLatest, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { createAction, createReducer } from "redux-starter-kit";

import { RESET_ALL_REPORTS } from "../../../common/reportsRedux";
import { getOrgDataFromSARFilter } from "../common/filterDataDucks";

const GET_REPORTS_PEER_PERFORMANCE_REQUEST = "[reports] get reports sub-groups performance request";
const GET_REPORTS_PEER_PERFORMANCE_REQUEST_SUCCESS = "[reports] get reports sub-groups performance success";
const GET_REPORTS_PEER_PERFORMANCE_REQUEST_ERROR = "[reports] get reports sub-groups performance error";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getPeerPerformanceRequestAction = createAction(GET_REPORTS_PEER_PERFORMANCE_REQUEST);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportReducer.reportPeerPerformanceReducer;

const _getReportsPeerPerformance = createSelector(
  stateSelector,
  state => state.peerPerformance
);

export const getReportsPeerPerformance = state => ({
  ..._getReportsPeerPerformance(state),
  metaInfo: getOrgDataFromSARFilter(state)
});

export const getReportsPeerPerformanceLoader = createSelector(
  stateSelector,
  state => state.loading
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

export const defaultReport = {
  districtAvg: 0,
  districtAvgPerf: 0,
  metaInfo: [],
  metricInfo: []
};

const initialState = {
  peerPerformance: defaultReport,
  loading: false
};

export const reportPeerPerformanceReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state, { payload }) => (state = initialState),
  [GET_REPORTS_PEER_PERFORMANCE_REQUEST]: (state, { payload }) => {
    state.loading = true;
  },
  [GET_REPORTS_PEER_PERFORMANCE_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.peerPerformance = payload.peerPerformance;
  },
  [GET_REPORTS_PEER_PERFORMANCE_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  }
});

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsPeerPerformanceRequest({ payload }) {
  try {
    payload.requestFilters.classIds =
      payload.requestFilters?.classIds?.join(",") || payload.requestFilters?.classId || "";
    payload.requestFilters.groupIds =
      payload.requestFilters?.groupIds?.join(",") || payload.requestFilters?.groupId || "";
    const {
      data: { result }
    } = yield call(reportsApi.fetchPeerPerformanceReport, payload);
    const peerPerformance = isEmpty(result) ? defaultReport : result;

    yield put({
      type: GET_REPORTS_PEER_PERFORMANCE_REQUEST_SUCCESS,
      payload: { peerPerformance }
    });
  } catch (error) {
    console.log("err", error.stack);
    const msg = "Failed to fetch sub-group performance. Please try again...";
    notification({ msg });
    yield put({
      type: GET_REPORTS_PEER_PERFORMANCE_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

export function* reportPeerPerformanceSaga() {
  yield all([yield takeLatest(GET_REPORTS_PEER_PERFORMANCE_REQUEST, getReportsPeerPerformanceRequest)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
