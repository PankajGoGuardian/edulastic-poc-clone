import {
  SET_MEDIA_RECORDING_STORE_DATA,
  SET_MEDIA_RECORDING_STATE,
  CLEAR_MEDIA_RECORDING_STATE,
  SET_MEDIA_UPLOAD_STATUS,
  SET_STOP_AUDIO_RECORDING_AND_UPLOAD_FOR_QID,
  AUDIO_UPLOAD_COMPLETE_FOR_QID,
} from '../constants/actions'

export const setMediaRecordingStoreDataAction = (payload) => ({
  type: SET_MEDIA_RECORDING_STORE_DATA,
  payload,
})

export const setMediaRecordingStateAction = (payload) => ({
  type: SET_MEDIA_RECORDING_STATE,
  payload,
})

export const clearMediaRecordingStateAction = (payload) => ({
  type: CLEAR_MEDIA_RECORDING_STATE,
  payload,
})

export const setMediaUploadStatusAction = (payload) => ({
  type: SET_MEDIA_UPLOAD_STATUS,
  payload,
})

export const setStopAudioRecordingAndUploadForQidAction = (payload) => ({
  type: SET_STOP_AUDIO_RECORDING_AND_UPLOAD_FOR_QID,
  payload,
})

export const audioUploadCompleteForQidAction = (payload) => ({
  type: AUDIO_UPLOAD_COMPLETE_FOR_QID,
  payload,
})
