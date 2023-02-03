import { createSelector } from 'reselect'
import {
  getQuestionIdFromPropsSelector,
  getTestItemIdFromPropsSelector,
} from './answers'

const getAudioRecordingSelector = (state) => state.audioRecording

export const getAudioRecordingByItemIdAndQidSelector = createSelector(
  getAudioRecordingSelector,
  (state) => state.recordingStateByItemIdAndQId
)

export const getAudioRecordingStateSelector = createSelector(
  [
    getAudioRecordingByItemIdAndQidSelector,
    getTestItemIdFromPropsSelector,
    getQuestionIdFromPropsSelector,
  ],
  (recordingStateByItemIdAndQid, itemId, questionId) => {
    return recordingStateByItemIdAndQid?.[`${itemId}_${questionId}`]
      ?.audioRecordingState
  }
)

export const getAudioUploadStatusSelector = createSelector(
  [
    getAudioRecordingByItemIdAndQidSelector,
    getTestItemIdFromPropsSelector,
    getQuestionIdFromPropsSelector,
  ],
  (recordingStateByItemIdAndQid, itemId, questionId) => {
    return recordingStateByItemIdAndQid?.[`${itemId}_${questionId}`]
      ?.audioUploadStatus
  }
)

export const getStopAudioRecordingAndUploadForQidSelector = createSelector(
  getAudioRecordingSelector,
  (state) => state.stopAudioRecordingAndUploadForQId
)
