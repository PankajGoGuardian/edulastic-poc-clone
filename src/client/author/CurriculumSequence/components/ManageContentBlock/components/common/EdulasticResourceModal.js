import { CustomModalStyled, EduButton } from '@edulastic/common'
import PropTypes from 'prop-types'
import React from 'react'

// A common bare-bone view modal component to add resource types

const EdulasticResourceModal = ({
  isVisible = false,
  closeCallback = () => {},
  submitCallback = () => {},
  headerText = '',
  okText = 'SUBMIT',
  canceltext = 'CANCEL',
  hideFooter = false,
  modalWidth = '',
  children,
  titleFontSize,
  padding,
}) => {
  const footer = (
    <>
      {!hideFooter && (
        <>
          <EduButton isGhost width="180px" key="cancel" onClick={closeCallback}>
            {canceltext}
          </EduButton>
          <EduButton
            data-cy="add-resource"
            width="180px"
            key="submit"
            onClick={submitCallback}
          >
            {okText}
          </EduButton>
        </>
      )}
    </>
  )
  return (
    <CustomModalStyled
      visible={isVisible}
      title={headerText}
      onCancel={closeCallback}
      centered
      footer={footer}
      modalWidth={modalWidth}
      titleFontSize={titleFontSize}
      padding={padding}
    >
      {children}
    </CustomModalStyled>
  )
}

EdulasticResourceModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  closeCallback: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  headerText: PropTypes.string.isRequired,
}

export default EdulasticResourceModal
