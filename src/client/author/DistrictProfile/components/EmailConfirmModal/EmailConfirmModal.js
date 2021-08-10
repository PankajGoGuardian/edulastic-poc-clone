import React from 'react'
import { compose } from 'redux'
import { Button, Form } from 'antd'
import { EduButton } from '@edulastic/common'
import styled from 'styled-components'
import { themeColor, whiteSmoke, numBtnColors, white } from '@edulastic/colors'
import { ConfirmationModal } from '../../../src/components/common/ConfirmationModal'

const EmailConfirmModal = ({ visible, toggleModal, changeEmail }) => {
  const Footer = [
    <EduButton isBlue onClick={() => toggleModal('EMAIL_CONFIRM', false)}>
      NO, CANCEL
    </EduButton>,
    <EduButton onClick={changeEmail}>SAVE</EduButton>,
  ]

  const Title = [<Heading>Save Confirm</Heading>]

  return (
    <ConfirmationModal
      title={Title}
      centered
      visible={visible}
      footer={Footer}
      textAlign="center"
      onCancel={() => toggleModal('EMAIL_CONFIRM', false)}
    >
      <ModalBody>
        <span>
          You will be logged out if you change your Email/Username. You will
          have to sign in with your new username henceforth. Are you sure you
          want to continue?
        </span>
      </ModalBody>
    </ConfirmationModal>
  )
}

const enhance = compose(Form.create())

export default enhance(EmailConfirmModal)

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const Heading = styled.h4`
  font-weight: 600;
`
