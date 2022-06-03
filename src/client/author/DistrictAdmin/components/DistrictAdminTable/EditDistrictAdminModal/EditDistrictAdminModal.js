import React, { Component } from 'react'
import { Form, Input, Row, Col } from 'antd'
import {
  CheckboxLabel,
  CustomModalStyled,
  EduButton,
  TextInputStyled,
} from '@edulastic/common'
import { omit } from 'lodash'
import { ButtonsContainer, ModalFormItem } from '../../../../../common/styled'

class EditDistrictAdminModal extends Component {
  onSaveDistrictAdmin = () => {
    this.props?.form.validateFields((err, row) => {
      if (!err) {
        const { districtAdminData, updateDistrictAdmin, userOrgId } = this.props
        const { isSuperAdmin } = row
        const { permissions: currPermissions = [] } = districtAdminData?._source

        if (!row.password) row = omit(row, ['password'])
        row = omit(row, ['confirmPassword', 'isSuperAdmin'])

        const permissions = isSuperAdmin
          ? [...new Set([...currPermissions, 'super_admin'])]
          : currPermissions.filter((permission) => permission !== 'super_admin')

        updateDistrictAdmin({
          userId: districtAdminData._id,
          data: Object.assign(row, {
            districtId: userOrgId,
            permissions,
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
    const { getFieldDecorator } = this.props?.form
    const {
      modalVisible,
      districtAdminData: { _source },
      t,
    } = this.props
    const isSuperAdmin = _source?.permissions.includes('super_admin')

    return (
      <CustomModalStyled
        visible={modalVisible}
        title={t('users.districtadmin.editda.title')}
        onOk={this.onCreateSchoolAdmin}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <ButtonsContainer>
            <EduButton isGhost onClick={this.onCloseModal} data-cy="CancelEdit">
              {t('users.districtadmin.editda.nocancel')}
            </EduButton>
            <EduButton onClick={this.onSaveDistrictAdmin} data-cy="YesEdit">
              {t('users.districtadmin.editda.yesupdate')}
            </EduButton>
          </ButtonsContainer>,
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('users.districtadmin.firstname')}>
              {getFieldDecorator('firstName', {
                rules: [
                  {
                    required: true,
                    message: t(
                      'users.districtadmin.editda.validations.firstname'
                    ),
                  },
                ],
                initialValue: _source.firstName,
              })(
                <Input
                  placeholder={t('users.districtadmin.editda.enterfirstname')}
                  data-cy="firstNameTextBox"
                />
              )}
            </ModalFormItem>
          </Col>
          <Col span={24}>
            <ModalFormItem label={t('users.districtadmin.lastname')}>
              {getFieldDecorator('lastName', {
                rules: [
                  {
                    required: true,
                    message: t(
                      'users.districtadmin.editda.validations.lastname'
                    ),
                  },
                ],
                initialValue: _source.lastName,
              })(
                <Input
                  placeholder={t('users.districtadmin.editda.enterlastname')}
                  data-cy="lastNameTextBox"
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('users.districtadmin.email')}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: t('users.districtadmin.editda.validations.email'),
                  },
                  {
                    type: 'email',
                    message: t(
                      'users.districtadmin.editda.validations.invalidemail'
                    ),
                  },
                ],
                initialValue: _source.email,
              })(
                <Input
                  placeholder={t('users.districtadmin.editda.enteremail')}
                  data-cy="emailTextBox"
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('users.districtadmin.editda.password')}>
              {getFieldDecorator(
                'password',
                {}
              )(
                <TextInputStyled
                  type="password"
                  autoComplete="off"
                  placeholder={t('users.districtadmin.editda.enterpassword')}
                  data-cy="passwordTextBox"
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem
              label={t('users.districtadmin.editda.confirmpassword')}
            >
              {getFieldDecorator('confirmPassword', {
                rules: [
                  {
                    validator: this.handleConfirmPassword,
                    message: t(
                      'users.districtadmin.editda.validations.invalidpassword'
                    ),
                  },
                ],
              })(
                <TextInputStyled
                  type="password"
                  autoComplete="off"
                  placeholder={t(
                    'users.districtadmin.editda.enterconfirmpassword'
                  )}
                  data-cy="confirmPasswordTextBox"
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem style={{ margin: '0px' }}>
              {getFieldDecorator('isSuperAdmin', {
                initialValue: isSuperAdmin,
                valuePropName: 'checked',
              })(
                <CheckboxLabel
                  data-cy="superAdminCheckbox"
                  data-testid="superAdminCheckbox"
                >
                  {t('users.districtadmin.superAdmin')}
                </CheckboxLabel>
              )}
            </ModalFormItem>
          </Col>
        </Row>
      </CustomModalStyled>
    )
  }
}

const EditDistrictAdminModalForm = Form.create()(EditDistrictAdminModal)
export default EditDistrictAdminModalForm
