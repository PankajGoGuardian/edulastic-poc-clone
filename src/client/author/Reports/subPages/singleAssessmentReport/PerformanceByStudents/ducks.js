import { isEmpty } from 'lodash'
import { takeLatest, call, put, all } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const GET_REPORTS_PERFORMANCE_BY_STUDENTS_REQUEST =
  '[reports] get reports performance by students request'
const GET_REPORTS_PERFORMANCE_BY_STUDENTS_REQUEST_SUCCESS =
  '[reports] get reports performance by students success'
const GET_REPORTS_PERFORMANCE_BY_STUDENTS_REQUEST_ERROR =
  '[reports] get reports performance by students error'
const RESET_REPORTS_PERFORMANCE_BY_STUDENTS =
  '[reports] reset reports performance by students'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getPerformanceByStudentsRequestAction = createAction(
  GET_REPORTS_PERFORMANCE_BY_STUDENTS_REQUEST
)
export const resetPerformanceByStudentsAction = createAction(
  RESET_REPORTS_PERFORMANCE_BY_STUDENTS
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportPerformanceByStudentsReducer

export const getReportsPerformanceByStudents = createSelector(
  stateSelector,
  (state) => state.performanceByStudents
)

export const getReportsPerformanceByStudentsLoader = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getReportsPerformanceByStudentsError = createSelector(
  stateSelector,
  (state) => state.error
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

export const defaultReport = {
  districtAvg: 0,
  districtAvgPerf: 0,
  schoolMetricInfo: [],
  studentMetricInfo: [],
  metaInfo: [],
  metricInfo: [],
}

const initialState = {
  performanceByStudents: {},
  loading: false,
}

export const reportPerformanceByStudentsReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
  [RESET_REPORTS_PERFORMANCE_BY_STUDENTS]: (state) => (state = initialState),
  [GET_REPORTS_PERFORMANCE_BY_STUDENTS_REQUEST]: (state) => {
    state.loading = true
  },
  [GET_REPORTS_PERFORMANCE_BY_STUDENTS_REQUEST_SUCCESS]: (
    state,
    { payload }
  ) => {
    state.loading = false
    state.error = false
    state.performanceByStudents = payload.performanceByStudents
  },
  [GET_REPORTS_PERFORMANCE_BY_STUDENTS_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsPerformanceByStudentsRequest({ payload }) {
  try {
    const { data } = yield call(
      reportsApi.fetchPerformanceByStudentsReport,
      payload
    )
    if (data && data?.dataSizeExceeded) {
      yield put({
        type: GET_REPORTS_PERFORMANCE_BY_STUDENTS_REQUEST_ERROR,
        payload: { error: { ...data } },
      })
      return
    }
    const { result } = data
    const performanceByStudents = isEmpty(result) ? defaultReport : result

    yield put({
      type: GET_REPORTS_PERFORMANCE_BY_STUDENTS_REQUEST_SUCCESS,
      payload: { performanceByStudents },
    })
  } catch (error) {
    console.log('err', error.stack)
    const msg = 'Failed to fetch performance by students Please try again...'

    notification({ msg })
    yield put({
      type: GET_REPORTS_PERFORMANCE_BY_STUDENTS_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportPerformanceByStudentsSaga() {
  yield all([
    yield takeLatest(
      GET_REPORTS_PERFORMANCE_BY_STUDENTS_REQUEST,
      getReportsPerformanceByStudentsRequest
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
