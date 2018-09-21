import { takeLatest, put, call } from 'redux-saga/effects';

import { evaluateAnswer } from '../utils/api';
import { ADD_EVALUATION, CHECK_ANSWER } from '../constants/actions';

export default function* watcherSaga() {
  yield takeLatest(CHECK_ANSWER, addEvaluation);
}

function* addEvaluation(action) {
  try {
    let { answer, qid } = action.payload;
    let response = yield call(evaluateAnswer, qid, answer);
    yield put({
      type: ADD_EVALUATION,
      payload: {
        answer: response.answer,
        qid
      }
    });
  } catch (e) {
    console.log('error: ', e);
  }
}
