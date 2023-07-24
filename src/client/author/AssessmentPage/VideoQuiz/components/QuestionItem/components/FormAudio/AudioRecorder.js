import { EduIf, notification } from '@edulastic/common'
import { IconWhiteMic, IconWhiteStop } from '@edulastic/icons'
import { Icon } from 'antd'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import CountDownTimer from '../../../../../../../assessment/widgets/AudioResponse/components/CountDownTimer'
import {
  AUDIO_UPLOAD_ACTIVE,
  AUDIO_UPLOAD_ERROR,
  AUDIO_UPLOAD_SUCCESS,
  RECORDING_ACTIVE,
  RECORDING_INACTIVE,
} from '../../../../../../../assessment/widgets/AudioResponse/constants'
import useAudioRecorder from '../../../../../../../assessment/widgets/AudioResponse/hooks/useAudioRecorder'
import useUploadAudioFile from '../../../../../../../assessment/widgets/AudioResponse/hooks/useUploadAudioFile'
import {
  StyledAudioElement,
  StyledButton,
} from '../../../../../../../assessment/widgets/AudioResponse/styledComponents/AudioRecorder'
import { getUserIdSelector } from '../../../../../../src/selectors/user'

const AudioRecorder = ({ userId, onFinish }) => {
  const [recordingState, setRecordingState] = useState(RECORDING_INACTIVE)
  const [uploadedUrl, setUploadedUrl] = useState()
  const { uploadFile } = useUploadAudioFile({
    useS3AudioUrl: true,
    saveUserResponse: (url) => {
      setUploadedUrl(url)
      onFinish(url)
      setRecordingState(AUDIO_UPLOAD_SUCCESS)
    },
    setErrorData: ({ errorMessage }) => {
      setRecordingState(AUDIO_UPLOAD_ERROR)
      notification({
        type: 'warn',
        msg: errorMessage,
      })
    },
  })
  const onRecordingComplete = async ({ audioFile, audioUrl }) => {
    setRecordingState(AUDIO_UPLOAD_ACTIVE)
    await uploadFile({ audioFile, objectAudioUrl: audioUrl })
  }
  const { onClickRecordAudio, onClickStopRecording } = useAudioRecorder({
    onChangeRecordingState: (state) => setRecordingState(state),
    onRecordingComplete,
    setErrorData: ({ errorMessage }) => {
      setRecordingState(AUDIO_UPLOAD_ERROR)
      notification({
        type: 'warn',
        msg: errorMessage,
      })
    },
    userId,
  })

  return (
    <>
      <EduIf condition={recordingState === RECORDING_INACTIVE}>
        <StyledButton
          height="32px"
          width="32px"
          lineHeight="38px"
          onClick={onClickRecordAudio}
        >
          <IconWhiteMic height={16} />
        </StyledButton>
      </EduIf>
      <EduIf condition={recordingState === RECORDING_ACTIVE}>
        <StyledButton
          isRecording
          height="32px"
          width="32px"
          lineHeight="32px"
          onClick={onClickStopRecording}
        >
          <IconWhiteStop height={12} />
        </StyledButton>
        <StyledCountDownWrapper>
          <CountDownTimer
            audioTimeLimitInMinutes={5}
            handleStopRecording={onClickStopRecording}
          />
        </StyledCountDownWrapper>
      </EduIf>
      <EduIf condition={recordingState === AUDIO_UPLOAD_ACTIVE}>
        <StyledButton height="32px" width="32px" lineHeight="32px">
          <StyledWhiteIcon type="sync" spin />
        </StyledButton>
        <StyledCountDownWrapper>
          <div>Uploading...</div>
        </StyledCountDownWrapper>
      </EduIf>
      <EduIf condition={recordingState === AUDIO_UPLOAD_ERROR}>
        <StyledButton height="32px" width="32px" lineHeight="32px">
          <Icon type="warning" />
        </StyledButton>
        <StyledCountDownWrapper>
          <div>Failed</div>
        </StyledCountDownWrapper>
      </EduIf>
      <EduIf condition={recordingState === AUDIO_UPLOAD_SUCCESS}>
        <StyledAudioElement
          src={uploadedUrl}
          controls
          width="100%"
          height="32px"
          controlsList="nodownload noplaybackrate"
          preload="auto"
        />
      </EduIf>
    </>
  )
}

const StyledCountDownWrapper = styled.div`
  div {
    line-height: 32px;
    padding-left: 16px;
    font-size: 16px;
    font-weight: bold;
  }
`

const StyledWhiteIcon = styled(Icon)`
  color: white;
`

const mapStateToProps = (state) => ({
  userId: getUserIdSelector(state),
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AudioRecorder)
