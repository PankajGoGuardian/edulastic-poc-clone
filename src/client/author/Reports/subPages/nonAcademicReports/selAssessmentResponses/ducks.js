import { takeLatest, call, put, all } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { isEmpty } from 'lodash'
import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const GET_REPORTS_SEL_ASSESSMENT_RESPONSES_REQUEST =
  '[reports] get reports sel assessment responses request'
const GET_REPORTS_SEL_ASSESSMENT_RESPONSES_REQUEST_SUCCESS =
  '[reports] get reports sel assessment responses request success'
const GET_REPORTS_SEL_ASSESSMENT_RESPONSES_REQUEST_ERROR =
  '[reports] get reports sel assessment responses request error'
const RESET_REPORTS_SEL_ASSESSMENT_RESPONSES =
  '[reports] reset reports sel assessment responses'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getSELAssessmentResponsesRequestAction = createAction(
  GET_REPORTS_SEL_ASSESSMENT_RESPONSES_REQUEST
)
export const resetSELAssessmentResponsesAction = createAction(
  RESET_REPORTS_SEL_ASSESSMENT_RESPONSES
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportSELAssessmentResponsesReducer

export const getReportsSELAssessmentResponses = createSelector(
  stateSelector,
  (state) => state.SELResponses
)

export const getReportsSELAssessmentResponsesLoader = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getReportsSELAssessmentResponsesError = createSelector(
  stateSelector,
  (state) => state.error
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

export const defaultReport = {
  metricInfo: [],
}

const initialState = {
  SELResponses: {},
  loading: false,
}

export const reportSELAssessmentResponsesReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state, { payload }) => (state = initialState),
  [RESET_REPORTS_SEL_ASSESSMENT_RESPONSES]: (state, { payload }) =>
    (state = initialState),
  [GET_REPORTS_SEL_ASSESSMENT_RESPONSES_REQUEST]: (state, { payload }) => {
    state.loading = true
  },
  [GET_REPORTS_SEL_ASSESSMENT_RESPONSES_REQUEST_SUCCESS]: (
    state,
    { payload }
  ) => {
    state.loading = false
    state.error = false
    state.SELResponses = payload.SELResponses
  },
  [GET_REPORTS_SEL_ASSESSMENT_RESPONSES_REQUEST_ERROR]: (
    state,
    { payload }
  ) => {
    state.loading = false
    state.error = payload.error
  },
})

// -----|-----|-----|-----| REDUCER ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsSELAssessmentResponsesRequest({ payload }) {
  try {
    const { data } = yield call(reportsApi.fetchResponseFrequency, payload)

    if (data && data.dataSizeExceeded) {
      yield put({
        type: GET_REPORTS_SEL_ASSESSMENT_RESPONSES_REQUEST_ERROR,
        payload: { error: { ...data } },
      })
      return
    }
    const { result } = data

    const SELResponses = isEmpty(result) ? defaultReport : result

    yield put({
      type: GET_REPORTS_SEL_ASSESSMENT_RESPONSES_REQUEST_SUCCESS,
      payload: { SELResponses },
    })
  } catch (error) {
    const msg =
      'Error getting SEL Assessment Responses report data. Please try again after a few minutes.'
    notification({ type: 'error', msg })
    yield put({
      type: GET_REPORTS_SEL_ASSESSMENT_RESPONSES_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportSELAssessmentResponsesSaga() {
  yield all([
    takeLatest(
      GET_REPORTS_SEL_ASSESSMENT_RESPONSES_REQUEST,
      getReportsSELAssessmentResponsesRequest
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
