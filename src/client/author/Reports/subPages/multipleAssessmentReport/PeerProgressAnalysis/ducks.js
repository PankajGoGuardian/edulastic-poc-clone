import { takeEvery, call, put, all } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const GET_REPORTS_PEER_PROGRESS_ANALYSIS_REQUEST =
  '[reports] get reports peer progress analysis request'
const GET_REPORTS_PEER_PROGRESS_ANALYSIS_REQUEST_SUCCESS =
  '[reports] get reports peer progress analysis success'
const GET_REPORTS_PEER_PROGRESS_ANALYSIS_REQUEST_ERROR =
  '[reports] get reports peer progress analysis error'
const RESET_REPORTS_PEER_PROGRESS_ANALYSIS =
  '[reports] reset reports peer progress analysis'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getPeerProgressAnalysisRequestAction = createAction(
  GET_REPORTS_PEER_PROGRESS_ANALYSIS_REQUEST
)
export const resetPeerProgressAnalysisAction = createAction(
  RESET_REPORTS_PEER_PROGRESS_ANALYSIS
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportPeerProgressAnalysisReducer

export const getReportsPeerProgressAnalysis = createSelector(
  stateSelector,
  (state) => state.peerProgressAnalysis
)

export const getReportsPeerProgressAnalysisLoader = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getReportsPeerProgressAnalysisError = createSelector(
  stateSelector,
  (state) => state.error
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  peerProgressAnalysis: {},
  loading: false,
}

export const reportPeerProgressAnalysisReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: () => initialState,
  [RESET_REPORTS_PEER_PROGRESS_ANALYSIS]: () => initialState,
  [GET_REPORTS_PEER_PROGRESS_ANALYSIS_REQUEST]: (state) => {
    state.loading = true
  },
  [GET_REPORTS_PEER_PROGRESS_ANALYSIS_REQUEST_SUCCESS]: (
    state,
    { payload }
  ) => {
    state.loading = false
    state.error = false
    state.peerProgressAnalysis = payload.peerProgressAnalysis
  },
  [GET_REPORTS_PEER_PROGRESS_ANALYSIS_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsPeerProgressAnalysisRequest({ payload }) {
  try {
    const peerProgressAnalysis = yield call(
      reportsApi.fetchPeerProgressAnalysisReport,
      payload
    )
    const dataSizeExceeded =
      peerProgressAnalysis?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put({
        type: GET_REPORTS_PEER_PROGRESS_ANALYSIS_REQUEST_ERROR,
        payload: { error: { ...peerProgressAnalysis.data } },
      })
      return
    }
    yield put({
      type: GET_REPORTS_PEER_PROGRESS_ANALYSIS_REQUEST_SUCCESS,
      payload: { peerProgressAnalysis },
    })
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Error getting peer progress analysis report data. Please try again after a few minutes.'
    notification({ msg })
    yield put({
      type: GET_REPORTS_PEER_PROGRESS_ANALYSIS_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportPeerProgressAnalysisSaga() {
  yield all([
    yield takeEvery(
      GET_REPORTS_PEER_PROGRESS_ANALYSIS_REQUEST,
      getReportsPeerProgressAnalysisRequest
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
