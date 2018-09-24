import { takeLatest, call } from 'redux-saga/effects';

import { addQuestion } from '../utils/api/assessment';
import { AUTHOR_QUESTION } from '../constants/actions';

function* authorQuestion(action) {
  yield call(addQuestion, action.payload);
}

export default function* watcherSaga() {
  yield takeLatest(AUTHOR_QUESTION, authorQuestion);
}
