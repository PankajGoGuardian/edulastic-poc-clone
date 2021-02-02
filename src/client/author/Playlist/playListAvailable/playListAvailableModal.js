import React from 'react'
import { CustomModalStyled, EduButton } from '@edulastic/common'

const PlayListAvailableModal = ({ isVisible, closeModal }) => {
  const Footer = (
    <>
      <EduButton data-cy="cancelButton" isGhost onClick={closeModal}>
        Cancel
      </EduButton>
      <EduButton>Proceed</EduButton>
    </>
  )
  return (
    <CustomModalStyled
      className="sparkMathModaltest"
      centered
      visible={isVisible}
      footer={Footer}
      onCancel={closeModal}
    >
      <div>playlistAvailableModal</div>
    </CustomModalStyled>
  )
}

export default PlayListAvailableModal
