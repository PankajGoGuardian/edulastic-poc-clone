import { takeLatest, call, all, select, put } from 'redux-saga/effects'
import { testItemActivityApi, attchmentApi } from '@edulastic/api'
import * as Sentry from '@sentry/browser'
import { Effects } from '@edulastic/common'
import { getCurrentGroupWithAllClasses } from '../../student/Login/ducks'
import {
  SAVE_TEST_LEVEL_USER_WORK,
  SAVE_TESTLET_LOG,
  SAVE_TESTLET_LOG_SUCCESS,
  SAVE_TESTLET_LOG_FAILURE,
} from '../constants/actions'

function* saveTestletState() {
  try {
    const userTestActivityId = yield select(
      (state) => state.test && state.test.testActivityId
    )
    const _testUserWork = yield select(
      ({ testUserWork }) => testUserWork[userTestActivityId]
    )
    const groupId = yield select(getCurrentGroupWithAllClasses)
    if (_testUserWork && userTestActivityId) {
      yield call(testItemActivityApi.updateUserWorkTestLevel, {
        testActivityId: userTestActivityId,
        groupId,
        userWork: _testUserWork,
      })
    }
  } catch (error) {
    console.log(error)
    Sentry.captureException(error)
  }
}

function* saveTestletLog({ payload }) {
  try {
    const userTestActivityId = yield select(
      (state) => state.test && state.test.testActivityId
    )
    const userId = yield select((state) => state?.user?.user?._id)
    if (userTestActivityId) {
      const result = yield call(attchmentApi.saveAttachment, {
        type: 'TESTLETLOG',
        referrerType: 'TESTLET',
        referrerId: userTestActivityId,
        data: payload,
        userId,
        status: 'Attempted',
      })
      yield put({
        type: SAVE_TESTLET_LOG_SUCCESS,
        payload: result,
      })
    }
  } catch (error) {
    Sentry.captureException(error)
    yield put({
      type: SAVE_TESTLET_LOG_FAILURE,
      payload: error,
    })
  }
}

const timeOut =
  process.env.NODE_ENV === 'development'
    ? 12000
    : process.env.REACT_APP_QA_ENV
    ? 60000
    : 8000

export default function* watcherSaga() {
  yield all([
    yield takeLatest(SAVE_TEST_LEVEL_USER_WORK, saveTestletState),
    yield Effects.throttleAction(timeOut, SAVE_TESTLET_LOG, saveTestletLog),
  ])
}
