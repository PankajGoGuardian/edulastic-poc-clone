import { takeEvery, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import { notification } from "@edulastic/common";
import { createAction, createReducer } from "redux-starter-kit";

import { RESET_ALL_REPORTS } from "../../../common/reportsRedux";
import { getClassAndGroupIds } from "../common/utils/transformers";

const GET_REPORTS_PEER_PROGRESS_ANALYSIS_REQUEST = "[reports] get reports peer progress analysis request";
const GET_REPORTS_PEER_PROGRESS_ANALYSIS_REQUEST_SUCCESS = "[reports] get reports peer progress analysis success";
const GET_REPORTS_PEER_PROGRESS_ANALYSIS_REQUEST_ERROR = "[reports] get reports peer progress analysis error";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getPeerProgressAnalysisRequestAction = createAction(GET_REPORTS_PEER_PROGRESS_ANALYSIS_REQUEST);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportReducer.reportPeerProgressAnalysisReducer;

export const getReportsPeerProgressAnalysis = createSelector(
  stateSelector,
  state => state.peerProgressAnalysis
);

export const getReportsPeerProgressAnalysisLoader = createSelector(
  stateSelector,
  state => state.loading
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  peerProgressAnalysis: {},
  loading: true
};

export const reportPeerProgressAnalysisReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state, { payload }) => (state = initialState),
  [GET_REPORTS_PEER_PROGRESS_ANALYSIS_REQUEST]: (state, { payload }) => {
    state.loading = true;
  },
  [GET_REPORTS_PEER_PROGRESS_ANALYSIS_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.peerProgressAnalysis = payload.peerProgressAnalysis;
  },
  [GET_REPORTS_PEER_PROGRESS_ANALYSIS_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  }
});

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsPeerProgressAnalysisRequest({ payload }) {
  try {
    const { classIds, groupIds } = getClassAndGroupIds(payload);
    const peerProgressAnalysis = yield call(reportsApi.fetchPeerProgressAnalysisReport, {
      ...payload,
      classIds,
      groupIds
    });

    yield put({
      type: GET_REPORTS_PEER_PROGRESS_ANALYSIS_REQUEST_SUCCESS,
      payload: { peerProgressAnalysis }
    });
  } catch (error) {
    console.log("err", error.stack);
    let msg = "Failed to fetch peer progress analysis Please try again...";
    notification({msg:msg});
    yield put({
      type: GET_REPORTS_PEER_PROGRESS_ANALYSIS_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

export function* reportPeerProgressAnalysisSaga() {
  yield all([yield takeEvery(GET_REPORTS_PEER_PROGRESS_ANALYSIS_REQUEST, getReportsPeerProgressAnalysisRequest)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
