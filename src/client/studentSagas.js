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
} from './student/sagas'
import assessmentSagas from './assessment/sagas'
import { watcherSaga as curriculumSequenceSaga } from './author/CurriculumSequence/ducks'

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
    dictionariesSaga(),
    expressGraderWatcherSaga(),
    curriculumSequenceSaga(),
    ...assessmentSagas,
  ])
}
