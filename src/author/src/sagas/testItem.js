import { takeEvery, call, put, all } from 'redux-saga/effects';
import { testItemsApi } from '@edulastic/api';

import {
  CREATE_TEST_ITEM_REQUEST,
  CREATE_TEST_ITEM_ERROR,
  CREATE_TEST_ITEM_SUCCESS,
  UPDATE_TEST_ITEM_REQUEST,
  UPDATE_TEST_ITEM_SUCCESS,
  UPDATE_TEST_ITEM_ERROR,
} from '../constants/actions';
import { history } from '../../../configureStore';

function* createTestItemSaga({ payload }) {
  try {
    const item = yield call(testItemsApi.create, payload);
    yield put({
      type: CREATE_TEST_ITEM_SUCCESS,
      payload: { item: item.data },
    });
    yield call(history.push, `/author/items/${item.id}/item-detail`);
  } catch (err) {
    console.error(err);
    yield put({
      type: CREATE_TEST_ITEM_ERROR,
      payload: { error: 'Create item is failed' },
    });
  }
}

function* updateTestItemSaga({ payload }) {
  try {
    const item = yield call(testItemsApi.update, payload);
    yield put({
      type: UPDATE_TEST_ITEM_SUCCESS,
      payload: { item },
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UPDATE_TEST_ITEM_ERROR,
      payload: { error: 'Update item is failed' },
    });
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(CREATE_TEST_ITEM_REQUEST, createTestItemSaga),
    yield takeEvery(UPDATE_TEST_ITEM_REQUEST, updateTestItemSaga),
  ]);
}
