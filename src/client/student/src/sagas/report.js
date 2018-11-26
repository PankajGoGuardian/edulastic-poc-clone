import { reportsApi } from '@edulastic/api';
import { takeEvery, call, all, put } from 'redux-saga/effects';

import { FETCH_REPORTS, LOAD_REPORTS } from '../constants/actions';

function* fetchReports() {
  try {
    const reports = yield call(reportsApi.fetchReports);

    yield put({ type: LOAD_REPORTS, payload: { reports } });
  } catch (err) {
    console.error(err);
  }
}

export default function* watcherSaga() {
  yield all([yield takeEvery(FETCH_REPORTS, fetchReports)]);
}
