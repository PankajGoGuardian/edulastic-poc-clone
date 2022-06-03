import { authApi } from '@edulastic/api'
import {
  CustomModalStyled,
  EduButton,
  TextInputStyled,
  CheckboxLabel,
} from '@edulastic/common'
import { Col, Form, Row } from 'antd'
import React from 'react'
import { ButtonsContainer, ModalFormItem } from '../../../../../common/styled'
import { validateEmail } from '../../../../../common/utils/helpers'

class CreateDistrictAdminModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      emailValidateStatus: 'success',
      emailValidateMsg: '',
      email: '',
      isSuperAdmin: false,
    }
  }

  onCreateDistrictAdmin = async () => {
    const { email, emailValidateStatus, isSuperAdmin } = this.state
    const { form, createDistrictAdmin } = this.props
    let checkUserResponse = { userExists: true }

    if (emailValidateStatus === 'success' && email.length > 0) {
      checkUserResponse = await authApi.checkUserExist({ email })
      if (
        checkUserResponse.userExists &&
        checkUserResponse.role === 'district-admin'
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

    form?.validateFields((err, row) => {
      if (!err) {
        if (
          checkUserResponse.userExists &&
          checkUserResponse.role === 'district-admin'
        )
          return

        const firstName = row.name.split(' ', 1)
        let lastName = ''
        if (firstName.length < row.name.length) {
          const lastNameIndex = firstName[0].length + 1
          lastName = row.name.substr(lastNameIndex, row.name.length)
        }
        const newUser = {
          firstName: firstName[0],
          lastName,
          password: row.password,
          email: this.state?.email,
          permissions: isSuperAdmin ? ['super_admin'] : [],
        }
        createDistrictAdmin(newUser)
      }
    })
  }

  onCloseModal = () => {
    const { closeModal } = this.props
    closeModal()
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

  changeSuperAdmin = (e) => this.setState({ isSuperAdmin: e.target.checked })

  render() {
    const { modalVisible, t, form } = this.props
    const { getFieldDecorator } = form
    const { emailValidateStatus, emailValidateMsg, isSuperAdmin } = this.state

    return (
      <CustomModalStyled
        visible={modalVisible}
        title={t('users.districtadmin.createda.title')}
        onOk={this.onCreateDistrictAdmin}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <ButtonsContainer>
            <EduButton
              isGhost
              onClick={this.onCloseModal}
              data-cy="CancelCreate"
            >
              {t('users.districtadmin.createda.nocancel')}
            </EduButton>
            <EduButton onClick={this.onCreateDistrictAdmin} data-cy="YesCreate">
              {t('users.districtadmin.createda.yescreate')}
            </EduButton>
          </ButtonsContainer>,
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('users.districtadmin.name')}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: t('users.districtadmin.createda.validations.name'),
                  },
                ],
              })(
                <TextInputStyled
                  placeholder={t('users.districtadmin.createda.entername')}
                  data-cy="nameTextBox"
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem
              label={t('users.districtadmin.username')}
              validateStatus={emailValidateStatus}
              help={emailValidateMsg}
              required
              type="email"
            >
              <TextInputStyled
                placeholder={t('users.districtadmin.createda.enterusername')}
                autocomplete="new-password"
                onChange={this.changeEmail}
                data-cy="emailTextBox"
              />
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('users.districtadmin.password')}>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: t(
                      'users.districtadmin.createda.validations.password'
                    ),
                  },
                ],
              })(
                <TextInputStyled
                  placeholder={t('users.districtadmin.createda.enterpassword')}
                  type="password"
                  autocomplete="new-password"
                  data-cy="passwordTextBox"
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <CheckboxLabel
              checked={isSuperAdmin}
              onChange={this.changeSuperAdmin}
              data-cy="superAdminCheckbox"
              data-testid="superAdminCheckbox"
            >
              {t('users.districtadmin.superAdmin')}
            </CheckboxLabel>
          </Col>
        </Row>
      </CustomModalStyled>
    )
  }
}

const CreateDistrictAdminModalForm = Form.create()(CreateDistrictAdminModal)
export default CreateDistrictAdminModalForm
