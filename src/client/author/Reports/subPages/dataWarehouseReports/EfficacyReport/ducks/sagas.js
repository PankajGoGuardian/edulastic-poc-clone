import { notification } from '@edulastic/common'
import { reportsApi, dataWarehouseApi } from '@edulastic/api'
import { call, put, all, takeLatest, select } from 'redux-saga/effects'
import { actions } from './actionReducers'
import { selectors } from './selectors'
import { validatePreAndPostTestIds } from '../../../multipleAssessmentReport/PreVsPost/utils'

function* fetchFiltersDataRequestSaga({ payload }) {
  try {
    const filtersData = yield call(reportsApi.fetchMARFilterData, payload)
    yield put(actions.fetchFiltersDataRequestSuccess({ filtersData }))
  } catch (error) {
    const msg =
      'Error getting filter data. Please try again after a few minutes.'
    notification({ msg })
    yield put(actions.fetchFiltersDataRequestError({ error: msg }))
  }
}

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
    const reportSummaryDataResponse = yield call(
      dataWarehouseApi.getEfficacySummary,
      payload
    )
    const dataSizeExceeded =
      reportSummaryDataResponse?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put(
        actions.fetchReportSummaryDataRequestError({
          error: { ...reportSummaryDataResponse },
        })
      )
      return
    }
    yield put(
      actions.fetchReporSummaryDataRequestSuccess({
        reportSummaryData: reportSummaryDataResponse.result,
      })
    )
  } catch (error) {
    const msg = 'Error fetching Efficacy Report Summary data.'
    notification({ type: 'error', msg })
    yield put(actions.fetchReportSummaryDataRequestError({ error: msg }))
  }
}

function* fetchReportTableDataRequestSaga({ payload }) {
  try {
    const isValidTestIds = validatePreAndPostTestIds(payload)
    if (!isValidTestIds && !payload.reportId) {
      yield put(
        actions.fetchReportTableDataRequestError({
          error: { msg: 'InvalidTestIds' },
        })
      )
      return
    }
    const reportTableDataResponse = yield call(
      dataWarehouseApi.getEfficacyDetails,
      payload
    )
    const dataSizeExceeded = reportTableDataResponse?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put(
        actions.fetchReportTableDataRequestError({
          error: { ...reportTableDataResponse },
        })
      )
      return
    }
    const { result: reportTableData } = reportTableDataResponse
    // fetch rows count from former report table data
    if (!payload.requireTotalCount && reportTableData) {
      const { rowsCount } = yield select(selectors.reportTableData)
      Object.assign(reportTableData, { rowsCount })
    }
    yield put(actions.fetchReportTableDataRequestSuccess({ reportTableData }))
  } catch (error) {
    const msg = 'Error fetching Efficacy Report Table data.'
    notification({ type: 'error', msg })
    yield put(actions.fetchReportTableDataRequestError({ error: msg }))
  }
}

export function* watcherSaga() {
  yield all([
    takeLatest(actions.fetchFiltersDataRequest, fetchFiltersDataRequestSaga),
    takeLatest(
      actions.fetchReportSummaryDataRequest,
      fetchReportSummaryDataRequestSaga
    ),
    takeLatest(
      actions.fetchReportTableDataRequest,
      fetchReportTableDataRequestSaga
    ),
  ])
}
