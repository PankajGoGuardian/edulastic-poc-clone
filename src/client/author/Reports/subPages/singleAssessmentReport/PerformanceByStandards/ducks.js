import { createAction, createReducer } from 'redux-starter-kit'
import { all, takeLatest, call, put } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { notification } from '@edulastic/common'
import { isEmpty } from 'lodash'

import { reportsApi } from '@edulastic/api'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const GET_PERFORMANCE_BY_STANDARDS_REQUEST =
  '[reports] get performance by standards request'
const GET_PERFORMANCE_BY_STANDARDS_SUCCESS =
  '[reports] get performance by standards success'
const GET_PERFORMANCE_BY_STANDARDS_ERROR =
  '[reports] get performance by standards error'
const RESET_PERFORMANCE_BY_STANDARDS =
  '[reports] reset performance by standards'

export const getPerformanceByStandardsAction = createAction(
  GET_PERFORMANCE_BY_STANDARDS_REQUEST
)
export const getPerformanceByStandardsSuccessAction = createAction(
  GET_PERFORMANCE_BY_STANDARDS_SUCCESS
)
export const getPerformanceByStandardsErrorAction = createAction(
  GET_PERFORMANCE_BY_STANDARDS_ERROR
)
export const resetPerformanceByStandardsAction = createAction(
  RESET_PERFORMANCE_BY_STANDARDS
)

export const defaultReport = {
  teacherInfo: [],
  scaleInfo: [],
  skillInfo: [],
  metricInfo: [],
  studInfo: [],
  standardsMap: {},
  performanceSummaryStats: [],
  defaultStandardId: 0,
}

const initialState = {
  performanceByStandards: {},
  loading: false,
  error: undefined,
}

export const reportPerformanceByStandardsReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
  [RESET_PERFORMANCE_BY_STANDARDS]: (state) => (state = initialState),
  [GET_PERFORMANCE_BY_STANDARDS_REQUEST]: (state) => {
    state.loading = true
  },
  [GET_PERFORMANCE_BY_STANDARDS_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.error = undefined
    const report = payload.report
    if (!payload.summaryStats) {
      const {
        performanceSummaryStats,
        skillInfo,
        scaleInfo,
        standardsMap,
        defaultStandardId,
      } = state.performanceByStandards
      Object.assign(report, { performanceSummaryStats })
      // by applying diferent compare by(ex: student groups)
      // we do not get result. to show only stats copy existing metadata.
      if (isEmpty(report.metricInfo)) {
        Object.assign(report, {
          skillInfo,
          standardsMap,
          scaleInfo,
          defaultStandardId,
        })
      }
    }
    state.performanceByStandards = report
  },
  [GET_PERFORMANCE_BY_STANDARDS_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
})

const stateSelector = (state) =>
  state.reportReducer.reportPerformanceByStandardsReducer

export const getPerformanceByStandardsLoadingSelector = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getPerformanceByStandardsErrorSelector = createSelector(
  stateSelector,
  (state) => state.error
)

export const getPerformanceByStandardsReportSelector = createSelector(
  stateSelector,
  (state) => state.performanceByStandards
)

function* getPerformanceByStandardsSaga({ payload }) {
  const errorMessage =
    'Error getting performance by standards. Please try again after a few minutes.'

  try {
    const { data } = yield call(reportsApi.fetchPerformanceByStandard, payload)
    if (data && data?.dataSizeExceeded) {
      yield put(getPerformanceByStandardsErrorAction({ error: { ...data } }))
      return
    }
    const { result } = data
    const report = isEmpty(result) ? { ...defaultReport } : result

    yield put(
      getPerformanceByStandardsSuccessAction({
        report,
        summaryStats: payload.requestFilters.summaryStats,
      })
    )
  } catch (error) {
    notification({ msg: errorMessage })
    yield put(getPerformanceByStandardsErrorAction({ error: errorMessage }))
  }
}

export function* performanceByStandardsSaga() {
  yield all([
    yield takeLatest(
      GET_PERFORMANCE_BY_STANDARDS_REQUEST,
      getPerformanceByStandardsSaga
    ),
  ])
}
