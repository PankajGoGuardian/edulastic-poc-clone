import { takeLatest, call, put, all } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const GET_REPORTS_ENGAGEMENT_SUMMARY_REQUEST =
  '[reports] get reports engagement summary request'
const GET_REPORTS_ENGAGEMENT_SUMMARY_REQUEST_SUCCESS =
  '[reports] get reports engagement summary success'
const GET_REPORTS_ENGAGEMENT_SUMMARY_REQUEST_ERROR =
  '[reports] get reports engagement summary error'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getEngagementSummaryRequestAction = createAction(
  GET_REPORTS_ENGAGEMENT_SUMMARY_REQUEST
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportEngagementSummaryReducer

export const getReportsEngagementSummary = createSelector(
  stateSelector,
  (state) => state.engagementSummary
)

export const getReportsEngagementSummaryLoader = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getReportsEngagementSummaryError = createSelector(
  stateSelector,
  (state) => state.error
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  engagementSummary: {},
  loading: true,
}

export const reportEngagementSummaryReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
  [GET_REPORTS_ENGAGEMENT_SUMMARY_REQUEST]: (state) => {
    state.loading = true
  },
  [GET_REPORTS_ENGAGEMENT_SUMMARY_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.error = false
    state.engagementSummary = payload.engagementSummary
  },
  [GET_REPORTS_ENGAGEMENT_SUMMARY_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsEngagementSummaryRequest({ payload }) {
  try {
    const engagementSummary = yield call(
      reportsApi.fetchEngagementSummary,
      payload
    )
    const dataSizeExceeded = engagementSummary?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put({
        type: GET_REPORTS_ENGAGEMENT_SUMMARY_REQUEST_ERROR,
        payload: { error: { ...engagementSummary.data } },
      })
      return
    }
    yield put({
      type: GET_REPORTS_ENGAGEMENT_SUMMARY_REQUEST_SUCCESS,
      payload: { engagementSummary },
    })
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Failed to fetch reports engagement summary. Please try again...'

    notification({ msg })
    yield put({
      type: GET_REPORTS_ENGAGEMENT_SUMMARY_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportEngagementSummarySaga() {
  yield all([
    yield takeLatest(
      GET_REPORTS_ENGAGEMENT_SUMMARY_REQUEST,
      getReportsEngagementSummaryRequest
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
