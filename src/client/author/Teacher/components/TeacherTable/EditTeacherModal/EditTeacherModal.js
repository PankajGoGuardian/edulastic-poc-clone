import {
  CheckboxLabel,
  CustomModalStyled,
  EduButton,
  TextInputStyled,
} from '@edulastic/common'
import { Col, Form, Row } from 'antd'
import { omit } from 'lodash'
import React, { Component } from 'react'
import { ButtonsContainer, ModalFormItem } from '../../../../../common/styled'

class EditTeacherModal extends Component {
  onSaveTeacher = () => {
    const { form } = this.props
    form.validateFields((err, row = {}) => {
      if (!err) {
        const { data, editTeacher, userOrgId } = this.props

        if (!row.password) row = omit(row, ['password'])
        row = omit(row, ['confirmPassword'])
        editTeacher({
          userId: data?._id,
          data: Object.assign(row, {
            districtId: userOrgId,
          }),
        })
        this.onCloseModal()
      }
    })
  }

  handleConfirmPassword = (rule, value, callback) => {
    const { form = {} } = this.props
    const { getFieldValue } = form
    const password = getFieldValue('password')
    const confirmPassword = getFieldValue('confirmPassword')

    if (password !== confirmPassword) return callback('Password does not match')

    callback() // no error
  }

  onCloseModal = () => {
    const { closeModal } = this.props
    closeModal()
  }

  render() {
    const {
      modalVisible,
      data: { _source },
      form: { getFieldDecorator },
      t,
    } = this.props
    return (
      <CustomModalStyled
        visible={modalVisible}
        title={t('users.teacher.editteacher.title')}
        onOk={this.onSaveTeacher}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <ButtonsContainer>
            <EduButton isGhost onClick={this.onCloseModal}>
              {t('users.teacher.editteacher.nocancel')}
            </EduButton>
            <EduButton onClick={this.onSaveTeacher}>
              {t('users.teacher.editteacher.yesupdate')}
            </EduButton>
          </ButtonsContainer>,
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('users.teacher.editteacher.firstname')}>
              {getFieldDecorator('firstName', {
                rules: [
                  {
                    required: true,
                    message: t(
                      'users.teacher.editteacher.validations.firstname'
                    ),
                  },
                ],
                initialValue: _source?.firstName,
              })(
                <TextInputStyled
                  placeholder={t('users.teacher.editteacher.enterfirstname')}
                />
              )}
            </ModalFormItem>
          </Col>
          <Col span={24}>
            <ModalFormItem label={t('users.teacher.editteacher.lastname')}>
              {getFieldDecorator('lastName', {
                rules: [
                  {
                    required: true,
                    message: t(
                      'users.teacher.editteacher.validations.lastname'
                    ),
                  },
                ],
                initialValue: _source?.lastName,
              })(
                <TextInputStyled
                  placeholder={t('users.teacher.editteacher.enterlastname')}
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('users.teacher.editteacher.email')}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: t('users.teacher.editteacher.validations.email'),
                  },
                  {
                    type: 'email',
                    message: t(
                      'users.teacher.editteacher.validations.invalidemail'
                    ),
                  },
                ],
                initialValue: _source?.email,
              })(
                <TextInputStyled
                  placeholder={t('users.teacher.editteacher.enteremail')}
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('users.teacher.editteacher.password')}>
              {getFieldDecorator(
                'password',
                {}
              )(
                <TextInputStyled
                  type="password"
                  placeholder={t('users.teacher.editteacher.enterpassword')}
                  autoComplete="off"
                  data-cy="passwordTextBox"
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem
              label={t('users.teacher.editteacher.confirmpassword')}
            >
              {getFieldDecorator('confirmPassword', {
                rules: [
                  {
                    validator: this.handleConfirmPassword,
                    message: t(
                      'users.teacher.editteacher.validations.invalidpassword'
                    ),
                  },
                ],
              })(
                <TextInputStyled
                  type="password"
                  autoComplete="off"
                  placeholder={t(
                    'users.teacher.editteacher.enterconfirmpassword'
                  )}
                  data-cy="confirmPasswordTextBox"
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {getFieldDecorator('isPowerTeacher', {
              initialValue: _source?.isPowerTeacher,
              valuePropName: 'checked',
            })(
              <CheckboxLabel data-cy="powerUserCheckBox">
                {t('users.teacher.powertools')}
              </CheckboxLabel>
            )}
          </Col>
        </Row>
      </CustomModalStyled>
    )
  }
}

const EditTeacherModalForm = Form.create()(EditTeacherModal)
export default EditTeacherModalForm
