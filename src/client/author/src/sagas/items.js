import { takeEvery, takeLatest, call, put, all } from 'redux-saga/effects';
import { itemsApi } from '@edulastic/api';
import { message } from 'antd';
import axios from '../../../utils/axiosInstance';

import {
  RECEIVE_ITEM_REQUEST,
  RECEIVE_ITEM_SUCCESS,
  RECEIVE_ITEM_ERROR,
  RECEIVE_ITEMS_SEARCH_REQUEST,
  RECEIVE_ITEMS_SEARCH_SUCCESS,
  RECEIVE_ITEMS_SEARCH_ERROR,
  CREATE_ITEM_REQUEST,
  UPDATE_ITEM_REQUEST,
} from '../constants/actions';

function* receiveItemsSaga({ payload: { page, limit, count, search } }) {
  try {
    const { data: items } = yield call(axios, {
      method: 'POST',
      url: '/api/search/fields',
      data: search
    });

    yield put({
      type: RECEIVE_ITEMS_SEARCH_SUCCESS,
      payload: { items, page, limit, count },
    });
  } catch (err) {
    console.error(err);
    const errorMessage = 'Receive items is failing';
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_ITEMS_SEARCH_ERROR,
      payload: { error: errorMessage },
    });
  }
}

function* receiveItemSaga({ payload }) {
  try {
    const item = yield call(itemsApi.receiveItemById, payload.id);

    yield put({
      type: RECEIVE_ITEM_SUCCESS,
      payload: { item },
    });
  } catch (err) {
    console.error(err);
    const errorMessage = 'Receive item by id is failing';
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_ITEM_ERROR,
      payload: { error: errorMessage },
    });
  }
}

function* createItemSaga({ payload }) {
  try {
    const item = yield call(itemsApi.createItem, payload);
    yield put({
      type: RECEIVE_ITEM_SUCCESS,
      payload: { item: item.data },
    });
  } catch (err) {
    console.error(err);
    const errorMessage = 'Create item is failed';
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_ITEM_ERROR,
      payload: { error: errorMessage },
    });
  }
}

function* updateItemSaga({ payload }) {
  console.log('update saga:', payload);
  try {
    const item = yield call(itemsApi.updateItemById, payload);
    yield put({
      type: RECEIVE_ITEM_SUCCESS,
      payload: { item: item.data },
    });
  } catch (err) {
    console.error(err);
    const errorMessage = 'Update item is failed';
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_ITEM_ERROR,
      payload: { error: errorMessage },
    });
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_ITEM_REQUEST, receiveItemSaga),
    yield takeLatest(RECEIVE_ITEMS_SEARCH_REQUEST, receiveItemsSaga),
    yield takeLatest(CREATE_ITEM_REQUEST, createItemSaga),
    yield takeLatest(UPDATE_ITEM_REQUEST, updateItemSaga),
  ]);
}
