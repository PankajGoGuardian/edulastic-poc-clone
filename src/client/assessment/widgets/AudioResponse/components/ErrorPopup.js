import React from 'react'
import { StyledModal } from '../styledComponents/AudioRecorder'

const ErrorPopup = ({ errorMessage, isOpen, setErrorData }) => {
  return (
    <StyledModal
      style={{ top: 90 }}
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
    </StyledModal>
  )
}

ErrorPopup.propTypes = {}

ErrorPopup.defaultProps = {}

export default ErrorPopup
