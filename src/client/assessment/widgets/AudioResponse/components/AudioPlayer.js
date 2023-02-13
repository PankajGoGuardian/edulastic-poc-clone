import React from 'react'
import { EduIf } from '@edulastic/common'
import PropTypes from 'prop-types'
import {
  StyledText,
  StyledContainer,
  StyledAudioElement,
} from '../styledComponents/AudioRecorder'

const AudioPlayer = ({ audioRef, i18translate, isAudioLoading, audioUrl }) => {
  return (
    <>
      <EduIf condition={!!isAudioLoading}>
        <StyledText showLoader>
          {i18translate('component.audioResponse.loadingAudio')}
        </StyledText>
      </EduIf>
      <StyledContainer>
        <EduIf condition={!isAudioLoading}>
          <StyledText isTextBlack>
            {i18translate('component.audioResponse.recorded')}
          </StyledText>
        </EduIf>
      </StyledContainer>
      <StyledContainer>
        <StyledAudioElement
          src={audioUrl}
          controls={!isAudioLoading}
          ref={audioRef}
          controlsList="nodownload noplaybackrate"
          preload="auto"
        />
      </StyledContainer>
    </>
  )
}

AudioPlayer.propTypes = {
  audioRef: PropTypes.object.isRequired,
  i18translate: PropTypes.func.isRequired,
  isAudioLoading: PropTypes.bool.isRequired,
  audioUrl: PropTypes.string.isRequired,
}

AudioPlayer.defaultProps = {}

export default AudioPlayer
