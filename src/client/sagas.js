import { all } from 'redux-saga/effects';

import {
  answerSaga,
  skillReportSaga,
  studentAssignmentsSaga,
  authenticationSaga,
  testActivityReportSaga
} from './student/sagas';
import authorSagas from './author/src/sagas';
import assessmentSagas from './assessment/src/sagas';

export default function*() {
  yield all([
    answerSaga(),
    skillReportSaga(),
    studentAssignmentsSaga(),
    authenticationSaga(),
    testActivityReportSaga(),
    ...authorSagas,
    ...assessmentSagas
  ]);
}
