import React from 'react'
import PropTypes from 'prop-types'
import { StyledText, StyledContainer } from '../styledComponents/AudioRecorder'
import AudioButton from './AudioButton'

const AudioRecorder = ({
  onClickHandler,
  buttonType,
  text,
  stylesData,
  disabled,
}) => {
  const { isTextBlack, showLoader } = stylesData
  return (
    <>
      <StyledContainer>
        <AudioButton
          buttonType={buttonType}
          onClickHandler={onClickHandler}
          isRecording={showLoader}
          disabled={disabled}
        />
      </StyledContainer>

      <StyledContainer>
        <StyledText isTextBlack={isTextBlack} showLoader={showLoader}>
          {text}
        </StyledText>
      </StyledContainer>
    </>
  )
}

AudioRecorder.propTypes = {
  onClickHandler: PropTypes.func.isRequired,
  buttonType: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  stylesData: PropTypes.object,
}

AudioRecorder.defaultProps = {
  stylesData: { isTextBlack: false, showLoader: false },
}

export default AudioRecorder
