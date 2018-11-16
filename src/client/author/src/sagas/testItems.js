import { takeEvery, call, put, all } from 'redux-saga/effects';
import { testItemsApi } from '@edulastic/api';
import { message } from 'antd';

import {
  RECEIVE_TEST_ITEMS_REQUEST,
  RECEIVE_TEST_ITEMS_SUCCESS,
  RECEIVE_TEST_ITEMS_ERROR
} from '../constants/actions';

function* receiveTestItemsSaga({ payload }) {
  try {
    const items = yield call(testItemsApi.getAll, {
      data: true,
      validation: true
    });
    const { count } = yield call(testItemsApi.getCount);
    yield put({
      type: RECEIVE_TEST_ITEMS_SUCCESS,
      payload: {
        items,
        count,
        page: payload.page || 1,
        limit: payload.limit || 10
      }
    });
  } catch (err) {
    console.error(err);
    const errorMessage = 'Receive items is failing';
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_TEST_ITEMS_ERROR,
      payload: { error: errorMessage }
    });
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_TEST_ITEMS_REQUEST, receiveTestItemsSaga)
  ]);
}
