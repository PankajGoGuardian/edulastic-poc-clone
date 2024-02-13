import moment from 'moment'
import { isEmpty } from 'lodash'
import { utilityApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { all, takeLatest, put, call, select } from 'redux-saga/effects'
import { actions } from './actionReducers'
import { tempCredentialsDataSelector } from './selectors'
import { IN_PROGRESS } from './constants'

function* generateTempCredentials() {
  try {
    console.log('generating credentials*************')
    yield put(actions.updateTempCredentialsAPIStatus(IN_PROGRESS))
    const generatedCredentials = yield select(tempCredentialsDataSelector)
    if (!isEmpty(generatedCredentials)) {
      const { expiration = 0 } = generatedCredentials
      const currentTime = Date.now()
      const differenceInMinutes = Math.floor((expiration - currentTime) / 60000)
      console.log('differenceInMinutes', differenceInMinutes)
      if (differenceInMinutes >= 3) {
        yield put(actions.updateTempCredentials(generatedCredentials))
        return
      }
    }

    const {
      AccessKeyId,
      SecretAccessKey,
      SessionToken,
      Expiration,
    } = yield call(utilityApi.generateTranscribeTempCredentials)
    const tempCredentials = {
      accessKeyId: AccessKeyId,
      secretAccessKey: SecretAccessKey,
      sessionToken: SessionToken,
      expiration: moment.utc(Expiration).valueOf(),
    }
    yield put(actions.updateTempCredentials(tempCredentials))
  } catch (error) {
    notification({
      type: 'error',
      msg: 'An error occured while starting transcribe.',
    })
    yield put(actions.failedToGeneratedCredentials())
  }
}

export default function* watcherSaga() {
  yield all([
    takeLatest(actions.generateTempCredentials, generateTempCredentials),
  ])
}
