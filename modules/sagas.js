import { all } from 'redux-saga/effects';

import answerSaga from './author/src/sagas/answer';
import question from './author/src/sagas/question';
import items from './author/src/sagas/items';
import studentAnswerSaga from './student/src/sagas/answer';
import studentQuestion from './student/src/sagas/question';

export default function* () {
  yield all([answerSaga(), question(), items(), studentAnswerSaga(), studentQuestion()]);
}
