import { notification } from '@edulastic/common'
import { reportsApi } from '@edulastic/api'
import { call, put, all, takeLatest } from 'redux-saga/effects'
import { validatePreAndPostTestIds } from '../utils'
import { actions } from './slice'

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
