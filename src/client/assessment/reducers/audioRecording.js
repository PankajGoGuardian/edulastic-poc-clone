import { createReducer } from 'redux-starter-kit'
import {
  SET_AUDIO_RECORDING_STATE_DATA,
  CLEAR_AUDIO_RECORDING_STATE,
  SET_STOP_AUDIO_RECORDING_AND_UPLOAD_FOR_QID,
  SET_AUDIO_UPLOAD_STATUS,
} from '../constants/actions'

const initialState = {
  recordingStateByItemIdAndQId: {},
  stopAudioRecordingAndUploadForQId: '',
}

const reducer = createReducer(initialState, {
  [SET_AUDIO_RECORDING_STATE_DATA]: (state, { payload }) => {
    const { questionId, itemId, recordingState } = payload
    return {
      ...state,
      recordingStateByItemIdAndQId: {
        ...state.recordingStateByItemIdAndQId,
        [`${itemId}_${questionId}`]: {
          ...(state.recordingStateByItemIdAndQId?.[`${itemId}_${questionId}`] ||
            {}),
          audioRecordingState: recordingState,
        },
      },
    }
  },
  [SET_AUDIO_UPLOAD_STATUS]: (state, { payload }) => {
    const { questionId, itemId, audioUploadStatus } = payload
    return {
      ...state,
      recordingStateByItemIdAndQId: {
        ...state.recordingStateByItemIdAndQId,
        [`${itemId}_${questionId}`]: {
          ...(state.recordingStateByItemIdAndQId?.[`${itemId}_${questionId}`] ||
            {}),
          audioUploadStatus,
        },
      },
    }
  },
  [SET_STOP_AUDIO_RECORDING_AND_UPLOAD_FOR_QID]: (state, { payload }) => {
    const { questionId } = payload
    state.stopAudioRecordingAndUploadForQId = questionId
  },
  [CLEAR_AUDIO_RECORDING_STATE]: () => initialState,
})

export default reducer
