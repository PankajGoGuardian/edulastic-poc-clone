import React from 'react'
import PropTypes from 'prop-types'
import { EduIf } from '@edulastic/common'
import {
  RECORDING_ACTIVE,
  RECORDING_INACTIVE,
  RECORDING_COMPLETED,
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
}) => {
  const {
    recordingState,
    errorData,
    setErrorData,
    saveUserResponse,
    setRecordingState,
    onClickRerecord,
  } = useAudioResponse({
    userAnswer,
    saveAnswer,
  })

  const { isUploadingAudio, uploadFile } = useUploadAudioFile({
    useS3AudioUrl,
    saveUserResponse,
    setRecordingState,
    setErrorData,
  })

  const onRecordingComplete = async ({ audioFile, audioUrl }) => {
    setRecordingState(RECORDING_COMPLETED)
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
          onChangeRecordingState={setRecordingState}
          onRecordingComplete={onRecordingComplete}
          setErrorData={setErrorData}
          userId={userId}
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
      <EduIf condition={!!isUploadingAudio}>
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
}

AudioResponseContainer.defaultProps = {
  userAnswer: '',
}

export default AudioResponseContainer
