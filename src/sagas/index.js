import { all } from 'redux-saga/effects';

import answerSaga from './answer';
import question from './question';

export default function*() {
  yield all([answerSaga(), question()]);
}
