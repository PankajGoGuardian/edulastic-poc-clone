import { testItemsApi } from '@edulastic/api';
import { takeEvery, call, all, put } from 'redux-saga/effects';

import { LOAD_TEST, LOAD_TEST_ITEMS } from '../constants/actions';

function* loadTest() {
  try {
    let items = yield call(testItemsApi.getAll, {
      validation: true,
      data: true
    });

    yield put({
      type: LOAD_TEST_ITEMS,
      payload: {
        items
      }
    });
  } catch (err) {
    console.error(err);
  }
}

export default function* watcherSaga() {
  yield all([yield takeEvery(LOAD_TEST, loadTest)]);
}
