import { isEmpty } from 'lodash'
import { takeLatest, call, put, all, select } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { reportsApi } from '@edulastic/api'
import { createAction, createReducer } from 'redux-starter-kit'
import { notification } from '@edulastic/common'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const GET_REPORTS_PEER_PERFORMANCE_REQUEST =
  '[reports] get reports sub-groups performance request'
const GET_REPORTS_PEER_PERFORMANCE_REQUEST_SUCCESS =
  '[reports] get reports sub-groups performance success'
const GET_REPORTS_PEER_PERFORMANCE_REQUEST_ERROR =
  '[reports] get reports sub-groups performance error'
const RESET_REPORTS_PEER_PERFORMANCE =
  '[reports] reset reports sub-groups performance'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getPeerPerformanceRequestAction = createAction(
  GET_REPORTS_PEER_PERFORMANCE_REQUEST
)
export const resetPeerPerformanceAction = createAction(
  RESET_REPORTS_PEER_PERFORMANCE
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportPeerPerformanceReducer

export const getReportsPeerPerformance = createSelector(
  stateSelector,
  (state) => state.peerPerformance
)

export const getReportsPeerPerformanceLoader = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getReportsPeerPerformanceError = createSelector(
  stateSelector,
  (state) => state.error
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

export const defaultReport = {
  districtAvg: 0,
  districtAvgPerf: 0,
  metaInfo: [],
  metricInfo: [],
}

const initialState = {
  peerPerformance: {},
  loading: false,
}

export const reportPeerPerformanceReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
  [RESET_REPORTS_PEER_PERFORMANCE]: (state) => (state = initialState),
  [GET_REPORTS_PEER_PERFORMANCE_REQUEST]: (state) => {
    state.loading = true
  },
  [GET_REPORTS_PEER_PERFORMANCE_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.error = false
    state.peerPerformance = payload.peerPerformance
  },
  [GET_REPORTS_PEER_PERFORMANCE_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsPeerPerformanceRequest({ payload }) {
  try {
    const { data } = yield call(reportsApi.fetchPeerPerformanceReport, payload)

    if (data && data?.dataSizeExceeded) {
      yield put({
        type: GET_REPORTS_PEER_PERFORMANCE_REQUEST_ERROR,
        payload: { error: { ...data } },
      })
      return
    }
    const { result } = data

    const peerPerformance = isEmpty(result) ? defaultReport : result
    const oldPeerPerformance = yield select(getReportsPeerPerformance)
    if (
      !payload.requestFilters.recompute &&
      oldPeerPerformance.totalRows &&
      !peerPerformance.totalRows
    ) {
      peerPerformance.totalRows = oldPeerPerformance.totalRows
    }
    yield put({
      type: GET_REPORTS_PEER_PERFORMANCE_REQUEST_SUCCESS,
      payload: { peerPerformance },
    })
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Error getting sub-group performance report data. Please try again after a few minutes.'
    notification({ msg })
    yield put({
      type: GET_REPORTS_PEER_PERFORMANCE_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportPeerPerformanceSaga() {
  yield all([
    yield takeLatest(
      GET_REPORTS_PEER_PERFORMANCE_REQUEST,
      getReportsPeerPerformanceRequest
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
