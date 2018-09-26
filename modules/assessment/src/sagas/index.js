import { all } from 'redux-saga/effects';

import answerSaga from './answer';
import items from './items';

export default function* () {
  yield all([answerSaga(), items()]);
}
