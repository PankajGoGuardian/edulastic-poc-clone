import React from 'react'
import PropTypes from 'prop-types'
import { EduIf } from '@edulastic/common'
import {
  RECORDING_ACTIVE,
  RECORDING_INACTIVE,
  RECORDING_COMPLETED,
  AUDIO_UPLOAD_ACTIVE,
} from '../constants'
import {
  StyledAudioRecorderWrapper,
  StyledText,
} from '../styledComponents/AudioRecorder'
import useUploadAudioFile from '../hooks/useUploadAudioFile'
import useAudioResponse from '../hooks/useAudioResponse'
import AudioRecorderContainer from './AudioRecorderContainer'
import AudioPlayerContainer from './AudioPlayerContainer'
import ErrorPopup from './ErrorPopup'

const AudioResponseContainer = ({
  i18translate,
  audioTimeLimitInMinutes,
  useS3AudioUrl,
  saveAnswer,
  userAnswer,
  hideAudioRecorder,
  userId,
  recordingState,
  audioUploadStatus,
  stopRecordingForQid,
  setRecordingState,
  setAudioUploadStatus,
  setStopAudioRecordingAndUploadForQid,
  recordingAndUploadCompleteForQid,
  questionId,
  itemId,
}) => {
  const {
    errorData,
    setErrorData,
    saveUserResponse,
    onClickRerecord,
    handleChangeRecordingState,
    handleChangeUploadStatus,
  } = useAudioResponse({
    userAnswer,
    saveAnswer,
    setRecordingState,
    setAudioUploadStatus,
    questionId,
    itemId,
  })

  const { uploadFile } = useUploadAudioFile({
    useS3AudioUrl,
    saveUserResponse,
    handleChangeRecordingState,
    handleChangeUploadStatus,
    recordingAndUploadCompleteForQid,
    setErrorData,
  })

  const onRecordingComplete = async ({ audioFile, audioUrl }) => {
    handleChangeRecordingState(RECORDING_COMPLETED)
    await uploadFile({ audioFile, objectAudioUrl: audioUrl })
  }

  const { isOpen = false, errorMessage = '' } = errorData

  return (
    <StyledAudioRecorderWrapper>
      <ErrorPopup
        isOpen={isOpen}
        errorMessage={errorMessage}
        setErrorData={setErrorData}
      />
      <EduIf
        condition={
          (recordingState === RECORDING_INACTIVE ||
            recordingState === RECORDING_ACTIVE) &&
          !hideAudioRecorder
        }
      >
        <AudioRecorderContainer
          i18translate={i18translate}
          audioTimeLimitInMinutes={audioTimeLimitInMinutes}
          recordingState={recordingState}
          onChangeRecordingState={handleChangeRecordingState}
          onRecordingComplete={onRecordingComplete}
          setErrorData={setErrorData}
          userId={userId}
          stopRecordingForQid={stopRecordingForQid}
          setStopAudioRecordingAndUploadForQid={
            setStopAudioRecordingAndUploadForQid
          }
          questionId={questionId}
        />
      </EduIf>
      <EduIf
        condition={recordingState === RECORDING_COMPLETED && userAnswer?.length}
      >
        <AudioPlayerContainer
          i18translate={i18translate}
          audioUrl={userAnswer}
          onClickRerecord={onClickRerecord}
          hideAudioRecorder={hideAudioRecorder}
          setErrorData={setErrorData}
        />
      </EduIf>
      <EduIf condition={audioUploadStatus === AUDIO_UPLOAD_ACTIVE}>
        <StyledText showLoader>
          {i18translate('component.audioResponse.uploading')}
        </StyledText>
      </EduIf>
      <EduIf condition={hideAudioRecorder && !userAnswer?.length}>
        <StyledText>
          {i18translate('component.audioResponse.NoAudioResponseFound')}
        </StyledText>
      </EduIf>
    </StyledAudioRecorderWrapper>
  )
}

AudioResponseContainer.propTypes = {
  i18translate: PropTypes.func.isRequired,
  audioTimeLimitInMinutes: PropTypes.number.isRequired,
  useS3AudioUrl: PropTypes.bool.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.string,
  hideAudioRecorder: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
  recordingState: PropTypes.string.isRequired,
  audioUploadStatus: PropTypes.string.isRequired,
  stopRecordingForQid: PropTypes.string.isRequired,
  setRecordingState: PropTypes.func.isRequired,
  setAudioUploadStatus: PropTypes.func.isRequired,
  setStopAudioRecordingAndUploadForQid: PropTypes.func.isRequired,
  recordingAndUploadCompleteForQid: PropTypes.func.isRequired,
  questionId: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
}

AudioResponseContainer.defaultProps = {
  userAnswer: '',
}

export default AudioResponseContainer
