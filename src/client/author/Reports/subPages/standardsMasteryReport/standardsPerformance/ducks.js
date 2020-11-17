import { takeLatest, call, put, all } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const GET_REPORTS_STANDARDS_PERFORMANCE_SUMMARY_REQUEST =
  '[reports] get reports standards performance summary request'
const GET_REPORTS_STANDARDS_PERFORMANCE_SUMMARY_REQUEST_SUCCESS =
  '[reports] get reports standards performance summary success'
const GET_REPORTS_STANDARDS_PERFORMANCE_SUMMARY_REQUEST_ERROR =
  '[reports] get reports standards performance summary error'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getStandardsPerformanceSummaryRequestAction = createAction(
  GET_REPORTS_STANDARDS_PERFORMANCE_SUMMARY_REQUEST
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportStandardsPerformanceSummaryReducer

export const getReportsStandardsPerformanceSummary = createSelector(
  stateSelector,
  (state) => state.standardsPerformanceSummary
)

export const getReportsStandardsPerformanceSummaryLoader = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getReportsStandardsPerformanceSummaryError = createSelector(
  stateSelector,
  (state) => state.error
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  standardsPerformanceSummary: {},
  loading: true,
}

export const reportStandardsPerformanceSummaryReducer = createReducer(
  initialState,
  {
    [RESET_ALL_REPORTS]: (state) => (state = initialState),
    [GET_REPORTS_STANDARDS_PERFORMANCE_SUMMARY_REQUEST]: (state) => {
      state.loading = true
    },
    [GET_REPORTS_STANDARDS_PERFORMANCE_SUMMARY_REQUEST_SUCCESS]: (
      state,
      { payload }
    ) => {
      state.loading = false
      state.error = false
      state.standardsPerformanceSummary = payload.standardsPerformanceSummary
    },
    [GET_REPORTS_STANDARDS_PERFORMANCE_SUMMARY_REQUEST_ERROR]: (
      state,
      { payload }
    ) => {
      state.loading = false
      state.error = payload.error
    },
  }
)

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsStandardsPerformanceSummaryRequest({ payload }) {
  try {
    const standardsPerformanceSummary = yield call(
      reportsApi.fetchStandardsPerformanceSummaryReport,
      payload
    )
    // const standardsPerformanceSummary = { data: tempData };
    const dataSizeExceeded =
      standardsPerformanceSummary?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put({
        type: GET_REPORTS_STANDARDS_PERFORMANCE_SUMMARY_REQUEST_ERROR,
        payload: { error: { ...standardsPerformanceSummary.data } },
      })
      return
    }
    yield put({
      type: GET_REPORTS_STANDARDS_PERFORMANCE_SUMMARY_REQUEST_SUCCESS,
      payload: { standardsPerformanceSummary },
    })
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Failed to fetch reports standards performance Please try again...'

    notification({ msg })
    yield put({
      type: GET_REPORTS_STANDARDS_PERFORMANCE_SUMMARY_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportStandardsPerformanceSummarySaga() {
  yield all([
    yield takeLatest(
      GET_REPORTS_STANDARDS_PERFORMANCE_SUMMARY_REQUEST,
      getReportsStandardsPerformanceSummaryRequest
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
