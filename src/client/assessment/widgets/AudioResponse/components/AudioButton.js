import React from 'react'
import PropTypes from 'prop-types'
import {
  IconWhitePlay,
  IconWhiteMic,
  IconWhiteStop,
  IconWhitePause,
} from '@edulastic/icons'
import { PAUSE, PLAY, MIC, STOP } from '../constants'
import { StyledButton } from '../styledComponents/AudioRecorder'

const iconMap = {
  [PLAY]: IconWhitePlay,
  [PAUSE]: IconWhitePause,
  [MIC]: IconWhiteMic,
  [STOP]: IconWhiteStop,
}

const SvgStyles = { display: 'block', margin: 'auto' }
const Icon = ({ type }) => {
  const IconComponent = iconMap[type] || null
  return IconComponent ? <IconComponent style={SvgStyles} /> : null
}

const AudioButton = ({ buttonType, onClickHandler, isRecording, disabled }) => {
  return (
    <StyledButton
      onClick={onClickHandler}
      isRecording={isRecording}
      disabled={disabled}
    >
      <Icon type={buttonType} />
    </StyledButton>
  )
}

AudioButton.propTypes = {
  buttonType: PropTypes.string.isRequired,
  onClickHandler: PropTypes.func.isRequired,
  isRecording: PropTypes.bool,
}

AudioButton.defaultProps = {
  isRecording: false,
}

export default AudioButton
