import { takeEvery, takeLatest, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";
import tempData from "./static/json/tempData";

const GET_REPORTS_PEER_PERFORMANCE_REQUEST = "[reports] get reports peer performance request";
const GET_REPORTS_PEER_PERFORMANCE_REQUEST_SUCCESS = "[reports] get reports peer performance success";
const GET_REPORTS_PEER_PERFORMANCE_REQUEST_ERROR = "[reports] get reports peer performance error";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getPeerPerformanceRequestAction = createAction(GET_REPORTS_PEER_PERFORMANCE_REQUEST);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportPeerPerformanceReducer;

export const getReportsPeerPerformance = createSelector(
  stateSelector,
  state => state.peerPerformance
);

export const getReportsPeerPerformanceLoader = createSelector(
  stateSelector,
  state => state.loading
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  peerPerformance: {},
  loading: true
};

export const reportPeerPerformanceReducer = createReducer(initialState, {
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
    const peerPerformance = yield call(reportsApi.fetchPeerPerformanceReport, payload);

    yield put({
      type: GET_REPORTS_PEER_PERFORMANCE_REQUEST_SUCCESS,
      payload: { peerPerformance }
    });
  } catch (error) {
    console.log("err", error.stack);
    let msg = "Failed to fetch peer performance Please try again...";
    yield call(message.error, msg);
    yield put({
      type: GET_REPORTS_PEER_PERFORMANCE_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

export function* reportPeerPerformanceSaga() {
  yield all([yield takeEvery(GET_REPORTS_PEER_PERFORMANCE_REQUEST, getReportsPeerPerformanceRequest)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
