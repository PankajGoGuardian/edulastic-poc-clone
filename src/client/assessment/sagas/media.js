import { takeLatest, put, all, select } from 'redux-saga/effects'
import { getItemIdQuestionIdKey } from '../utils/helpers'
import { RECORDING_ACTIVE } from '../widgets/AudioResponse/constants'
import { SET_MEDIA_RECORDING_STATE } from '../constants/actions'
import { getAudioRecordingByItemIdAndQidSelector } from '../selectors/media'
import {
  setStopAudioRecordingAndUploadForQidAction,
  setMediaRecordingStoreDataAction,
} from '../actions/media'

const getQuestionIdToStopRecording = ({
  audioRecordingState,
  recordingState,
  itemIdQidKey,
}) => {
  let stopRecordingForQid = null

  Object.keys(audioRecordingState).forEach((key) => {
    if (
      key !== itemIdQidKey &&
      recordingState === RECORDING_ACTIVE &&
      audioRecordingState[key]?.audioRecordingState === RECORDING_ACTIVE
    ) {
      stopRecordingForQid = key.split('_')[1]
    }
  })
  if (stopRecordingForQid) {
    return stopRecordingForQid
  }
  return false
}

function* setAudioRecordingStateSaga({ payload }) {
  const { questionId, itemId, recordingState } = payload
  const itemIdQidKey = getItemIdQuestionIdKey({ questionId, itemId })
  const audioRecordingState = yield select(
    getAudioRecordingByItemIdAndQidSelector
  ) || {}
  const stopRecordingForQid = getQuestionIdToStopRecording({
    audioRecordingState,
    recordingState,
    itemIdQidKey,
  })

  if (stopRecordingForQid) {
    yield put(
      setStopAudioRecordingAndUploadForQidAction({
        questionId: stopRecordingForQid,
      })
    )
  }

  yield put(setMediaRecordingStoreDataAction(payload))
}
export default function* watcherSaga() {
  yield all([
    yield takeLatest(SET_MEDIA_RECORDING_STATE, setAudioRecordingStateSaga),
  ])
}
