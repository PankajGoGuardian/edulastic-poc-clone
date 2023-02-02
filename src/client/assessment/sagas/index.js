import questionSaga from './question'
import itemsSaga from './items'
import testSaga from './test'
import evaluationSaga from './evaluation'
import viewSaga from './view'
import assessmentSaga from './assessment'
import testUserWorkSaga from './testUserWork'
import { previewTestsSaga } from '../sharedDucks/previewTest'
import { customKeypadSaga } from '../components/KeyPadOptions/ducks'
import audioRecordingSaga from './audioRecording'

const assessmentSagas = [
  questionSaga(),
  itemsSaga(),
  testSaga(),
  evaluationSaga(),
  viewSaga(),
  assessmentSaga(),
  testUserWorkSaga(),
  previewTestsSaga(),
  customKeypadSaga(),
  audioRecordingSaga(),
]

export default assessmentSagas
