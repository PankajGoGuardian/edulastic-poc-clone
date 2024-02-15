import { takeLatest, call, put, all } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'
import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const GET_REPORTS_PERFORMANCE_OVER_TIME_REQUEST =
  '[reports] get reports performance over time request'
const GET_REPORTS_PERFORMANCE_OVER_TIME_REQUEST_SUCCESS =
  '[reports] get reports performance over time success'
const GET_REPORTS_PERFORMANCE_OVER_TIME_REQUEST_ERROR =
  '[reports] get reports performance over time error'
const RESET_REPORTS_PERFORMANCE_OVER_TIME =
  '[reports] reset reports performance over time'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getPerformanceOverTimeRequestAction = createAction(
  GET_REPORTS_PERFORMANCE_OVER_TIME_REQUEST
)
export const resetPerformanceOverTimeAction = createAction(
  RESET_REPORTS_PERFORMANCE_OVER_TIME
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportPerformanceOverTimeReducer

export const getReportsPerformanceOverTime = createSelector(
  stateSelector,
  (state) => state.performanceOverTime
)

export const getReportsPerformanceOverTimeLoader = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getReportsPerformanceOverError = createSelector(
  stateSelector,
  (state) => state.error
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  performanceOverTime: {},
  loading: false,
}

export const reportPerformanceOverTimeReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: () => initialState,
  [RESET_REPORTS_PERFORMANCE_OVER_TIME]: () => initialState,
  [GET_REPORTS_PERFORMANCE_OVER_TIME_REQUEST]: (state) => {
    state.loading = true
  },
  [GET_REPORTS_PERFORMANCE_OVER_TIME_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.error = false
    state.performanceOverTime = payload.performanceOverTime
  },
  [GET_REPORTS_PERFORMANCE_OVER_TIME_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsPerformanceOverTimeRequest({ payload }) {
  try {
    const performanceOverTime = yield call(
      reportsApi.fetchPerformanceOverTimeReport,
      payload
    )
    const dataSizeExceeded =
      performanceOverTime?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put({
        type: GET_REPORTS_PERFORMANCE_OVER_TIME_REQUEST_ERROR,
        payload: { error: { ...performanceOverTime.data } },
      })
      return
    }
    yield put({
      type: GET_REPORTS_PERFORMANCE_OVER_TIME_REQUEST_SUCCESS,
      payload: { performanceOverTime },
    })
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Error getting performance over time report data. Please try again after a few minutes.'
    notification({ msg })
    yield put({
      type: GET_REPORTS_PERFORMANCE_OVER_TIME_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportPerformanceOverTimeSaga() {
  yield all([
    takeLatest(
      GET_REPORTS_PERFORMANCE_OVER_TIME_REQUEST,
      getReportsPerformanceOverTimeRequest
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
