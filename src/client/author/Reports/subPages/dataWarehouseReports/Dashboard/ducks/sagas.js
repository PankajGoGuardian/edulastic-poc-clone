import { dataWarehouseApi, reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { actions } from './actionReducers'
import * as selectors from './selectors'

function* fetchFiltersDataRequestSaga({ payload }) {
  try {
    const filtersData = yield call(reportsApi.fetchMARFilterData, payload)
    yield put(actions.fetchFiltersDataRequestSuccess({ filtersData }))
  } catch (error) {
    const msg = 'Error getting filter data.'
    notification({ msg })
    yield put(actions.fetchFiltersDataRequestError({ error: msg }))
  }
}

function* fetchDashboardTableDataRequestSaga({ payload }) {
  try {
    const { academicTestType, districtAveragesRequired } = payload
    let districtAveragesData = yield select(selectors.districtAveragesData)
    if (districtAveragesRequired) {
      const reportDistrictAveragesResponse = yield call(
        dataWarehouseApi.getDashboardDistrictAverages,
        payload
      )
      districtAveragesData = reportDistrictAveragesResponse.data.result
    }
    const districtAvgScore =
      districtAveragesData.metricInfo?.[academicTestType]?.avgScore || 0
    const reportTableDataResponse = yield call(
      dataWarehouseApi.getDashboardTableMetrics,
      { ...payload, districtAvgScore }
    )
    const dataSizeExceeded =
      reportTableDataResponse.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put(
        actions.fetchDashboardTableDataRequestError({
          error: { ...reportTableDataResponse.data },
        })
      )
      return
    }
    yield put(
      actions.fetchDashboardTableDataRequestSuccess({
        districtAveragesData,
        tableData: reportTableDataResponse.data.result,
      })
    )
  } catch (error) {
    const msg = 'Error fetching Dashboard table data.'
    notification({ type: 'error', msg })
    yield put(actions.fetchDashboardTableDataRequestError({ error }))
  }
}

export default function* watcherSaga() {
  yield all([
    takeLatest(actions.fetchFiltersDataRequest, fetchFiltersDataRequestSaga),
    takeLatest(
      actions.fetchDashboardTableDataRequest,
      fetchDashboardTableDataRequestSaga
    ),
  ])
}
