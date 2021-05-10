import React from 'react'
import styled from 'styled-components'
import { EduButton } from '@edulastic/common'
import { ConfirmationModal } from '../../../author/src/components/common/ConfirmationModal'

const ReportIssueConfirmaModal = ({ visible, toggleModal, handleResponse }) => {
  return (
    <ConfirmationModal
      centered
      visible={visible}
      footer={null}
      textAlign="center"
      onCancel={() => toggleModal(false)}
    >
      <ModalBody>
        <Heading>Are you sure there is a problem with this question?</Heading>
        <span>
          Click{' '}
          <EduButton height="26px" onClick={() => handleResponse(true)}>
            Yes
          </EduButton>{' '}
          to report this issue, or{' '}
          <EduButton height="26px" onClick={() => handleResponse(false)}>
            Cancel
          </EduButton>{' '}
          to go back to the question.
        </span>
      </ModalBody>
    </ConfirmationModal>
  )
}

export default ReportIssueConfirmaModal

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  font-weight: 600;
`

const Heading = styled.h3`
  font-weight: 600;
  margin-bottom: 1em;
`
