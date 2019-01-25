import { takeEvery, call, put, all, select } from 'redux-saga/effects';
import { itemsApi, testItemActivityApi } from '@edulastic/api';

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
const getQuestionIds = (item) => {
  let questions = [];
  item.rows.forEach((row) => {
    questions = [
      ...questions,
      ...row.widgets.map(widget => widget.entity && widget.entity.id)
    ].filter(q => !!q);
  });

  return questions;
};

function* saveUserResponse({ payload }) {
  try {
    const itemIndex = payload.itemId;
    const items = yield select(state => state.test && state.test.items);
    const answers = yield select(state => state.answers);
    const userTestActivityId = yield select(
      state => state.test && state.test.testActivityId
    );
    const currentItem = items.length && items[itemIndex];
    const questions = getQuestionIds(currentItem);
    const itemAnswers = {};
    questions.forEach((question) => {
      itemAnswers[question] = answers[question];
    });
    const testItemId = currentItem._id;
    const assignmentId = yield select(state => state.studentAssignment && state.studentAssignment.current);
    yield call(testItemActivityApi.create, {
      answers: itemAnswers,
      testItemId,
      assignmentId,
      testActivityId: userTestActivityId
    });
  } catch (err) {
    console.log(err);
  }
}

function* loadUserResponse({ payload }) {
  try {
    const itemIndex = payload.itemId;
    const items = yield select(state => state.test && state.test.items);
    const item = items[itemIndex];
    const { answers } = yield call(itemsApi.getUserResponse, item._id);
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
