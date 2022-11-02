import { createSelector } from 'reselect'
import { createSlice } from 'redux-starter-kit'
import { notification } from '@edulastic/common'
import { reportsApi } from '@edulastic/api'
import { call, put, all, takeLatest } from 'redux-saga/effects'

const initialState = {
  reportChartData: {},
  reportTableData: {},
  error: '',
  loadingReportChartData: false,
  loadingReportTableData: false,
}

// -----|-----|-----|-----| SLICE BEGIN |-----|-----|-----|----- //

const slice = createSlice({
  name: 'performanceByRubricsCriteriaReport',
  initialState: { ...initialState },
  reducers: {
    fetchReportChartDataRequest: (state) => {
      console.log('action called')
      state.loadingReportChartData = true
    },
    fetchReportChartDataRequestSuccess: (state, { payload }) => {
      state.loadingReportChartData = false
      state.reportChartData = payload.reportChartData
    },
    fetchReportChartDataRequestError: (state, { payload }) => {
      state.loadingReportChartData = false
      state.error = payload.error
    },
    fetchReportTableDataRequest: (state) => {
      state.loadingReportTableData = true
    },
    fetchReportTableDataRequestSuccess: (state, { payload }) => {
      state.loadingReportTableData = false
      state.reportTableData = payload.reportTableData
    },
    fetchReportTableDataRequestError: (state, { payload }) => {
      state.loadingReportTableData = false
      state.error = payload.error
    },
  },
})

export const { actions, reducer } = slice

// -----|-----|-----|-----| SLICE ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* fetchReportChartDataRequestSaga({ payload }) {
  try {
    const reportChartData = yield call(
      reportsApi.fetchPerformanceByRubricsCriteriaChartData,
      payload
    )
    console.log('reportchart data', reportChartData)
    yield put(actions.fetchReportChartDataRequestSuccess({ reportChartData }))
  } catch (error) {
    const msg =
      'Error getting report chart data. Please try again after a few minutes.'
    notification(msg)
    yield put(actions.fetchReportChartDataRequestError({ error: msg }))
  }
}

function* fetchReportTableDataRequestSaga({ payload }) {
  try {
    const reportTableData = yield call(
      reportsApi.fetchPerformanceByRubricsCriteriaTableData,
      payload
    )
    yield put(actions.fetchReportTableDataRequestSuccess({ reportTableData }))
  } catch (error) {
    const msg =
      'Error getting report table data. Please try again after a few minutes.'
    notification(msg)
    yield put(actions.fetchReportTableDataRequestError({ error: msg }))
  }
}

export function* watcherSaga() {
  yield all([
    takeLatest(
      actions.fetchReportChartDataRequest,
      fetchReportChartDataRequestSaga
    ),
    takeLatest(
      actions.fetchReportTableDataRequest,
      fetchReportTableDataRequestSaga
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

const stateSelector = (state) =>
  state.reportReducer.reportPerformanceByRubricsCriteriaReducer

const loadingReportChartData = createSelector(
  stateSelector,
  (state) => state.loadingReportChartData
)

const loadingReportTableData = createSelector(
  stateSelector,
  (state) => state.loadingReportTableData
)

const reportChartData = createSelector(
  stateSelector,
  (state) => state.reportChartData
)

const reportTableData = createSelector(
  stateSelector,
  (state) => state.reportTableData
)

export const selectors = {
  loadingReportChartData,
  loadingReportTableData,
  reportChartData,
  reportTableData,
}

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //
