import { all } from "redux-saga/effects";

import {
  answerSaga,
  skillReportSaga,
  studentAssignmentsSaga,
  authenticationSaga,
  testActivityReportSaga,
  signupSaga
} from "./student/sagas";
import authorSagas from "./author/src/sagas";
import assessmentSagas from "./assessment/sagas";
import { CurriculumSequenceSaga } from "./author/CurriculumSequence";
import { default as adminSagas } from "./admin/sagas";

export default function*() {
  yield all([
    answerSaga(),
    skillReportSaga(),
    studentAssignmentsSaga(),
    authenticationSaga(),
    testActivityReportSaga(),
    ...authorSagas,
    ...assessmentSagas,
    ...adminSagas,
    CurriculumSequenceSaga(),
    signupSaga()
  ]);
}
