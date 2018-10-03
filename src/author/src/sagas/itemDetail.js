import { takeEvery, call, put, all } from 'redux-saga/effects';
import { testItemsApi } from '@edulastic/api';

import {
  RECEIVE_ITEM_DETAIL_REQUEST,
  RECEIVE_ITEM_DETAIL_SUCCESS,
  RECEIVE_ITEM_DETAIL_ERROR,
} from '../constants/actions';

function* receiveItemSaga({ payload }) {
  try {
    const item = yield call(testItemsApi.getById, payload.id);

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

export default function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_ITEM_DETAIL_REQUEST, receiveItemSaga)]);
}
