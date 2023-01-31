import { notification } from '@edulastic/common'
import { createSlice } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { call, put, all, takeLatest } from 'redux-saga/effects'
// import { get, pick } from 'lodash'

import { reportsApi } from '@edulastic/api'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'
import { validatePreAndPostTestIds } from './utils'

const initialState = {
  loadingReportSummaryData: false,
  loadingReportTableData: false,
  reportSummaryData: {},
  reportTableData: {},
  error: '',
}

// -----|-----|-----|-----| SLICE BEGIN |-----|-----|-----|----- //

const slice = createSlice({
  name: 'preVsPostReport',
  initialState: { ...initialState },
  reducers: {
    fetchReportSummaryDataRequest: (state) => {
      state.loadingReportSummaryData = true
    },
    fetchReporSummaryDataRequestSuccess: (state, { payload }) => {
      state.loadingReportSummaryData = false
      state.reportSummaryData = payload.reportSummaryData
      state.error = ''
    },
    fetchReportSummaryDataRequestError: (state, { payload }) => {
      state.loadingReportSummaryData = false
      state.error = payload.error
    },
    fetchPreVsPostReportTableDataRequest: (state) => {
      state.loadingReportTableData = true
    },
    fetchPreVsPostReportTableDataRequestSuccess: (state, { payload }) => {
      state.loadingReportTableData = false
      state.reportTableData = payload.reportTableData
      state.error = ''
    },
    fetchPreVsPostReportTableDataRequestError: (state, { payload }) => {
      state.loadingReportTableData = false
      state.error = payload.error
      state.reportTableData = {}
    },
    resetPreVsPostReport: () => ({ ...initialState }),
  },
  extraReducers: {
    [RESET_ALL_REPORTS]: () => ({ ...initialState }),
  },
})

export const { actions, reducer } = slice

// -----|-----|-----|-----| SLICE ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* fetchReportSummaryDataRequestSaga({ payload }) {
  try {
    const isValidTestIds = validatePreAndPostTestIds(payload)
    if (!isValidTestIds && !payload.reportId) {
      yield put(
        actions.fetchReportSummaryDataRequestError({
          error: { msg: 'InvalidTestIds' },
        })
      )
      return
    }
    const reportSummaryData = yield call(
      reportsApi.fetchPreVsPostReportSummaryData,
      payload
    )
    const dataSizeExceeded = reportSummaryData?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put(
        actions.fetchReportSummaryDataRequestError({
          error: { ...reportSummaryData.data },
        })
      )
      return
    }
    yield put(
      actions.fetchReporSummaryDataRequestSuccess({ reportSummaryData })
    )
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Error fetching Pre Vs Post Test Comparison report data. Please try again after a few minutes.'
    notification({ type: 'error', msg })
    yield put(actions.fetchReportSummaryDataRequestError({ error: msg }))
  }
}

function* fetchPreVsPostReportTableDataRequestSaga({ payload }) {
  try {
    const isValidTestIds = validatePreAndPostTestIds(payload)
    if (!isValidTestIds && !payload.reportId) {
      yield put(
        actions.fetchPreVsPostReportTableDataRequestError({
          error: { msg: 'InvalidTestIds' },
        })
      )
      return
    }
    const reportTableData = yield call(
      reportsApi.fetchPreVsPostReportTableData,
      payload
    )
    const dataSizeExceeded = reportTableData?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put(
        actions.fetchPreVsPostReportTableDataRequestError({
          error: { ...reportTableData.data },
        })
      )
      return
    }
    yield put(
      actions.fetchPreVsPostReportTableDataRequestSuccess({ reportTableData })
    )
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Error fetching Pre Vs Post Test Comparison report data. Please try again after a few minutes.'
    notification({ type: 'error', msg })
    yield put(actions.fetchPreVsPostReportTableDataRequestError({ error: msg }))
  }
}

export function* watcherSaga() {
  yield all([
    takeLatest(
      actions.fetchReportSummaryDataRequest,
      fetchReportSummaryDataRequestSaga
    ),
    takeLatest(
      actions.fetchPreVsPostReportTableDataRequest,
      fetchPreVsPostReportTableDataRequestSaga
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

const stateSelector = (state) => state.reportReducer.reportPreVsPostReducer

const loadingReportSummaryData = createSelector(
  stateSelector,
  (state) => state.loadingReportSummaryData
)
const loadingReportTableData = createSelector(
  stateSelector,
  (state) => state.loadingReportTableData
)
const reportSummaryData = createSelector(
  stateSelector,
  (state) => state.reportSummaryData
)
const reportTableData = createSelector(
  stateSelector,
  (state) => state.reportTableData
)
const error = createSelector(stateSelector, (state) => state.error)

export const selectors = {
  loadingReportSummaryData,
  loadingReportTableData,
  reportSummaryData,
  reportTableData,
  error,
}

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //
