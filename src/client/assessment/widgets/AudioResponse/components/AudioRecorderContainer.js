import React from 'react'
import PropTypes from 'prop-types'
import { EduIf } from '@edulastic/common'
import { RECORDING_ACTIVE, RECORDING_INACTIVE, MIC, STOP } from '../constants'
import {
  StyledContainer,
  StyledDivider,
  StyledRecordingDataWrapper,
  StyledText,
  StyledRecordingDataContainer,
} from '../styledComponents/AudioRecorder'
import AudioButton from './AudioButton'
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
        <StyledContainer>
          <AudioButton
            buttonType={STOP}
            onClickHandler={onClickStopRecording}
            isRecording
          />
        </StyledContainer>
        <StyledRecordingDataWrapper>
          <StyledRecordingDataContainer>
            <StyledContainer>
              <StyledText showLoader fontSize="11px/15px">
                {i18translate('component.audioResponse.recording')}
              </StyledText>
            </StyledContainer>
            <StyledContainer>
              <StyledDivider />
            </StyledContainer>
            <StyledContainer>
              <CountDownTimer
                audioTimeLimitInMinutes={audioTimeLimitInMinutes}
                handleStopRecording={onClickStopRecording}
              />
            </StyledContainer>
          </StyledRecordingDataContainer>
          <StyledContainer padding="5px">
            <StyledText>
              {i18translate('component.audioResponse.clickToStopRecording')}
            </StyledText>
          </StyledContainer>
        </StyledRecordingDataWrapper>
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
