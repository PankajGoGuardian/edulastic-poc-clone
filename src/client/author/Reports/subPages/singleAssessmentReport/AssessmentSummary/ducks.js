import { isEmpty } from "lodash";
import { takeLatest, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import  {notification} from "@edulastic/common";
import { createAction, createReducer } from "redux-starter-kit";

import { RESET_ALL_REPORTS } from "../../../common/reportsRedux";

const GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST = "[reports] get reports assessment summary request";
const GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST_SUCCESS = "[reports] get reports assessment summary success";
const GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST_ERROR = "[reports] get reports assessment summary error";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getAssessmentSummaryRequestAction = createAction(GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportReducer.reportAssessmentSummaryReducer;

export const getReportsAssessmentSummary = createSelector(
  stateSelector,
  state => state.assessmentSummary
);

export const getReportsAssessmentSummaryLoader = createSelector(
  stateSelector,
  state => state.loading
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

export const defaultReport = {
  bandInfo: [],
  metricInfo: []
};

const initialState = {
  assessmentSummary: defaultReport,
  loading: true
};

export const reportAssessmentSummaryReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state, { payload }) => (state = initialState),
  [GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST]: (state, { payload }) => {
    state.loading = true;
  },
  [GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.assessmentSummary = payload.assessmentSummary;
  },
  [GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  }
});

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsAssessmentSummaryRequest({ payload }) {
  try {
    payload.requestFilters.classIds =
      payload.requestFilters?.classIds?.join(",") || payload.requestFilters?.classId || "";
    payload.requestFilters.groupIds =
      payload.requestFilters?.groupIds?.join(",") || payload.requestFilters?.groupId || "";
    const {
      data: { result }
    } = yield call(reportsApi.fetchAssessmentSummaryReport, payload);
    const assessmentSummary = isEmpty(result) ? defaultReport : result;

    yield put({
      type: GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST_SUCCESS,
      payload: { assessmentSummary }
    });
  } catch (error) {
    console.log("err", error.stack);
    let msg = "Failed to fetch assessment Summary Please try again...";
    notification({msg:msg});
    yield put({
      type: GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

export function* reportAssessmentSummarySaga() {
  yield all([yield takeLatest(GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST, getReportsAssessmentSummaryRequest)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
