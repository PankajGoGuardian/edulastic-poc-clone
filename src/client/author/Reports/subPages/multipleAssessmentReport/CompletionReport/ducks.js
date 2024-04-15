import { createSlice } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { call, put, all, takeLatest } from 'redux-saga/effects'
import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { capitalize } from 'lodash'
import { downloadCSV } from '../../../common/util'

const initialState = {
  loadingCompletionReportChartData: false,
  loadingCompletionReportTableData: false,
  completionReportChartData: [],
  error: '',

  completionTableDataLoading: false,
  completionTableData: [],
  completionTableDataError: '',

  csvDownloadInfo: {},
}

const slice = createSlice({
  name: 'completionReport',
  initialState: { ...initialState },
  reducers: {
    fetchCompletionReportChartDataRequest: (state) => {
      state.loadingCompletionReportChartData = true
    },

    fetchCompletionChartDataSuccess: (state, { payload }) => {
      state.loadingCompletionReportChartData = false
      state.completionReportChartData = payload
      state.error = ''
    },
    fetchCompletionChartDataFailure: (state, { payload }) => {
      state.loadingCompletionReportChartData = false
      state.error = payload.error
    },

    fetchCompletionReportTableDataRequest: (state) => {
      state.completionTableDataLoading = true
    },

    fetchCompletionTableDataSuccess: (state, { payload }) => {
      state.completionTableDataLoading = false
      state.completionTableData = payload
      state.completionTableDataError = ''
    },
    fetchCompletionTableDataFailure: (state, { payload }) => {
      state.completionTableDataLoading = false
      state.completionTableDataError = payload.error
    },
    resetCompletionReportData: () => initialState,
    getCsvData: () => {},
    setCsvDataLoading: (state, { payload }) => {
      state.csvDownloadInfo[payload.identifier] = payload.loading
    },
    resetCsvDataLoading: (state) => {
      state.csvDownloadInfo = {}
    },
  },
})

export const { actions, reducer } = slice

function* fetchCompletionReportChartDataRequestSaga({ payload }) {
  try {
    const result = yield call(reportsApi.fetchCompletionReportChart, payload)
    const reportChartData = result.data.result.chartMetricInfo
    if (result.error) {
      yield put(
        actions.fetchCompletionChartDataFailure({
          error: { ...result.data },
        })
      )
      return
    }
    yield put(actions.fetchCompletionChartDataSuccess(reportChartData))
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Error fetching completion report data. Please try again after a few minutes.'
    notification({ type: 'error', msg })
    yield put(actions.fetchCompletionChartDataFailure({ error: msg }))
  }
}
function* fetchCompletionReportTableDataRequestSaga({ payload }) {
  try {
    const reportTableData = yield call(
      reportsApi.fetchCompletionReportTable,
      payload
    )
    const tableData = reportTableData.data.result.tableMetricInfo
    if (reportTableData.error) {
      yield put(
        actions.fetchCompletionChartDataFailure({
          error: { ...reportTableData.data },
        })
      )
      return
    }
    yield put(actions.fetchCompletionTableDataSuccess(tableData))
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Error fetching completion report data. Please try again after a few minutes.'
    notification({ msg })
    yield put(actions.fetchCompletionTableDataFailure({ error: msg }))
  }
}
function* getCsvDataSaga({ payload }) {
  const { progressName, testName, testId, index } = payload
  try {
    yield put(
      actions.setCsvDataLoading({
        identifier: `${testId}_${progressName}_${index}`,
        loading: true,
      })
    )
    if (testId !== 'overall_tid') {
      payload.testIds = testId
    }
    delete payload.testName
    delete payload.progressName
    delete payload.index
    const result = yield call(reportsApi.getCsvData, payload)
    downloadCSV(
      `${testName}_${capitalize(progressName)}.csv`,
      result?.data?.result || ''
    )
  } catch (error) {
    notification({ msg: 'Failed to download the data' })
  } finally {
    yield put(
      actions.resetCsvDataLoading({
        identifier: `${testId}_${progressName}_${index}`,
        loading: false,
      })
    )
    yield put(actions.resetCsvDataLoading)
  }
}

export function* watcherSaga() {
  yield all([
    takeLatest(
      actions.fetchCompletionReportChartDataRequest,
      fetchCompletionReportChartDataRequestSaga
    ),
    takeLatest(
      actions.fetchCompletionReportTableDataRequest,
      fetchCompletionReportTableDataRequestSaga
    ),
    takeLatest(actions.getCsvData, getCsvDataSaga),
  ])
}
const stateSelector = (state) =>
  state.reportReducer.reportCompletionReportReducers
export const getCompletionChartData = createSelector(
  stateSelector,
  (state) => state.completionReportChartData
)
export const getCompletionReportTableData = createSelector(
  stateSelector,
  (state) => state.completionTableData
)
export const getCompletionChartDataLoading = createSelector(
  stateSelector,
  (state) => state.loadingCompletionReportChartData
)
export const getCompletionReportTableDataLoading = createSelector(
  stateSelector,
  (state) => state.completionTableDataLoading
)
export const getCsvDownloadLoader = createSelector(
  stateSelector,
  (state) => state.csvDownloadInfo
)

export const getCompletionReportDataError = (state) => state.reportReducer.error
