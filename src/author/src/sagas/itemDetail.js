import { takeEvery, call, put, all } from 'redux-saga/effects';
import { testItemsApi } from '@edulastic/api';
import { NotificationManager } from 'react-notifications';

import {
  RECEIVE_ITEM_DETAIL_REQUEST,
  RECEIVE_ITEM_DETAIL_SUCCESS,
  RECEIVE_ITEM_DETAIL_ERROR,
  UPDATE_ITEM_DETAIL_REQUEST,
  UPDATE_ITEM_DETAIL_SUCCESS,
  UPDATE_ITEM_DETAIL_ERROR,
} from '../constants/actions';

function* receiveItemSaga({ payload }) {
  try {
    const item = yield call(testItemsApi.getById, payload.id, payload.params);

    yield put({
      type: RECEIVE_ITEM_DETAIL_SUCCESS,
      payload: { item },
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: RECEIVE_ITEM_DETAIL_ERROR,
      payload: { error: 'Receive item by id is failing' },
    });
  }
}

function* updateItemSaga({ payload }) {
  try {
    const item = yield call(testItemsApi.updateById, payload.id, payload.data);
    console.log(item);

    yield put({
      type: UPDATE_ITEM_DETAIL_SUCCESS,
      payload: { item },
    });
    NotificationManager.success('Update item by id is success', 'Success');
  } catch (err) {
    console.error(err);
    yield put({
      type: UPDATE_ITEM_DETAIL_ERROR,
      payload: { error: 'Update item by id is failing' },
    });
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_ITEM_DETAIL_REQUEST, receiveItemSaga),
    yield takeEvery(UPDATE_ITEM_DETAIL_REQUEST, updateItemSaga),
  ]);
}
