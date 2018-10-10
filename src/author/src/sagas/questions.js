import { takeEvery, call, put, all } from 'redux-saga/effects';
import { questionsApi } from '@edulastic/api';

import { history } from '../../../configureStore';

import {
  CREATE_QUESTION_REQUEST,
  CREATE_QUESTION_SUCCESS,
  CREATE_QUESTION_ERROR,
} from '../constants/actions';

function* createQuestionSaga({ payload }) {
  try {
    const question = yield call(questionsApi.create, payload);

    yield put({
      type: CREATE_QUESTION_SUCCESS,
      payload: { question },
    });

    yield call(history.push, {
      pathname: history.location.state.backUrl,
      state: {
        backText: 'Back to item list',
        backUrl: '/author/items',
        itemDetail: false,
      },
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: CREATE_QUESTION_ERROR,
      payload: { error: 'Create question is failing' },
    });
  }
}

export default function* watcherSaga() {
  yield all([yield takeEvery(CREATE_QUESTION_REQUEST, createQuestionSaga)]);
}
