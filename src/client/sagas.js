import { all } from 'redux-saga/effects'

import {
  answerSaga,
  skillReportSaga,
  studentAssignmentsSaga,
  authenticationSaga,
  testActivityReportSaga,
  studentManageClassSaga,
  signupSaga,
  StudentPlaylistSaga,
  StudentSectionsSaga,
} from './student/sagas'
import authorSagas from './author/src/sagas'
import assessmentSagas from './assessment/sagas'
import { CurriculumSequenceSaga } from './author/CurriculumSequence'
import adminSagas from './admin/sagas'
import { saga as customReportSaga } from './admin/Components/CustomReportContainer/ducks'
import publisherSagas from './publisher/sagas'
import scanScoreSagas from './scanScore/ducks'
import { watcherSaga as resetPasswordSaga } from './SetParentPassword/ducks'
import { publicTestSaga } from './publicTest'
import dictionariesSaga from './author/src/sagas/dictionaries'
import { assignmentEmbedLinkSaga } from './assignmentEmbedLink'
import { ManageSubscriptionSaga } from './author/ManageSubscription'

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
    StudentPlaylistSaga(),
    StudentSectionsSaga(),
    resetPasswordSaga(),
    publicTestSaga(),
    assignmentEmbedLinkSaga(),
    ManageSubscriptionSaga(),
    scanScoreSagas(),
  ])
}

export function* loginSaga() {
  yield all([authenticationSaga(), signupSaga(), dictionariesSaga()])
}
