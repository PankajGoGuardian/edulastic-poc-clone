import { takeLatest, put, call } from 'redux-saga/effects';

import { evaluateAnswer } from '../utils/api/questions';
import { ADD_EVALUATION, CHECK_ANSWER } from '../constants/actions';

function* addEvaluation(action) {
  try {
    const { answer, qid } = action.payload;
    const response = yield call(evaluateAnswer, qid, answer);
    yield put({
      type: ADD_EVALUATION,
      payload: {
        answer: response.answer,
        qid,
      },
    });
  } catch (e) {
    console.log('error: ', e);
  }
}

export default function* watcherSaga() {
  yield takeLatest(CHECK_ANSWER, addEvaluation);
}
