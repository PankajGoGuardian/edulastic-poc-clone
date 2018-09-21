import { takeLatest, call } from 'redux-saga/effects';

import { addQuestion } from '../utils/api';
import { AUTHOR_QUESTION } from '../constants/actions';

export default function* watcherSaga() {
  yield takeLatest(AUTHOR_QUESTION, authorQuestion);
}

function* authorQuestion(action) {
  yield call(addQuestion, action.payload);
}
