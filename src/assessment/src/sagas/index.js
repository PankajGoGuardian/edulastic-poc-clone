import { all } from 'redux-saga/effects';

import answerSaga from './answer';
import question from './question';
import items from './items';

export default function* () {
  yield all([answerSaga(), question(), items()]);
}
