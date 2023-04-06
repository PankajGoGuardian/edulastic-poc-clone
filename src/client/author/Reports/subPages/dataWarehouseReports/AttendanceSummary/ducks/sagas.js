import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { all, call, put, takeLatest } from 'redux-saga/effects'
import { actions } from './actionReducers'

function* fetchFiltersDataRequestSaga({ payload }) {
  try {
    const filtersData = yield call(reportsApi.fetchMARFilterData, {
      ...payload,
      attendanceBandInfo: true,
    })
    yield put(actions.fetchFiltersDataRequestSuccess({ filtersData }))
  } catch (error) {
    const msg =
      'Error getting filter data. Please try again after a few minutes.'
    notification({ msg })
    yield put(actions.fetchFiltersDataRequestError({ error: msg }))
  }
}

export default function* watcherSaga() {
  yield all([
    takeLatest(actions.fetchFiltersDataRequest, fetchFiltersDataRequestSaga),
  ])
}
