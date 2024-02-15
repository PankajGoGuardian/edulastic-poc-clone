import { EduButton, notification } from '@edulastic/common'
import React from 'react'
import styled from 'styled-components'
import { feedbackApi } from '@edulastic/api'
import { ConfirmationModal } from '../../../../../src/components/common/ConfirmationModal'

const DeleteFeedBackModal = (props) => {
  const {
    showDeleteModal,
    setShowDeleteModal,
    deleteFeedback,
    setDeleteFeedback,
    data,
    setData,
  } = props
  const onDeleteFeedBack = async () => {
    try {
      if (deleteFeedback && deleteFeedback._id) {
        const response = await feedbackApi.deleteFeedback(deleteFeedback?._id, {
          feedBackOwnerId: deleteFeedback?.givenBy?._id,
        })
        if (response.error) {
          throw new Error(response.error)
        }
        setData(data.filter((doc) => doc._id !== deleteFeedback?._id))
        setShowDeleteModal(false)
        setDeleteFeedback(null)
        notification({
          type: 'success',
          msg: `Sucessfully deleted the selected student feedback`,
        })
      }
    } catch (err) {
      notification({
        type: 'error',
        msg: `Unable to delete feedback`,
      })
    }
  }
  const onCancel = () => {
    setShowDeleteModal(false)
  }
  return (
    <StyledConfirmationModal
      visible={showDeleteModal}
      title={null}
      onOk={onDeleteFeedBack}
      onCancel={onCancel}
      maskClosable
      centered
      footer={[
        <EduButton onClick={onCancel} isGhost type="primary" key="cancelBtn">
          Cancel
        </EduButton>,
        <EduButton onClick={onDeleteFeedBack} key="deleteBtn">
          Yes, Delete
        </EduButton>,
      ]}
      width={50}
      bodyHeight="50px"
      closable={false}
      $rounded
    >
      <TitleWrapper>
        <ModalTitle>Are you sure you want to delete this feedback?</ModalTitle>
        <p>it will be deleted permanently and cannot be recovered</p>
      </TitleWrapper>
    </StyledConfirmationModal>
  )
}

export default DeleteFeedBackModal

const ModalTitle = styled.h1`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`
const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: -40px;
  width: 100%;
`
const StyledConfirmationModal = styled(ConfirmationModal)`
  & {
    .ant-modal-content {
      border-radius: ${(props) => (props.$rounded ? '20px' : '0')};
    }
  }
`
