import { takeLatest, put, all, select } from 'redux-saga/effects'
import { getItemIdQuestionIdKey } from '../utils/helpers'
import { RECORDING_ACTIVE } from '../widgets/AudioResponse/constants'
import { SET_AUDIO_RECORDING_STATE } from '../constants/actions'
import { getAudioRecordingByItemIdAndQidSelector } from '../selectors/audioRecording'
import {
  setStopAudioRecordingAndUploadForQidAction,
  setAudioRecordingStateDataAction,
} from '../actions/audioRecording'

function* setAudioRecordingStateSaga({ payload }) {
  const { questionId, itemId, recordingState } = payload
  const itemIdQidKey = getItemIdQuestionIdKey({ questionId, itemId })
  const audioRecordingState = yield select(
    getAudioRecordingByItemIdAndQidSelector
  ) || {}
  let stopRecordingForQid = ''

  Object.keys(audioRecordingState).forEach((key) => {
    if (
      key !== itemIdQidKey &&
      recordingState === RECORDING_ACTIVE &&
      audioRecordingState[key]?.audioRecordingState === RECORDING_ACTIVE
    ) {
      stopRecordingForQid = key.split('_')[1]
    }
  })

  if (stopRecordingForQid.length) {
    yield put(
      setStopAudioRecordingAndUploadForQidAction({
        questionId: stopRecordingForQid,
      })
    )
  }

  yield put(setAudioRecordingStateDataAction(payload))
}
export default function* watcherSaga() {
  yield all([
    yield takeLatest(SET_AUDIO_RECORDING_STATE, setAudioRecordingStateSaga),
  ])
}
