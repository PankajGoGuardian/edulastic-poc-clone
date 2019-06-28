import { takeEvery, takeLatest, call, put, all } from "redux-saga/effects";
import { get } from "lodash";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";

const GET_REPORTS_QUESTION_ANALYSIS_REQUEST = "[reports] get reports question analysis request";
const GET_REPORTS_QUESTION_ANALYSIS_REQUEST_SUCCESS = "[reports] get reports question analysis success";
const GET_REPORTS_QUESTION_ANALYSIS_REQUEST_ERROR = "[reports] get reports question analysis error";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getQuestionAnalysisRequestAction = createAction(GET_REPORTS_QUESTION_ANALYSIS_REQUEST);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportQuestionAnalysisReducer;

export const getReportsQuestionAnalysis = createSelector(
  stateSelector,
  state => state.questionAnalysis
);

export const getReportsQuestionAnalysisLoader = createSelector(
  stateSelector,
  state => state.loading
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  questionAnalysis: {},
  loading: true
};

export const reportQuestionAnalysisReducer = createReducer(initialState, {
  [GET_REPORTS_QUESTION_ANALYSIS_REQUEST]: (state, { payload }) => {
    state.loading = true;
  },
  [GET_REPORTS_QUESTION_ANALYSIS_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.questionAnalysis = get(payload.questionAnalysis, "data.result", {});
  },
  [GET_REPORTS_QUESTION_ANALYSIS_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  }
});

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsQuestionAnalysisRequest({ payload }) {
  try {
    const questionAnalysis = yield call(reportsApi.fetchQuestionAnalysisReport, payload);
    console.log("questionAnalysis", questionAnalysis);
    yield put({
      type: GET_REPORTS_QUESTION_ANALYSIS_REQUEST_SUCCESS,
      payload: { questionAnalysis }
    });
  } catch (error) {
    console.log("err", error.stack);
    let msg = "Failed to fetch question analysis Please try again...";
    yield call(message.error, msg);
    yield put({
      type: GET_REPORTS_QUESTION_ANALYSIS_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

export function* reportQuestionAnalysisSaga() {
  yield all([yield takeEvery(GET_REPORTS_QUESTION_ANALYSIS_REQUEST, getReportsQuestionAnalysisRequest)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
