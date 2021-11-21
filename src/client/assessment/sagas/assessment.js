import { takeLatest, put, all } from 'redux-saga/effects'

import {
  START_ASSESSMENT,
  RESET_CURRENT_TEST_ITEM,
  REMOVE_ANSWERS,
} from '../constants/actions'
import { captureSentryException } from '@edulastic/common'

function* startAssessment() {
  try {
    yield put({
      type: RESET_CURRENT_TEST_ITEM,
    })
    yield put({
      type: REMOVE_ANSWERS,
    })
  } catch (e) {
    captureSentryException(e)
    console.log('error', e)
  }
}
export default function* watcherSaga() {
  yield all([yield takeLatest(START_ASSESSMENT, startAssessment)])
}
