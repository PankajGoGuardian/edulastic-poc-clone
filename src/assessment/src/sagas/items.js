import { takeEvery, call, put, all, select } from 'redux-saga/effects';
import { itemsApi } from '@edulastic/api';

import {
  RECEIVE_ITEM_REQUEST,
  RECEIVE_ITEM_SUCCESS,
  RECEIVE_ITEM_ERROR,
  RECEIVE_ITEMS_REQUEST,
  RECEIVE_ITEMS_SUCCESS,
  RECEIVE_ITEMS_ERROR,
  SAVE_USER_RESPONSE,
  LOAD_USER_RESPONSE,
  LOAD_ANSWERS
} from '../constants/actions';

function* receiveItemsSaga() {
  try {
    const items = yield call(itemsApi.receiveItems);

    yield put({
      type: RECEIVE_ITEMS_SUCCESS,
      payload: { items }
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: RECEIVE_ITEMS_ERROR,
      payload: { error: 'Receive items is failing' }
    });
  }
}

function* receiveItemSaga({ payload }) {
  try {
    const item = yield call(itemsApi.receiveItemById, payload.id);

    yield put({
      type: RECEIVE_ITEM_SUCCESS,
      payload: { item }
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: RECEIVE_ITEM_ERROR,
      payload: { error: 'Receive item by id is failing' }
    });
  }
}

// fetch all questionIds from item
const getQuestionIds = item => {
  let questions = [];
  item.rows.forEach(row => {
    questions = [...questions, ...row.widgets.map(widget => widget.reference)];
  });
  return questions;
};

function* saveUserResponse({ payload }) {
  try {
    let itemIndex = payload.itemId;
    let items = yield select(state => state.test && state.test.items);
    let answers = yield select(state => state.answers);
    let currentItem = items.length && items[itemIndex];
    let questions = getQuestionIds(currentItem);
    let itemAnswers = {};
    questions.forEach(question => {
      itemAnswers[question] = answers[question];
    });
    let testId = currentItem.id;
    const response = yield call(itemsApi.saveUserReponse, testId, itemAnswers);
  } catch (err) {
    console.log(err);
  }
}

function* loadUserResponse({ payload }) {
  try {
    let itemIndex = payload.itemId;
    let items = yield select(state => state.test && state.test.items);
    let item = items[itemIndex];
    let { answers } = yield call(itemsApi.getUserResponse, item.id);
    yield put({
      type: LOAD_ANSWERS,
      payload: {
        ...answers
      }
    });
  } catch (e) {
    console.log(e);
  }
}
export default function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_ITEM_REQUEST, receiveItemSaga),
    yield takeEvery(RECEIVE_ITEMS_REQUEST, receiveItemsSaga),
    yield takeEvery(SAVE_USER_RESPONSE, saveUserResponse),
    yield takeEvery(LOAD_USER_RESPONSE, loadUserResponse)
  ]);
}
