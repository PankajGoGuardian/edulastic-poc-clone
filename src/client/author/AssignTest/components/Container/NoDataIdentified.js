import { EduButton } from '@edulastic/common'
import React from 'react'
import { ConfirmationModal } from '../../../src/components/common/ConfirmationModal'
import { Paragraph } from './styled'

const NoDataIdentified = ({ closeModal, noDataFound }) => {
  const Footer = [
    <EduButton isGhost key="cancel" onClick={closeModal}>
      Cancel
    </EduButton>,
  ]

  return (
    <ConfirmationModal
      maskClosable={false}
      textAlign="left"
      title="Select Schools"
      centered
      visible
      onCancel={closeModal}
      footer={Footer}
      modalWidth="650px"
      bodyHeight="75px"
    >
      <Paragraph>
        {noDataFound.data.length}/{noDataFound?.total} schools were not found.
        Details below. Please correct and add them.
      </Paragraph>
      <Paragraph>{noDataFound?.data.join(', ')}</Paragraph>
      <Paragraph>
        Tip: You can search for the school name in the dropdown.
      </Paragraph>
    </ConfirmationModal>
  )
}

export default NoDataIdentified
