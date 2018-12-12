import { all } from 'redux-saga/effects';

import {
  questionSaga,
  answerSaga,
  assignmentSaga,
  reportSaga,
  authSaga
} from './student/src/sagas';
import authorSagas from './author/src/sagas';
import assessmentSagas from './assessment/src/sagas';

export default function* () {
  yield all([
    questionSaga(),
    answerSaga(),
    authSaga(),
    reportSaga(),
    assignmentSaga(),
    ...authorSagas,
    ...assessmentSagas
  ]);
}
