import { authApi, schoolApi } from '@edulastic/api'
import {
  CheckboxLabel,
  CustomModalStyled,
  EduButton,
  SelectInputStyled,
  TextInputStyled,
} from '@edulastic/common'
import { Col, Form, Row, Select, Spin } from 'antd'
import React from 'react'
import { ButtonsContainer, ModalFormItem } from '../../../../../common/styled'
import {
  nameValidator,
  validateEmail,
} from '../../../../../common/utils/helpers'

const Option = Select.Option

class CreateSchoolAdminModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      emailValidateStatus: 'success',
      emailValidateMsg: '',
      email: '',
      schoolList: [],
      fetching: false,
      isPowerTeacher: false,
    }
  }

  onCreateSchoolAdmin = async () => {
    const { email, emailValidateStatus } = this.state
    let checkUserResponse = { userExists: true }

    if (emailValidateStatus === 'success' && email.length > 0) {
      checkUserResponse = await authApi.checkUserExist({ email })
      if (
        checkUserResponse.userExists &&
        checkUserResponse.role === 'school-admin'
      ) {
        this.setState({
          emailValidateStatus: 'error',
          emailValidateMsg: 'Username already exists',
        })
      }
    } else if (email.length == 0) {
      this.setState({
        emailValidateStatus: 'error',
        emailValidateMsg: 'Please input Email',
      })
    } else if (validateEmail(email)) {
      this.setState({
        emailValidateStatus: 'error',
        emailValidateMsg: 'Username already exists',
      })
    } else {
      this.setState({
        emailValidateStatus: 'error',
        emailValidateMsg: 'Please input valid Email',
      })
    }

    this.props.form.validateFields((err, row) => {
      if (!err) {
        if (
          checkUserResponse.userExists &&
          checkUserResponse.role === 'school-admin'
        )
          return

        const firstName = row.name.split(' ', 1)
        let lastName = ''
        if (firstName.length < row.name.length) {
          const lastNameIndex = firstName[0].length + 1
          lastName = row.name.substr(lastNameIndex, row.name.length)
        }

        const institutionIds = []
        for (let i = 0; i < row.institutionIds.length; i++) {
          institutionIds.push(row.institutionIds[i].key)
        }

        const { email: _email, isPowerTeacher } = this.state
        const newUser = {
          firstName: firstName[0],
          lastName,
          password: row.password,
          email: _email,
          institutionIds,
          isPowerTeacher,
        }
        this.props.createSchoolAdmin(newUser)
      }
    })
  }

  onCloseModal = () => {
    this.props.closeModal()
  }

  changeEmail = (e) => {
    if (e.target.value.length === 0) {
      this.setState({
        emailValidateStatus: 'error',
        emailValidateMsg: 'Please input Email',
        email: e.target.value,
      })
    } else if (validateEmail(e.target.value)) {
      this.setState({
        emailValidateStatus: 'success',
        emailValidateMsg: '',
        email: e.target.value,
      })
    } else {
      this.setState({
        emailValidateStatus: 'error',
        emailValidateMsg: 'Please input valid Email',
        email: e.target.value,
      })
    }
  }

  fetchSchool = async (value) => {
    this.setState({ schoolList: [], fetching: true })
    const searchParam = value
      ? { search: { name: [{ type: 'cont', value }] } }
      : {}
    const schoolListData = await schoolApi.getSchools({
      districtId: this.props.userOrgId,
      limit: 25,
      page: 1,
      sortField: 'name',
      order: 'asc',
      ...searchParam,
    })
    this.setState({ schoolList: schoolListData.data, fetching: false })
  }

  handleChange = (value) => {
    this.props.form.setFieldsValue({ institutionIds: value })
    this.setState({
      schoolList: [],
      fetching: false,
    })
  }

  changePowerTool = (e) => this.setState({ isPowerTeacher: e.target.checked })

  validateName = (rule, value, callback) => {
    const { t } = this.props
    if (!nameValidator(value)) {
      callback(t('users.schooladmin.createsa.validations.name'))
    } else {
      callback()
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { modalVisible, t } = this.props
    const {
      emailValidateStatus,
      emailValidateMsg,
      fetching,
      schoolList,
      isPowerTeacher,
    } = this.state

    return (
      <CustomModalStyled
        visible={modalVisible}
        title={t('users.schooladmin.createsa.title')}
        onOk={this.onCreateSchoolAdmin}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <ButtonsContainer>
            <EduButton isGhost onClick={this.onCloseModal}>
              {t('users.schooladmin.createsa.nocancel')}
            </EduButton>
            <EduButton onClick={this.onCreateSchoolAdmin}>
              {t('users.schooladmin.createsa.yescreate')}
            </EduButton>
          </ButtonsContainer>,
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('users.schooladmin.name')}>
              {getFieldDecorator('name', {
                validateTrigger: ['onBlur'],
                rules: [
                  {
                    validator: this.validateName,
                  },
                ],
              })(
                <TextInputStyled
                  placeholder={t('users.schooladmin.createsa.entername')}
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem
              label={t('users.schooladmin.username')}
              validateStatus={emailValidateStatus}
              help={emailValidateMsg}
              required
              type="email"
            >
              <TextInputStyled
                placeholder={t('users.schooladmin.createsa.enteremail')}
                autocomplete="new-password"
                onChange={this.changeEmail}
              />
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('users.schooladmin.password')}>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: t(
                      'users.schooladmin.createsa.validations.password'
                    ),
                  },
                ],
              })(
                <TextInputStyled
                  placeholder={t('users.schooladmin.createsa.enterpassword')}
                  type="password"
                  autocomplete="new-password"
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
                    message: t('users.schooladmin.createsa.validations.school'),
                  },
                ],
              })(
                <SelectInputStyled
                  mode="multiple"
                  labelInValue
                  placeholder={t('users.schooladmin.createsa.selectschool')}
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.fetchSchool}
                  onChange={this.handleChange}
                  onFocus={this.fetchSchool}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {schoolList.map((school) => (
                    <Option key={school._id} value={school._id}>
                      {school._source.name}
                    </Option>
                  ))}
                </SelectInputStyled>
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <CheckboxLabel
              checked={isPowerTeacher}
              onChange={this.changePowerTool}
            >
              {t('users.schooladmin.powertools')}
            </CheckboxLabel>
          </Col>
        </Row>
      </CustomModalStyled>
    )
  }
}

const CreateSchoolAdminModalForm = Form.create()(CreateSchoolAdminModal)
export default CreateSchoolAdminModalForm
