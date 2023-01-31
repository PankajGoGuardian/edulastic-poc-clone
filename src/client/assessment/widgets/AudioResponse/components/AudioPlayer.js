import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import AudioSliderSVG from '../assets/AudioSliderSVG'
import { PLAY, PAUSE, STOP, audioSliderTotalElementCount } from '../constants'
import {
  StyledTimerContainer,
  StyledText,
  StyledContainer,
  StyledDivider,
} from '../styledComponents/AudioRecorder'
import AudioButton from './AudioButton'

const AudioPlayer = ({
  handlePlay,
  handlePause,
  audioDuration,
  resetAudioTime,
  playerState,
  setAudioSliderCount,
  audioSliderFillCount,
}) => {
  const svgContainerRef = useRef(null)

  useEffect(() => {
    /**
     * get total number of child elements (rectangular bars) in the svg
     * to get the percent and display audio slider as audio plays
     * 48 is precalculated number
     */
    const audioSliderElementsCount =
      svgContainerRef?.current?.childNodes?.childNodes?.length ||
      audioSliderTotalElementCount
    setAudioSliderCount(audioSliderElementsCount)
    resetAudioTime()
  }, [])

  const showPlayButton = () => {
    return [PAUSE, STOP, null].includes(playerState)
  }

  const handlePlayOrPauseAudio = () => {
    if (!showPlayButton()) {
      handlePause()
      return
    }
    handlePlay()
  }

  return (
    <>
      <StyledContainer>
        <AudioButton
          onClickHandler={handlePlayOrPauseAudio}
          buttonType={showPlayButton() ? PLAY : PAUSE}
        />
      </StyledContainer>
      <StyledContainer ref={svgContainerRef}>
        <AudioSliderSVG audioSliderFillCount={audioSliderFillCount} />
      </StyledContainer>
      <StyledContainer>
        <StyledText>Recorded</StyledText>
      </StyledContainer>
      <StyledContainer>
        <StyledDivider />
      </StyledContainer>
      <StyledContainer>
        <StyledTimerContainer>{audioDuration}</StyledTimerContainer>
      </StyledContainer>
    </>
  )
}

AudioPlayer.propTypes = {
  handlePlay: PropTypes.func.isRequired,
  handlePause: PropTypes.func.isRequired,
  audioDuration: PropTypes.string.isRequired,
  resetAudioTime: PropTypes.func.isRequired,
  playerState: PropTypes.string,
  setAudioSliderCount: PropTypes.func.isRequired,
  audioSliderFillCount: PropTypes.number.isRequired,
}

AudioPlayer.defaultProps = {
  playerState: null,
}

export default AudioPlayer
