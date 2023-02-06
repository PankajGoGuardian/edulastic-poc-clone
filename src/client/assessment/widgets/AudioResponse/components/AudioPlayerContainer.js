import React from 'react'
import PropTypes from 'prop-types'
import { EduIf } from '@edulastic/common'
import { IconRerecord } from '@edulastic/icons'
import {
  StyledContainer,
  StyledRerecordContainer,
  StyledRerecordButton,
  StyledText,
  StyledAudioPlayerContainer,
} from '../styledComponents/AudioRecorder'
import AudioPlayer from './AudioPlayer'
import useAudioPlayer from '../hooks/useAudioPlayer'

const AudioPlayerContainer = ({
  i18translate,
  audioUrl,
  onClickRerecord,
  hideAudioRecorder,
  setErrorData,
}) => {
  const { audioRef, isAudioLoading, handleOnClickRerecord } = useAudioPlayer({
    audioUrl,
    onClickRerecord,
    setErrorData,
  })

  return (
    <StyledAudioPlayerContainer>
      <StyledContainer
        width="95%"
        justifyContent={isAudioLoading ? 'center' : 'space-evenly'}
      >
        <AudioPlayer
          i18translate={i18translate}
          audioRef={audioRef}
          isAudioLoading={isAudioLoading}
          audioUrl={audioUrl}
        />
      </StyledContainer>
      <EduIf
        condition={[!isAudioLoading, !hideAudioRecorder].every((val) => !!val)}
      >
        <StyledRerecordContainer>
          <StyledContainer>
            <StyledRerecordButton onClick={handleOnClickRerecord}>
              <IconRerecord />
            </StyledRerecordButton>
          </StyledContainer>
          <StyledContainer>
            <StyledText>
              {i18translate('component.audioResponse.rerecord')}
            </StyledText>
          </StyledContainer>
        </StyledRerecordContainer>
      </EduIf>
    </StyledAudioPlayerContainer>
  )
}

AudioPlayerContainer.propTypes = {
  i18translate: PropTypes.func.isRequired,
  audioUrl: PropTypes.string.isRequired,
  onClickRerecord: PropTypes.func.isRequired,
  hideAudioRecorder: PropTypes.bool.isRequired,
  setErrorData: PropTypes.func.isRequired,
}

AudioPlayerContainer.defaultProps = {}

export default AudioPlayerContainer
