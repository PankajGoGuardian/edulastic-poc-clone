import { all } from 'redux-saga/effects';

import {
  //questionSaga,
  answerSaga,
  // assignmentSaga,
  // reportSaga,
  skillReportSaga,
  studentAssignmentsSaga,
  // testActivityReportSaga,
  authenticationSaga
} from './student/sagas';
import authorSagas from './author/src/sagas';
import assessmentSagas from './assessment/src/sagas';

export default function*() {
  yield all([
  //questionSaga(),
    answerSaga(),
    // reportSaga(),
    skillReportSaga(),
    // assignmentSaga(),
    // testActivityReportSaga(),
    studentAssignmentsSaga(),
    authenticationSaga(),
    ...authorSagas,
    ...assessmentSagas
  ]);
}
