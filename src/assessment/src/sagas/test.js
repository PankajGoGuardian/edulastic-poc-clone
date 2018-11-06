import { testItemsApi, testsApi } from '@edulastic/api';
import { takeEvery, call, all, put } from 'redux-saga/effects';

import { LOAD_TEST, LOAD_TEST_ITEMS, SET_TEST_ID } from '../constants/actions';

function* loadTest({ payload }) {
  try {
    let items;
    // if all fetch all testItems else fetch only particular test
    if (!payload.test) {
      items = yield call(testItemsApi.getAll, {
        validation: true,
        data: true,
      });
    } else {
      yield put({
        type: SET_TEST_ID,
        payload: {
          testId: payload.testId,
        },
      });
      const result = yield call(testsApi.getById, payload.testId, {
        validation: true,
        data: true,
      });
      items = result.testItems;
    }

    yield put({
      type: LOAD_TEST_ITEMS,
      payload: {
        items,
      },
    });
  } catch (err) {
    console.error(err);
  }
}

export default function* watcherSaga() {
  yield all([yield takeEvery(LOAD_TEST, loadTest)]);
}
