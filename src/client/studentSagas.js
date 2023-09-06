import { all } from 'redux-saga/effects'

import dictionariesSaga from './author/src/sagas/dictionaries'
import { watcherSaga as expressGraderWatcherSaga } from './author/ExpressGrader/ducks'
import {
  answerSaga,
  skillReportSaga,
  studentAssignmentsSaga,
  authenticationSaga,
  testActivityReportSaga,
  signupSaga,
  studentManageClassSaga,
  StudentPlaylistSaga,
  StudentSectionsSaga,
} from './student/sagas'
import assessmentSagas from './assessment/sagas'
import { reportSaga } from './author/Reports/ducks'

export function* studentsSagas() {
  yield all([
    answerSaga(),
    skillReportSaga(),
    studentAssignmentsSaga(),
    authenticationSaga(),
    testActivityReportSaga(),
    signupSaga(),
    studentManageClassSaga(),
    StudentPlaylistSaga(),
    StudentSectionsSaga(),
    dictionariesSaga(),
    expressGraderWatcherSaga(),
    ...assessmentSagas,
    reportSaga(),
  ])
}
