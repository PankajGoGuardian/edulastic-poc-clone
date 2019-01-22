import { all } from 'redux-saga/effects';

import {
  questionSaga,
  answerSaga,
  //assignmentSaga,
  //reportSaga,
  skillReportSaga,
  authSaga,
  studentAssignmentsSaga,
  //testActivityReportSaga
} from './student/sagas';
import authorSagas from './author/src/sagas';
import assessmentSagas from './assessment/src/sagas';

export default function*() {
  yield all([
    questionSaga(),
    answerSaga(),
    authSaga(),
   // reportSaga(),
    skillReportSaga(),
    //assignmentSaga(),
    //testActivityReportSaga(),
    studentAssignmentsSaga(),
    ...authorSagas,
    ...assessmentSagas
  ]);
}
