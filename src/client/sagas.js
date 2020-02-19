import { all } from "redux-saga/effects";

import {
  answerSaga,
  skillReportSaga,
  studentAssignmentsSaga,
  authenticationSaga,
  testActivityReportSaga,
  studentManageClassSaga,
  signupSaga,
  StudentPlaylistSaga
} from "./student/sagas";
import authorSagas from "./author/src/sagas";
import assessmentSagas from "./assessment/sagas";
import { CurriculumSequenceSaga } from "./author/CurriculumSequence";
import { default as adminSagas } from "./admin/sagas";
import { saga as customReportSaga } from "./admin/Components/CustomReportContainer/ducks";
import publisherSagas from "./publisher/sagas";

export default function* () {
  yield all([
    answerSaga(),
    skillReportSaga(),
    studentAssignmentsSaga(),
    studentManageClassSaga(),
    authenticationSaga(),
    testActivityReportSaga(),
    ...authorSagas,
    ...assessmentSagas,
    ...adminSagas,
    CurriculumSequenceSaga(),
    signupSaga(),
    ...publisherSagas,
    customReportSaga,
    StudentPlaylistSaga()
  ]);
}
