import React from 'react'
import PropTypes from 'prop-types'
import { StyledTimerContainer } from '../styledComponents/AudioRecorder'
import useCountDownTimer from '../hooks/useCountDownTimer'

const CountDownTimer = ({ audioTimeLimitInMinutes, handleStopRecording }) => {
  const audioDurationInMilliSeconds = audioTimeLimitInMinutes * 60 * 1000
  const { time } = useCountDownTimer({
    audioDurationInMilliSeconds,
    handleStopRecording,
  })

  return <StyledTimerContainer>{time}</StyledTimerContainer>
}

CountDownTimer.propTypes = {
  audioTimeLimitInMinutes: PropTypes.number.isRequired,
  handleStopRecording: PropTypes.func.isRequired,
}

CountDownTimer.defaultProps = {}

export default CountDownTimer
