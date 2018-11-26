import { all } from 'redux-saga/effects';

import {
  questionSaga,
  answerSaga,
  testdashboardSaga,
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
    testdashboardSaga(),
    ...authorSagas,
    ...assessmentSagas
  ]);
}
