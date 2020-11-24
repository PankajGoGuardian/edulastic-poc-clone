import { isEmpty } from 'lodash'
import { takeLatest, call, put, all } from 'redux-saga/effects'
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

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getPeerPerformanceRequestAction = createAction(
  GET_REPORTS_PEER_PERFORMANCE_REQUEST
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
  peerPerformance: defaultReport,
  loading: false,
}

export const reportPeerPerformanceReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
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
    payload.requestFilters.classIds =
      payload.requestFilters?.classIds?.join(',') ||
      payload.requestFilters?.classId ||
      ''
    payload.requestFilters.groupIds =
      payload.requestFilters?.groupIds?.join(',') ||
      payload.requestFilters?.groupId ||
      ''
    payload.requestFilters.assessmentTypes =
      payload.requestFilters?.assessmentTypes?.join(',') || ''

    payload.requestFilters.grade = payload.requestFilters.studentGrade
    payload.requestFilters.courseId = payload.requestFilters.studentCourseId
    payload.requestFilters.subject = payload.requestFilters.studentSubject

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

    yield put({
      type: GET_REPORTS_PEER_PERFORMANCE_REQUEST_SUCCESS,
      payload: { peerPerformance },
    })
  } catch (error) {
    console.log('err', error.stack)
    const msg = 'Failed to fetch sub-group performance. Please try again...'
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
