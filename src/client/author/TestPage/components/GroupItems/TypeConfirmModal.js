import React from 'react'
import styled from 'styled-components'
import { white, themeColor } from '@edulastic/colors'
import { Button } from 'antd'
import { ConfirmationModal } from '../../../src/components/common/ConfirmationModal'

const TypeConfirmModal = ({
  visible,
  handleResponse,
  confirmModalCategory,
  groupName,
  additionalDeleteText = '',
}) => {
  const Footer = [
    <Button data-cy="NoOverRide" onClick={() => handleResponse('NO')}>
      NO
    </Button>,
    <YesButton data-cy="overRide" onClick={() => handleResponse('YES')}>
      YES
    </YesButton>,
  ]
  return (
    <StyledModal
      title={null}
      centered
      textAlign="center"
      visible={visible}
      footer={Footer}
      onCancel={() => handleResponse('NO')}
      width="400px"
    >
      <ModalBody>
        <span>
          {confirmModalCategory === 'TYPE' ? (
            'The changes will get overridden with new criteria. Are you sure you want to proceed ?'
          ) : confirmModalCategory === 'DELETE LAST GROUP' ? (
            'This action will remove all sections and items and change to a normal test.'
          ) : (
            <span>
              Are you sure you want to delete
              <span style={{ color: themeColor }}> {groupName} </span>?{' '}
              {additionalDeleteText}
            </span>
          )}
        </span>
      </ModalBody>
    </StyledModal>
  )
}

export const StyledModal = styled(ConfirmationModal)`
  min-width: 550px;
  .ant-modal-content {
    .ant-modal-header {
      padding-bottom: 0px;
    }
  }
`

export const ModalBody = styled.div`
  display: block;
  width: 100%;
  > span {
    font-weight: ${({ theme }) => theme.semiBold};
  }
`

const YesButton = styled(Button)`
  color: ${white} !important;
  background-color: ${themeColor} !important;
  border-color: ${themeColor} !important;
`
export default TypeConfirmModal
