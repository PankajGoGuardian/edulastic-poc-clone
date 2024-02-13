import { createSlice } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { call, put, all, takeLatest } from 'redux-saga/effects'
import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'

const initialState = {
  loadingCompletionReportChartData: false,
  loadingCompletionReportTableData: false,
  completionReportChartData: [],
  error: '',
  completionReportTableData: {},

  completionTableDataLoading: false,
  completionTableData: {},
  completionTableDataError: '',
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
    notification({ msg })
    yield put(actions.fetchCompletionChartDataFailure({ error: msg }))
  }
}
function* fetchCompletionReportTableDataRequestSaga({ payload }) {
  try {
    const reportTableData = yield call(
      reportsApi.fetchCompletionReportTable,
      payload
    )
    if (reportTableData.error) {
      yield put(
        actions.fetchCompletionChartDataFailure({
          error: { ...reportTableData.data },
        })
      )
      return
    }
    yield put(actions.fetchCompletionTableDataSuccess({ reportTableData }))
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Error fetching completion report data. Please try again after a few minutes.'
    notification({ msg })
    yield put(actions.fetchCompletionTableDataFailure({ error: msg }))
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
export const getCompletionReportDataError = (state) => state.reportReducer.error
