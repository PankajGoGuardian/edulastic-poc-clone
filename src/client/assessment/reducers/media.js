import { createReducer } from 'redux-starter-kit'
import {
  SET_MEDIA_RECORDING_STORE_DATA,
  CLEAR_MEDIA_RECORDING_STATE,
  SET_STOP_AUDIO_RECORDING_AND_UPLOAD_FOR_QID,
  SET_MEDIA_UPLOAD_STATUS,
} from '../constants/actions'

const initialState = {
  recordingStateByItemIdAndQId: {},
  stopAudioRecordingAndUploadForQId: '',
}

const getUpdatedState = ({
  currentState,
  questionId,
  itemId,
  field,
  value,
}) => {
  return {
    ...currentState,
    recordingStateByItemIdAndQId: {
      ...currentState.recordingStateByItemIdAndQId,
      [`${itemId}_${questionId}`]: {
        ...(currentState.recordingStateByItemIdAndQId?.[
          `${itemId}_${questionId}`
        ] || {}),
        [field]: value,
      },
    },
  }
}

const reducer = createReducer(initialState, {
  [SET_MEDIA_RECORDING_STORE_DATA]: (state, { payload }) => {
    const { questionId, itemId, recordingState } = payload
    return getUpdatedState({
      currentState: state,
      questionId,
      itemId,
      field: 'audioRecordingState',
      value: recordingState,
    })
  },
  [SET_MEDIA_UPLOAD_STATUS]: (state, { payload }) => {
    const { questionId, itemId, audioUploadStatus } = payload
    return getUpdatedState({
      currentState: state,
      questionId,
      itemId,
      field: 'audioUploadStatus',
      value: audioUploadStatus,
    })
  },
  [SET_STOP_AUDIO_RECORDING_AND_UPLOAD_FOR_QID]: (state, { payload }) => {
    const { questionId } = payload
    state.stopAudioRecordingAndUploadForQId = questionId
  },
  [CLEAR_MEDIA_RECORDING_STATE]: () => initialState,
})

export default reducer
