import React from 'react'
import { EduButton } from '@edulastic/common'
import { ModalBody, StyledModal } from '../../../GroupItems/TypeConfirmModal'

const RemoveSectionsModal = ({ isVisible, closeModal, removeSections }) => {
  const footer = [
    <EduButton height="40px" isGhost key="cancelButton" onClick={closeModal}>
      No
    </EduButton>,
    <EduButton height="40px" key="okButton" onClick={removeSections}>
      Yes
    </EduButton>,
  ]
  return (
    <StyledModal
      visible={isVisible}
      onCancel={closeModal}
      footer={footer}
      centered
      modalWidth="565px"
      borderRadius="10px"
      closeTopAlign="14px"
      closeRightAlign="10px"
      closeIconColor="black"
    >
      <ModalBody>
        Are you sure you want to remove all sections on this test - This can not
        be undone
      </ModalBody>
    </StyledModal>
  )
}

export default RemoveSectionsModal
