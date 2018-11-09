import { testsApi } from '@edulastic/api';
import { takeEvery, call, all, put } from 'redux-saga/effects';

import { LOAD_DASHBOARD_TEST, SET_STUDENT_TEST } from '../constants/actions';

function* loadDashboardtest() {
  try {
    const tests = yield call(testsApi.getAll);

    yield put({
      type: SET_STUDENT_TEST,
      payload: {
        tests,
      },
    });
  } catch (err) {
    console.error(err);
  }
}

export default function* watcherSaga() {
  yield all([yield takeEvery(LOAD_DASHBOARD_TEST, loadDashboardtest)]);
}
