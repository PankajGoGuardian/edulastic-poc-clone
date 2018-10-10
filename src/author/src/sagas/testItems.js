import { takeEvery, call, put, all } from 'redux-saga/effects';
import { testItemsApi } from '@edulastic/api';

import {
  RECEIVE_TEST_ITEMS_REQUEST,
  RECEIVE_TEST_ITEMS_SUCCESS,
  RECEIVE_TEST_ITEMS_ERROR,
} from '../constants/actions';

function* receiveTestItemsSaga() {
  try {
    const items = yield call(testItemsApi.getAll);

    yield put({
      type: RECEIVE_TEST_ITEMS_SUCCESS,
      payload: { items },
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: RECEIVE_TEST_ITEMS_ERROR,
      payload: { error: 'Receive items is failing' },
    });
  }
}

export default function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_TEST_ITEMS_REQUEST, receiveTestItemsSaga)]);
}
