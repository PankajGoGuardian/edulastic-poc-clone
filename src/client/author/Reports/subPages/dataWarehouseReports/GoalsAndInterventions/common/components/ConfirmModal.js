import { CustomModalStyled, EduButton } from '@edulastic/common'
import React from 'react'
import styled from 'styled-components'

const ConfirmModal = ({
  visible,
  onOk,
  onCancel,
  message = 'Are you sure you want to cancel?',
}) => {
  return (
    <CustomModalStyled
      visible={visible}
      modalWidth="300px"
      onOk={onOk}
      onCancel={onCancel}
      maskClosable={false}
      closable={false}
      centered
      footer={[
        <EduButton height="40px" isGhost key="cancelButton" onClick={onOk}>
          Yes
        </EduButton>,
        <EduButton height="40px" key="okButton" onClick={onCancel}>
          No
        </EduButton>,
      ]}
    >
      <Message>{message}</Message>
    </CustomModalStyled>
  )
}

const Message = styled.div`
  text-align: center;
`

export default ConfirmModal
