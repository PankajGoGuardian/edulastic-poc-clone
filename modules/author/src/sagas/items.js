import { takeEvery, takeLatest, call, put, all } from 'redux-saga/effects';

import { receiveItemById, receiveItems } from '../utils/api/items';
import {
  RECEIVE_ITEM_REQUEST,
  RECEIVE_ITEM_SUCCESS,
  RECEIVE_ITEM_ERROR,
  RECEIVE_ITEMS_REQUEST,
  RECEIVE_ITEMS_SUCCESS,
  RECEIVE_ITEMS_ERROR,
} from '../constants/actions';

function* receiveItemsSaga({ payload }) {
  try {
    const { items, page, count } = yield call(receiveItems, payload);

    yield put({
      type: RECEIVE_ITEMS_SUCCESS,
      payload: { items, page, limit: payload.limit, count },
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: RECEIVE_ITEMS_ERROR,
      payload: { error: 'Receive items is failing' },
    });
  }
}

function* receiveItemSaga({ payload }) {
  try {
    const item = yield call(receiveItemById, payload.id);

    yield put({
      type: RECEIVE_ITEM_SUCCESS,
      payload: { item },
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: RECEIVE_ITEM_ERROR,
      payload: { error: 'Receive item by id is failing' },
    });
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_ITEM_REQUEST, receiveItemSaga),
    yield takeLatest(RECEIVE_ITEMS_REQUEST, receiveItemsSaga),
  ]);
}
