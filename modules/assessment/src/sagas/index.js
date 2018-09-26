import { all } from 'redux-saga/effects';

import answerSaga from './answer';

export default function* () {
  yield all([answerSaga()]);
}
