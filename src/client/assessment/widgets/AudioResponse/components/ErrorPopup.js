import React from 'react'
import PropTypes from 'prop-types'
import { IconRedInfo } from '@edulastic/icons'
import { StyledModal } from '../styledComponents/AudioRecorder'

const ErrorPopup = ({ errorMessage, isOpen, setErrorData }) => {
  return (
    <StyledModal
      style={{ top: 5 }}
      open={isOpen}
      footer={null}
      visible={isOpen}
      closable={false}
      mask={false}
      maskClosable
      onCancel={() =>
        setErrorData({
          isOpen: false,
          errorMessage: '',
        })
      }
    >
      <p>{errorMessage}</p>
      <IconRedInfo />
    </StyledModal>
  )
}

ErrorPopup.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setErrorData: PropTypes.func.isRequired,
}

ErrorPopup.defaultProps = {}

export default ErrorPopup
