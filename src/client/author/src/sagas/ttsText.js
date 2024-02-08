import { testItemsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {
  setTTSTextStateAction,
  setTTSUpdateDataAction,
} from '../actions/ttsText'
import { FETCH_TTS_TEXT, UPDATE_TTS_TEXT } from '../constants/actions'

function* fetchTTSTextSaga({ payload }) {
  const failedMessage =
    'Apologies for the inconvenience. We encountered an issue while generating speakable text for this question. Please try again'

  try {
    yield put(setTTSTextStateAction({ apiStatus: 'INITIATED', result: [] }))
    const { result } = yield call(testItemsApi.getTTSText, payload)
    yield put(setTTSTextStateAction({ apiStatus: 'SUCCESS', result }))
  } catch (err) {
    yield put(setTTSTextStateAction({ apiStatus: 'FAILED', result: [] }))
    const errorMessage = failedMessage
    notification({ msg: errorMessage })
  }
}

function* updateTTSTextSaga({ payload }) {
  const failedMessage =
    'Apologies for the inconvenience. We encountered an issue while regenerating tts for this question. Please try again'

  try {
    yield put(
      setTTSUpdateDataAction({
        TTSUpdateData: {
          apiStatus: 'INITIATED',
        },
      })
    )
    yield call(testItemsApi.updateTTSText, payload)
    yield put(
      setTTSUpdateDataAction({
        TTSUpdateData: {
          apiStatus: 'SUCCESS',
        },
      })
    )
    yield put(setTTSTextStateAction({ apiStatus: false, result: [] }))
    notification({
      type: 'success',
      msg: `TTS regeneration is in progress. Please check after few minutes`,
    })
  } catch (err) {
    yield put(
      setTTSUpdateDataAction({
        TTSUpdateData: {
          apiStatus: 'FAILED',
        },
      })
    )
    const errorMessage = failedMessage
    notification({ msg: errorMessage })
  }
}

export default function* watcherSaga() {
  yield all([
    takeEvery(FETCH_TTS_TEXT, fetchTTSTextSaga),
    takeLatest(UPDATE_TTS_TEXT, updateTTSTextSaga),
  ])
}
