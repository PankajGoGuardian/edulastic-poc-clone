import { takeEvery, takeLatest, call, put, all } from 'redux-saga/effects';

import { receiveItemById, receiveItems, createItem, updateItemById } from '../utils/api/items';
import {
  RECEIVE_ITEM_REQUEST,
  RECEIVE_ITEM_SUCCESS,
  RECEIVE_ITEM_ERROR,
  RECEIVE_ITEMS_REQUEST,
  RECEIVE_ITEMS_SUCCESS,
  RECEIVE_ITEMS_ERROR,
  CREATE_ITEM_REQUEST,
  UPDATE_ITEM_REQUEST,
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

function* createItemSaga({ payload }) {
  try {
    const item = yield call(createItem, payload);
    yield put({
      type: RECEIVE_ITEM_SUCCESS,
      payload: { item: item.data },
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: RECEIVE_ITEM_ERROR,
      payload: { error: 'Create item is failed' },
    });
  }
}

function* updateItemSaga({ payload }) {
  console.log('update saga:', payload);
  try {
    const item = yield call(updateItemById, payload);
    yield put({
      type: RECEIVE_ITEM_SUCCESS,
      payload: { item: item.data },
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: RECEIVE_ITEM_ERROR,
      payload: { error: 'Update item is failed' },
    });
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_ITEM_REQUEST, receiveItemSaga),
    yield takeLatest(RECEIVE_ITEMS_REQUEST, receiveItemsSaga),
    yield takeLatest(CREATE_ITEM_REQUEST, createItemSaga),
    yield takeLatest(UPDATE_ITEM_REQUEST, updateItemSaga),
  ]);
}
