import {
  CheckboxLabel,
  CustomModalStyled,
  EduButton,
  SelectInputStyled,
  TextInputStyled,
} from '@edulastic/common'
import { Col, Form, Row, Select } from 'antd'
import { omit, uniqBy } from 'lodash'
import React, { Component } from 'react'
import { ButtonsContainer, ModalFormItem } from '../../../../../common/styled'

const Option = Select.Option

class EditSchoolAdminModal extends Component {
  onSaveSchoolAdmin = () => {
    this.props?.form.validateFields((err, row = {}) => {
      if (!err) {
        const { schoolAdminData, updateSchoolAdmin, userOrgId } = this.props
        const { isSuperAdmin } = row
        const { permissions: currPermissions = [] } = schoolAdminData?._source

        if (!row.password) row = omit(row, ['password'])
        row = omit(row, ['confirmPassword', 'isSuperAdmin'])

        const permissions = isSuperAdmin
          ? [...new Set([...currPermissions, 'super_admin'])]
          : currPermissions.filter((permission) => permission !== 'super_admin')

        updateSchoolAdmin({
          userId: schoolAdminData._id,
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
    const {
      modalVisible,
      schoolAdminData: { _source },
      schoolsList = [],
      t,
    } = this.props
    const isSuperAdmin = _source?.permissions.includes('super_admin')

    let { institutionDetails = [] } = _source
    let schooleFinalList = [...schoolsList]
    if (institutionDetails.length) {
      institutionDetails = institutionDetails
        .filter(({ id = '', name = '' }) => id && name)
        .map(({ id, name }) => ({ _id: id, name }))
      schooleFinalList = uniqBy(
        [...schooleFinalList, ...institutionDetails],
        '_id'
      )
    }

    const schoolsOptions = schooleFinalList.map((row, index) => (
      <Option key={index} value={row?._id}>
        {row?.name}
      </Option>
    ))

    const { getFieldDecorator } = this.props?.form
    return (
      <CustomModalStyled
        visible={modalVisible}
        title={t('users.schooladmin.editsa.title')}
        onOk={this.onCreateSchoolAdmin}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <ButtonsContainer>
            <EduButton isGhost onClick={this.onCloseModal} data-cy="CancelEdit">
              {t('users.schooladmin.editsa.nocancel')}
            </EduButton>
            <EduButton onClick={this.onSaveSchoolAdmin} data-cy="YesEdit">
              {t('users.schooladmin.editsa.yesupdate')}
            </EduButton>
          </ButtonsContainer>,
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('users.schooladmin.firstname')}>
              {getFieldDecorator('firstName', {
                rules: [
                  {
                    required: true,
                    message: t(
                      'users.schooladmin.editsa.validations.firstname'
                    ),
                  },
                ],
                initialValue: _source.firstName,
              })(
                <TextInputStyled
                  placeholder={t('users.schooladmin.editsa.enterfirstname')}
                  data-cy="firstNameTextBox"
                />
              )}
            </ModalFormItem>
          </Col>
          <Col span={24}>
            <ModalFormItem label={t('users.schooladmin.lastname')}>
              {getFieldDecorator('lastName', {
                rules: [
                  {
                    required: true,
                    message: t('users.schooladmin.editsa.validations.lastname'),
                  },
                ],
                initialValue: _source.lastName,
              })(
                <TextInputStyled
                  placeholder={t('users.schooladmin.editsa.enterlastname')}
                  data-cy="lastNameTextBox"
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('users.schooladmin.email')}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: t('users.schooladmin.editsa.validations.email'),
                  },
                  {
                    type: 'email',
                    message: t(
                      'users.schooladmin.editsa.validations.invalidemail'
                    ),
                  },
                ],
                initialValue: _source.email,
              })(
                <TextInputStyled
                  placeholder={t('users.schooladmin.editsa.enteremail')}
                  data-cy="emailTextBox"
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('users.schooladmin.editsa.password')}>
              {getFieldDecorator(
                'password',
                {}
              )(
                <TextInputStyled
                  type="password"
                  autoComplete="off"
                  placeholder={t('users.schooladmin.editsa.enterpassword')}
                  data-cy="passwordTextBox"
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem
              label={t('users.schooladmin.editsa.confirmpassword')}
            >
              {getFieldDecorator('confirmPassword', {
                rules: [
                  {
                    validator: this.handleConfirmPassword,
                    message: t(
                      'users.schooladmin.editsa.validations.invalidpassword'
                    ),
                  },
                ],
              })(
                <TextInputStyled
                  type="password"
                  autoComplete="off"
                  placeholder={t(
                    'users.schooladmin.editsa.enterconfirmpassword'
                  )}
                  data-cy="confirmPasswordTextBox"
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('users.schooladmin.school')}>
              {getFieldDecorator('institutionIds', {
                rules: [
                  {
                    required: true,
                    message: t('users.schooladmin.editsa.validations.school'),
                  },
                ],
                initialValue: _source.institutionIds,
              })(
                <SelectInputStyled
                  mode="multiple"
                  placeholder={t('users.schooladmin.editsa.selectschool')}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  data-cy="selectSchools"
                  data-testid="selectSchools"
                >
                  {schoolsOptions}
                </SelectInputStyled>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={9}>
            <ModalFormItem style={{ margin: '0px' }}>
              {getFieldDecorator('isSuperAdmin', {
                initialValue: isSuperAdmin,
                valuePropName: 'checked',
              })(
                <CheckboxLabel
                  data-cy="superAdminCheckbox"
                  data-testid="superAdminCheckbox"
                >
                  {t('users.schooladmin.superAdmin')}
                </CheckboxLabel>
              )}
            </ModalFormItem>
          </Col>
          <Col span={12}>
            <ModalFormItem style={{ margin: '0px' }}>
              {getFieldDecorator('isPowerTeacher', {
                initialValue: _source?.isPowerTeacher,
                valuePropName: 'checked',
              })(
                <CheckboxLabel
                  data-cy="powerUserCheckBox"
                  data-testid="powerUserCheckBox"
                >
                  {t('users.schooladmin.powertools')}
                </CheckboxLabel>
              )}
            </ModalFormItem>
          </Col>
        </Row>
      </CustomModalStyled>
    )
  }
}

const EditSchoolAdminModalForm = Form.create()(EditSchoolAdminModal)
export default EditSchoolAdminModalForm
