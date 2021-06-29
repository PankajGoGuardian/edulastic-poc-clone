import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { EduButton } from '@edulastic/common'
import {
  ModalWrapper,
  ModalFooter,
} from '../../../../../../common/components/ConfirmationModal/styled'

const DeleteResourceModal = ({
  isVisible,
  onCancel,
  id,
  deleteResource,
}) => {

  return (
    <StyledModal
      visible={isVisible}
      width="570px"
      title="Delete Resource"
      onCancel={() => onCancel()}
      centered
      footer={[
        <ModalFooter>
          <EduButton
            data-cy="cancel"
            isGhost
            key="cancel"
            onClick={() => onCancel()}
          >
            No, Cancel
          </EduButton>
          <EduButton
            key="delete"
            data-cy="submitConfirm"
            onClick={() => {
              deleteResource(id)
              onCancel()
            }}
          >
            Yes, Delete
          </EduButton>
        </ModalFooter>,
      ]}
    >
      <div className="delete-message">
      <p>Are you sure you want to delete this resource?</p>
            </div>
    </StyledModal>
  )
}

const ConnectedDeleteItemModal = connect(
  (state) => ({
  }),
  {
  }
)(DeleteResourceModal)

export { ConnectedDeleteItemModal as DeleteResourceModal }

const StyledModal = styled(ModalWrapper)`
  padding: 15px 45px 30px 45px;
  .ant-modal-header {
    padding: 10px 0;
  }
  .ant-modal-body {
    padding: 0;
  }
  .ant-modal-content {
    .ant-modal-title {
      font-size: 22px;
      font-weight: bold;
      .title-icon {
        margin-right: 15px;
        svg {
          height: 18px;
          width: 18px;
        }
      }
    }

    .ant-modal-body {
      flex-direction: column;
      .delete-message {
        margin: 20px 5px;
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
`