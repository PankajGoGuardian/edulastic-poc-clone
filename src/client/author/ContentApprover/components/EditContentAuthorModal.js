import React from 'react'
import { Form, Input, Row, Col } from 'antd'

import {
  ButtonsContainer,
  OkButton,
  CancelButton,
  StyledModal,
  ModalFormItem,
} from '../../../common/styled'
import { omit } from 'lodash'

const EditContentAuthorModal = ({
  form,
  closeModal,
  contentApproverData,
  updateContentApprover,
  userOrgId,
  modalVisible,
  contentApproverData: { _source },
}) => {
  const onSaveContentAuthor = () => {
    form.validateFields((err, row) => {
      if (!err) {
        if (!row.password) row = omit(row, ['password'])
        row = omit(row, ['confirmPassword'])

        updateContentApprover({
          userId: contentApproverData._id,
          data: Object.assign(row, {
            districtId: userOrgId,
          }),
        })
        closeModal()
      }
    })
  }

  const handleConfirmPassword = (rule, value, callback) => {
    const { getFieldValue } = form
    const password = getFieldValue('password')
    const confirmPassword = getFieldValue('confirmPassword')

    if (password !== confirmPassword) return callback('Password does not match')

    callback() // no error
  }

  const { getFieldDecorator } = form

  return (
    <StyledModal
      visible={modalVisible}
      title="Edit content approver"
      onOk={onSaveContentAuthor}
      onCancel={closeModal}
      maskClosable={false}
      centered
      footer={[
        <ButtonsContainer>
          <CancelButton onClick={closeModal}>No, Cancel</CancelButton>
          <OkButton onClick={onSaveContentAuthor}>Yes, Update</OkButton>
        </ButtonsContainer>,
      ]}
    >
      <Row>
        <Col span={24}>
          <ModalFormItem label="First Name">
            {getFieldDecorator('firstName', {
              rules: [
                {
                  required: true,
                  message: 'Please input First Name',
                },
              ],
              initialValue: _source.firstName,
            })(<Input placeholder="Enter First Name" />)}
          </ModalFormItem>
        </Col>
        <Col span={24}>
          <ModalFormItem label="Last Name">
            {getFieldDecorator('lastName', {
              rules: [
                {
                  required: true,
                  message: 'Please input Last Name',
                },
              ],
              initialValue: _source.lastName,
            })(<Input placeholder="Enter Last Name" />)}
          </ModalFormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <ModalFormItem label="Email">
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: 'Please input E-mail',
                },
                {
                  type: 'email',
                  message: 'The input is not valid E-mail',
                },
              ],
              initialValue: _source.email,
            })(<Input placeholder="Enter E-mail" />)}
          </ModalFormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <ModalFormItem label="Password">
            {getFieldDecorator(
              'password',
              {}
            )(
              <Input
                type="password"
                autoComplete="off"
                placeholder="Enter password"
              />
            )}
          </ModalFormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <ModalFormItem label="Confirm Password">
            {getFieldDecorator('confirmPassword', {
              rules: [
                {
                  validator: handleConfirmPassword,
                  message: 'Password does not match',
                },
              ],
            })(
              <Input
                type="password"
                autoComplete="off"
                placeholder="Enter Confirm Password"
              />
            )}
          </ModalFormItem>
        </Col>
      </Row>
    </StyledModal>
  )
}

const EditContentAuthorModalForm = Form.create()(EditContentAuthorModal)
export default EditContentAuthorModalForm
