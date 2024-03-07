import {
  CheckboxLabel,
  CustomModalStyled,
  EduButton,
  SelectInputStyled,
  TextInputStyled,
} from '@edulastic/common'
import { Col, Form, Row, Select, Tooltip } from 'antd'
import { omit, uniqBy } from 'lodash'
import React, { Component } from 'react'
import { ButtonsContainer, ModalFormItem } from '../../../../../common/styled'
import { userPermissions, roleuser } from '@edulastic/constants'
import { IconInfo } from '@edulastic/icons'
import { canEnableInsightOnly } from '../../../../DistrictAdmin/components/DistrictAdminTable/helpers'

const Option = Select.Option

class EditSchoolAdminModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      insightNotSupRoleChecked: props?.schoolAdminData?._source?.permissions.some(
        (permission) =>
          [userPermissions.SUPER_ADMIN, userPermissions.DATA_OPS].includes(
            permission
          )
      ),
    }
  }
  onSaveSchoolAdmin = () => {
    this.props?.form.validateFields((err, row = {}) => {
      if (!err) {
        const { schoolAdminData, updateSchoolAdmin, userOrgId } = this.props
        const { isSuperAdmin, isInsightsOnly } = row
        const { permissions: currPermissions = [] } = schoolAdminData?._source

        if (!row.password) row = omit(row, ['password'])
        row = omit(row, ['confirmPassword', 'isSuperAdmin', 'isInsightsOnly'])

        let permissions = isSuperAdmin
          ? [
              ...currPermissions.filter(
                (permission) => permission !== userPermissions.INSIGHTS_ONLY
              ),
              'super_admin',
            ]
          : currPermissions.filter((permission) => permission !== 'super_admin')

        const enableInsightOnly = canEnableInsightOnly(permissions)

        if (enableInsightOnly && isInsightsOnly) {
          permissions.push(userPermissions.INSIGHTS_ONLY)
        } else if (
          !isInsightsOnly &&
          permissions.includes(userPermissions.INSIGHTS_ONLY)
        ) {
          permissions = permissions.filter(
            (permission) => permission !== userPermissions.INSIGHTS_ONLY
          )
        }
        updateSchoolAdmin({
          userId: schoolAdminData._id,
          data: Object.assign(row, {
            districtId: userOrgId,
            permissions: [...new Set(permissions)],
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
  handelSuperAdminChange = (e) => {
    const { form } = this.props
    if (e.target.checked) {
      form.setFieldsValue({ isInsightsOnly: !e.target.checked })
    }
    this.setState({
      insightNotSupRoleChecked: e.target.checked,
    })
  }

  render() {
    const {
      modalVisible,
      schoolAdminData: { _source },
      schoolsList = [],
      t,
      role,
    } = this.props
    const { insightNotSupRoleChecked } = this.state
    const isSuperAdmin = _source?.permissions.includes('super_admin')
    const isInsightsOnly = _source?.permissions.includes(
      userPermissions.INSIGHTS_ONLY
    )

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
      <Option key={index} value={row?._id} label={row?.name}>
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
                  showSearch
                  optionFilterProp="label"
                >
                  {schoolsOptions}
                </SelectInputStyled>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={7}>
            <ModalFormItem style={{ margin: '0px' }}>
              {getFieldDecorator('isSuperAdmin', {
                initialValue: isSuperAdmin,
                valuePropName: 'checked',
              })(
                <CheckboxLabel
                  data-cy="superAdminCheckbox"
                  data-testid="superAdminCheckbox"
                  onChange={this.handelSuperAdminChange}
                >
                  {t('users.schooladmin.superAdmin')}
                </CheckboxLabel>
              )}
            </ModalFormItem>
          </Col>
          <Col span={9}>
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
          {role === roleuser.DISTRICT_ADMIN && (
            <Col span={7}>
              <ModalFormItem style={{ margin: '0px' }}>
                {getFieldDecorator('isInsightsOnly', {
                  initialValue: isInsightsOnly,
                  valuePropName: 'checked',
                })(
                  <CheckboxLabel
                    data-cy="insightsOnlyCheckbox"
                    data-testid="insightsOnlyCheckbox"
                    disabled={insightNotSupRoleChecked}
                  >
                    {t('users.schooladmin.insightsOnly.title')}
                    <Tooltip title={t('users.schooladmin.insightsOnly.text')}>
                      <IconInfo height={10} />
                    </Tooltip>
                  </CheckboxLabel>
                )}
              </ModalFormItem>
            </Col>
          )}
        </Row>
      </CustomModalStyled>
    )
  }
}

const EditSchoolAdminModalForm = Form.create()(EditSchoolAdminModal)
export default EditSchoolAdminModalForm
