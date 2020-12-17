import { isEmpty } from 'lodash'
import { takeLatest, call, put, all } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST =
  '[reports] get reports assessment summary request'
const GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST_SUCCESS =
  '[reports] get reports assessment summary success'
const GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST_ERROR =
  '[reports] get reports assessment summary error'
const SET_REPORTS_ASSESSMENT_SUMMARY_LOADING =
  '[reports] set reports assessment summary loading'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getAssessmentSummaryRequestAction = createAction(
  GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST
)

export const setReportsAssesmentSummaryLoadingAction = createAction(
  SET_REPORTS_ASSESSMENT_SUMMARY_LOADING
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportAssessmentSummaryReducer

export const getReportsAssessmentSummary = createSelector(
  stateSelector,
  (state) => state.assessmentSummary
)

export const getReportsAssessmentSummaryLoader = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getReportsAssessmentSummaryError = createSelector(
  stateSelector,
  (state) => state.error
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

export const defaultReport = {
  bandInfo: {},
  metricInfo: [],
}

const initialState = {
  assessmentSummary: defaultReport,
  loading: true,
}

export const reportAssessmentSummaryReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state, { payload }) => (state = initialState),
  [GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST]: (state, { payload }) => {
    state.loading = true
  },
  [GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.error = false
    state.assessmentSummary = payload.assessmentSummary
  },
  [GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [SET_REPORTS_ASSESSMENT_SUMMARY_LOADING]: (state, { payload }) => {
    state.loading = payload
  },
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsAssessmentSummaryRequest({ payload }) {
  try {
    const { data } = yield call(
      reportsApi.fetchAssessmentSummaryReport,
      payload
    )
    if (data && data?.dataSizeExceeded) {
      yield put({
        type: GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST_ERROR,
        payload: { error: { ...data } },
      })
      return
    }
    const { result } = data
    const assessmentSummary = isEmpty(result) ? defaultReport : result

    yield put({
      type: GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST_SUCCESS,
      payload: { assessmentSummary },
    })
  } catch (error) {
    console.log('err', error.stack)
    const msg = 'Failed to fetch assessment Summary Please try again...'
    notification({ msg })
    yield put({
      type: GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportAssessmentSummarySaga() {
  yield all([
    yield takeLatest(
      GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST,
      getReportsAssessmentSummaryRequest
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
