import React from 'react'
import PropTypes from 'prop-types'
import { EduIf } from '@edulastic/common'
import { RECORDING_ACTIVE, RECORDING_INACTIVE, MIC, STOP } from '../constants'
import {
  StyledContainer,
  StyledDivider,
} from '../styledComponents/AudioRecorder'
import AudioRecorder from './AudioRecorder'
import CountDownTimer from './CountDownTimer'
import useAudioRecorder from '../hooks/useAudioRecorder'

const AudioRecorderContainer = ({
  i18translate,
  audioTimeLimitInMinutes,
  recordingState,
  onChangeRecordingState,
  onRecordingComplete,
  setErrorData,
  userId,
  stopRecordingForQid,
  setStopAudioRecordingAndUploadForQid,
  questionId,
}) => {
  const { onClickRecordAudio, onClickStopRecording } = useAudioRecorder({
    onChangeRecordingState,
    onRecordingComplete,
    setErrorData,
    userId,
    stopRecordingForQid,
    setStopAudioRecordingAndUploadForQid,
    questionId,
  })

  return (
    <StyledContainer>
      <EduIf condition={recordingState === RECORDING_INACTIVE}>
        <AudioRecorder
          onClickHandler={onClickRecordAudio}
          buttonType={MIC}
          text={i18translate('component.audioResponse.recordAnswer')}
          stylesData={{ isTextBlack: true }}
        />
      </EduIf>
      <EduIf condition={recordingState === RECORDING_ACTIVE}>
        <AudioRecorder
          onClickHandler={onClickStopRecording}
          buttonType={STOP}
          text={i18translate('component.audioResponse.recording')}
          stylesData={{ showLoader: true }}
        />
        <StyledContainer>
          <StyledDivider />
        </StyledContainer>
        <StyledContainer>
          <CountDownTimer
            audioTimeLimitInMinutes={audioTimeLimitInMinutes}
            handleStopRecording={onClickStopRecording}
          />
        </StyledContainer>
      </EduIf>
    </StyledContainer>
  )
}

AudioRecorderContainer.propTypes = {
  i18translate: PropTypes.func.isRequired,
  audioTimeLimitInMinutes: PropTypes.number.isRequired,
  recordingState: PropTypes.string.isRequired,
  onChangeRecordingState: PropTypes.func.isRequired,
  onRecordingComplete: PropTypes.func.isRequired,
  setErrorData: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  stopRecordingForQid: PropTypes.string.isRequired,
  questionId: PropTypes.string.isRequired,
  setStopAudioRecordingAndUploadForQid: PropTypes.func.isRequired,
}

AudioRecorderContainer.defaultProps = {}

export default AudioRecorderContainer
