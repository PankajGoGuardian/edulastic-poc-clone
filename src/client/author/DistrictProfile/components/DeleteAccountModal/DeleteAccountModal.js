import React, { useState } from 'react'
import { compose } from 'redux'
import { Button, Form, Input } from 'antd'
import styled from 'styled-components'
import {
  borders,
  backgrounds,
  themeColor,
  whiteSmoke,
  numBtnColors,
  white,
} from '@edulastic/colors'
import { ConfirmationModal } from '../../../src/components/common/ConfirmationModal'

const DeleteAccountModal = ({ visible, toggleModal, form, deleteProfile }) => {
  const [disableButton, setButtonState] = useState(true)

  const handleResponse = (e) => {
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (
          values &&
          values.confirmationText &&
          values.confirmationText.toUpperCase() === 'DELETE'
        )
          deleteProfile()
      }
    })
  }

  const Footer = [
    <Button ghost onClick={() => toggleModal('DELETE_ACCOUNT', false)}>
      NO, CANCEL
    </Button>,
    <YesButton disabled={disableButton} onClick={handleResponse}>
      YES, DELETE
    </YesButton>,
  ]

  const Title = [<Heading>Delete My Account</Heading>]

  const validateText = (rule, value, callback) => {
    if (value && value.toUpperCase() === 'DELETE') {
      setButtonState(false)
      callback()
    } else {
      setButtonState(true)
      callback()
    }
  }

  return (
    <ConfirmationModal
      title={Title}
      centered
      textAlign="left"
      visible={visible}
      footer={Footer}
      textAlign="center"
      onCancel={() => toggleModal('DELETE_ACCOUNT', false)}
    >
      <ModalBody>
        <span>Are you sure want to delete this account?</span>
        <span>
          If sure, please type{' '}
          <strong style={{ color: themeColor }}>DELETE</strong> in the space
          below to proceed.
        </span>
        <FormItem>
          {form.getFieldDecorator('confirmationText', {
            rules: [
              {
                validator: validateText,
              },
            ],
          })(<TextInput type="text" />)}
        </FormItem>
      </ModalBody>
    </ConfirmationModal>
  )
}

const enhance = compose(Form.create())

export default enhance(DeleteAccountModal)

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  font-weight: 600;
`

const FormItem = styled(Form.Item)`
  width: 80%;
  display: inline-block;
  margin: 10px;
  .ant-input {
    height: 33px;
    background: ${backgrounds.primary};
    padding: 10px 24px;
  }
`

const Heading = styled.h4`
  font-weight: 600;
`

const TextInput = styled(Input)`
  text-align: center;
`

const YesButton = styled(Button)`
  color: ${(props) =>
    props.disabled ? 'rgba(0, 0, 0, 0.25)' : white} !important;
  background-color: ${(props) =>
    props.disabled ? whiteSmoke : themeColor} !important;
  border-color: ${(props) =>
    props.disabled ? numBtnColors.borderColor : themeColor} !important;
`
