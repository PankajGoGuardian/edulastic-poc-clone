import React, { useState, useEffect } from 'react'
import { EduButton } from '@edulastic/common'
import styled from 'styled-components'

import { ConfirmationModal } from '../../../src/components/common/ConfirmationModal'

const SyncModal = ({
  visible,
  handleCancel,
  classDetails,
  onProceed,
  history,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  useEffect(() => {
    if (classDetails?.canvasCode) {
      setTitle('Sync with Canvas')
      setDescription(
        `This class was synced with canvas before. Changing the canvas details may result in the removal of existing canvas students.`
      )
    } else {
      setTitle('Sync with Google Classrooms')
      setDescription(
        `This class was synced with Google Classroom before. Changing the code may result in the removal of existing Google Classroom students`
      )
    }
  }, [classDetails])

  const handleCreateNewClassClick = () => {
    history.push('/author/manageClass/createClass')
  }

  const handleOnProceedClick = () => {
    handleCancel()
    onProceed()
  }

  const Footer = (
    <ButtonWrapper>
      <div>
        <EduButton isGhost onClick={handleCreateNewClassClick}>
          Create New Class
        </EduButton>
      </div>
      <div style={{ display: 'flex' }}>
        <EduButton isGhost onClick={handleCancel}>
          Cancel
        </EduButton>
        <EduButton type="primary" onClick={handleOnProceedClick}>
          Proceed
        </EduButton>
      </div>
    </ButtonWrapper>
  )

  return (
    <StyledModal
      visible={visible}
      title={title}
      footer={Footer}
      centered
      onCancel={handleCancel}
    >
      <p>{description}</p>
    </StyledModal>
  )
}

export default SyncModal

const StyledModal = styled(ConfirmationModal)`
  .ant-modal-content {
    .ant-modal-header {
      padding-bottom: 5px;
      h4 {
        font-weight: ${({ theme }) => theme.semiBold};
      }
    }
    .ant-modal-body {
      display: block;
      min-height: 150px;
    }
    .ant-modal-footer {
      padding: 0px;
    }
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`
