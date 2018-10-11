import { takeEvery, call, put, all, select } from 'redux-saga/effects';
import { questionsApi } from '@edulastic/api';
import { NotificationManager } from 'react-notifications';

import {
  RECEIVE_QUESTION_REQUEST,
  RECEIVE_QUESTION_SUCCESS,
  RECEIVE_QUESTION_ERROR,
  SAVE_QUESTION_REQUEST,
  SAVE_QUESTION_SUCCESS,
  SAVE_QUESTION_ERROR,
} from '../constants/actions';
import { getQuestionSelector } from '../selectors/question';

function* receiveQuestionSaga({ payload }) {
  try {
    const entity = yield call(questionsApi.getById, payload.id);

    yield put({
      type: RECEIVE_QUESTION_SUCCESS,
      payload: { entity },
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: RECEIVE_QUESTION_ERROR,
      payload: { error: 'Receive question is failing' },
    });
  }
}

function* saveQuestionSaga() {
  try {
    const question = yield select(getQuestionSelector);
    const entity = yield call(questionsApi.updateById, question.id, question);

    yield put({
      type: SAVE_QUESTION_SUCCESS,
      payload: { entity },
    });
    NotificationManager.success('Update item by id is success', 'Success');
  } catch (err) {
    console.error(err);
    const errorMessage = 'Save question is failing';
    NotificationManager.error(errorMessage, 'Error');
    yield put({
      type: SAVE_QUESTION_ERROR,
      payload: { error: errorMessage },
    });
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_QUESTION_REQUEST, receiveQuestionSaga),
    yield takeEvery(SAVE_QUESTION_REQUEST, saveQuestionSaga),
  ]);
}
