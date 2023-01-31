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
  const {
    audioDuration,
    isAudioLoading,
    playerState,
    audioSliderFillCount,
    handlePlay,
    handlePause,
    handleOnClickRerecord,
    resetAudioTime,
    setAudioSliderCount,
  } = useAudioPlayer({ audioUrl, onClickRerecord, setErrorData })

  return (
    <StyledAudioPlayerContainer>
      <StyledContainer width="95%">
        <EduIf condition={!isAudioLoading}>
          <AudioPlayer
            handlePlay={handlePlay}
            handlePause={handlePause}
            audioDuration={audioDuration}
            resetAudioTime={resetAudioTime}
            playerState={playerState}
            setAudioSliderCount={setAudioSliderCount}
            audioSliderFillCount={audioSliderFillCount}
          />
        </EduIf>
        <EduIf condition={!!isAudioLoading}>
          <StyledText showLoader>
            {i18translate('component.audioResponse.loadingAudio')}
          </StyledText>
        </EduIf>
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
