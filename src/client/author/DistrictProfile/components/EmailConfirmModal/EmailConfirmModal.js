import React from 'react'
import { compose } from 'redux'
import { Button, Form } from 'antd'
import { EduButton } from '@edulastic/common'
import styled from 'styled-components'
import { themeColor, whiteSmoke, numBtnColors, white } from '@edulastic/colors'
import { ConfirmationModal } from '../../../src/components/common/ConfirmationModal'

const EmailConfirmModal = ({ visible, toggleModal, changeEmail }) => {
  const Footer = [
    <NoButton isGhost onClick={() => toggleModal('EMAIL_CONFIRM', false)}>
      NO, CANCEL
    </NoButton>,
    <YesButton onClick={changeEmail}>SAVE</YesButton>,
  ]

  const Title = [<Heading>Save Confirm</Heading>]

  return (
    <ConfirmationModal
      title={Title}
      centered
      textAlign="left"
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

const YesButton = styled(Button)`
  color: ${(props) =>
    props.disabled ? 'rgba(0, 0, 0, 0.25)' : white} !important;
  background-color: ${(props) =>
    props.disabled ? whiteSmoke : themeColor} !important;
  border-color: ${(props) =>
    props.disabled ? numBtnColors.borderColor : themeColor} !important;
  width: 130px;
`

const NoButton = styled(EduButton)`
  padding: 5px 30px;
  width: 130px;
  margin-right: 30px;
`
