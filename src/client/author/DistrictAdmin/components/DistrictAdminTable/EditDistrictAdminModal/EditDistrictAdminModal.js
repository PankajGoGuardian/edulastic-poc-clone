import React, { Component } from 'react'
import { Form, Input, Row, Col, Select, Tooltip } from 'antd'
import {
  CheckboxLabel,
  CustomModalStyled,
  EduButton,
  SelectInputStyled,
  TextInputStyled,
} from '@edulastic/common'
import { omit } from 'lodash'
import { userPermissions } from '@edulastic/constants'
import { IconInfo } from '@edulastic/icons'
import { ButtonsContainer, ModalFormItem } from '../../../../../common/styled'
import FeaturesSwitch from '../../../../../features/components/FeaturesSwitch'

import { daRoleList } from '../helpers'

class EditDistrictAdminModal extends Component {
  onSaveDistrictAdmin = () => {
    this.props?.form.validateFields((err, row) => {
      if (!err) {
        const { districtAdminData, updateDistrictAdmin, userOrgId } = this.props
        const { isSuperAdmin, daRole } = row
        const { permissions: currPermissions = [] } = districtAdminData?._source

        if (!row.password) row = omit(row, ['password'])
        row = omit(row, ['confirmPassword', 'isSuperAdmin', 'daRole'])

        const permissions = currPermissions.filter(
          (p) =>
            ![
              userPermissions.SUPER_ADMIN,
              userPermissions.DATA_OPS,
              userPermissions.DATA_OPS_ONLY,
            ].includes(p)
        )
        if (isSuperAdmin) {
          permissions.push(userPermissions.SUPER_ADMIN)
        }
        if (daRole !== daRoleList[0].value) {
          permissions.push(daRole)
        }

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
    const isSuperAdmin = _source?.permissions.includes(
      userPermissions.SUPER_ADMIN
    )

    let daRole = daRoleList[0].value
    if (
      _source?.permissions.includes(userPermissions.DATA_OPS) ||
      _source?.permissions.includes(userPermissions.DATA_OPS_ONLY)
    ) {
      daRole = (
        daRoleList.find((item) => _source?.permissions.includes(item.value)) ||
        daRoleList[0]
      ).value
    }

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
        <FeaturesSwitch
          inputFeatures="isDataWarehouseEnabled"
          actionOnInaccessible="hidden"
        >
          <Row>
            <Col span={24}>
              <ModalFormItem label={t('users.districtadmin.editda.selectrole')}>
                {getFieldDecorator('daRole', {
                  initialValue: daRole,
                })(
                  <SelectInputStyled
                    data-cy="selectRole"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {daRoleList.map((item) => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                        <Tooltip title={item.tooltipTitle}>
                          <IconInfo height={10} />
                        </Tooltip>
                      </Select.Option>
                    ))}
                  </SelectInputStyled>
                )}
              </ModalFormItem>
            </Col>
          </Row>
        </FeaturesSwitch>
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
