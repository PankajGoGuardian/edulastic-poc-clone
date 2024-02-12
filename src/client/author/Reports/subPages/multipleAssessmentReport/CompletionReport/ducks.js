import { createSlice } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { call, put, all, takeLatest } from 'redux-saga/effects'
import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'

const initialState = {
  loadingCompletionReportChartData: false,
  loadingCompletionReportTableData: false,
  completionReportChartData: {},
  error: '',
  completionReportTableData: {},
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
      state.loadingCompletionReportChartData = true
    },

    fetchCompletionTableDataSuccess: (state, { payload }) => {
      state.loadingCompletionReportTableData = false
      state.completionTableData = payload
      state.error = ''
    },
    fetchCompletionTableDataFailure: (state, { payload }) => {
      state.loadingCompletionReportTableData = false
      state.error = payload.error
    },
  },
})

export const { actions, reducer } = slice

function* fetchCompletionReportChartDataRequestSaga({ payload }) {
  try {
    const reportChartData = yield call(
      reportsApi.fetchCompletionReportChart,
      payload
    )
    if (reportChartData.error) {
      yield put(
        actions.fetchCompletionChartDataFailure({
          error: { ...reportChartData.data },
        })
      )
      return
    }
    yield put(actions.fetchCompletionChartDataSuccess({ reportChartData }))
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
const stateSelector = (state) => state.reportReducer.completionReportData
const completionReportChartData = createSelector(
  stateSelector,
  (state) => state.completionReportChartData
)
const completionReportTableData = createSelector(
  stateSelector,
  (state) => state.completionReportTableData
)
const completionReportChartDataLoading = createSelector(
  stateSelector,
  (state) => state.loadingCompletionReportChartData
)
const completionReportTableDataLoading = createSelector(
  stateSelector,
  (state) => state.loadingCompletionReportTableData
)
const completionReportDataError = (state) => state.reportReducer.error
export const selectors = {
  completionReportChartData,
  completionReportTableData,
  completionReportDataError,
  completionReportChartDataLoading,
  completionReportTableDataLoading,
}
