import {
  SET_AUDIO_RECORDING_STATE_DATA,
  SET_AUDIO_RECORDING_STATE,
  CLEAR_AUDIO_RECORDING_STATE,
  SET_AUDIO_UPLOAD_STATUS,
  SET_STOP_AUDIO_RECORDING_AND_UPLOAD_FOR_QID,
  AUDIO_RECORDING_AND_UPLOAD_COMPLETE_FOR_QID,
} from '../constants/actions'

export const setAudioRecordingStateDataAction = (payload) => ({
  type: SET_AUDIO_RECORDING_STATE_DATA,
  payload,
})

export const setAudioRecordingStateAction = (payload) => ({
  type: SET_AUDIO_RECORDING_STATE,
  payload,
})

export const clearAudioRecordingStateAction = (payload) => ({
  type: CLEAR_AUDIO_RECORDING_STATE,
  payload,
})

export const setAudioUploadStatusAction = (payload) => ({
  type: SET_AUDIO_UPLOAD_STATUS,
  payload,
})

export const setStopAudioRecordingAndUploadForQidAction = (payload) => ({
  type: SET_STOP_AUDIO_RECORDING_AND_UPLOAD_FOR_QID,
  payload,
})

export const audioRecordingAndUploadCompleteForQidAction = (payload) => ({
  type: AUDIO_RECORDING_AND_UPLOAD_COMPLETE_FOR_QID,
  payload,
})
