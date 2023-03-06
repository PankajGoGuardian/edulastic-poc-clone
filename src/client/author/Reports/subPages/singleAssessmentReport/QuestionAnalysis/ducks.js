import { takeLatest, call, put, all } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const GET_REPORTS_QUESTION_ANALYSIS_REQUEST =
  '[reports] get reports question analysis request'
const GET_REPORTS_QUESTION_ANALYSIS_REQUEST_SUCCESS =
  '[reports] get reports question analysis success'
const GET_REPORTS_QUESTION_ANALYSIS_REQUEST_ERROR =
  '[reports] get reports question analysis error'
const RESET_REPORTS_QUESTION_ANALYSIS =
  '[reports] reset reports question analysis'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getQuestionAnalysisRequestAction = createAction(
  GET_REPORTS_QUESTION_ANALYSIS_REQUEST
)
export const resetQuestionAnalysisAction = createAction(
  RESET_REPORTS_QUESTION_ANALYSIS
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportQuestionAnalysisReducer

export const getReportsQuestionAnalysis = createSelector(
  stateSelector,
  (state) => state.questionAnalysis
)

export const getReportsQuestionAnalysisLoader = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getReportsQuestionAnalysisError = createSelector(
  stateSelector,
  (state) => state.error
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

export const defaultReport = {
  qSummary: [],
  performanceByDimension: {},
}

const initialState = {
  questionAnalysis: {},
  loading: false,
}

export const reportQuestionAnalysisReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state) => {
    state.questionAnalysis = {}
    state.loading = false
  },
  [RESET_REPORTS_QUESTION_ANALYSIS]: (state) => {
    state.questionAnalysis = {}
    state.loading = false
  },
  [GET_REPORTS_QUESTION_ANALYSIS_REQUEST]: (state) => {
    state.loading = true
  },
  [GET_REPORTS_QUESTION_ANALYSIS_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.error = false
    state.questionAnalysis = payload.questionAnalysis
  },
  [GET_REPORTS_QUESTION_ANALYSIS_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsQuestionAnalysisRequest({ payload }) {
  try {
    const [qSummary, performanceByDimension] = yield all([
      call(reportsApi.fetchQuestionAnalysisSummaryReport, payload),
      call(reportsApi.fetchQuestionAnalysisPerformanceReport, payload),
    ])

    if (qSummary && qSummary?.dataSizeExceeded) {
      yield put({
        type: GET_REPORTS_QUESTION_ANALYSIS_REQUEST_ERROR,
        payload: { error: { ...qSummary } },
      })
      return
    }

    const questionAnalysis = {
      qSummary,
      performanceByDimension,
    }

    yield put({
      type: GET_REPORTS_QUESTION_ANALYSIS_REQUEST_SUCCESS,
      payload: { questionAnalysis },
    })
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Error getting question analysis report data. Please try again after a few minutes.'
    notification({ msg })
    yield put({
      type: GET_REPORTS_QUESTION_ANALYSIS_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportQuestionAnalysisSaga() {
  yield all([
    yield takeLatest(
      GET_REPORTS_QUESTION_ANALYSIS_REQUEST,
      getReportsQuestionAnalysisRequest
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
