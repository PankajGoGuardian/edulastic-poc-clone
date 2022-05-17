import React, { useState, useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Modal, Button, Icon, Form, Input } from 'antd'
import { get } from 'lodash'
import { withNamespaces } from '@edulastic/localization'
import { white, greenDark, orange } from '@edulastic/colors'
import qs from 'qs'
import {
  resetPasswordUserAction,
  resetPasswordAction,
} from '../../student/Login/ducks'

const ResetPasswordPopup = (props) => {
  const {
    className,
    t,
    resetPasswordAction,
    resetPasswordUserAction,
    user,
  } = props
  const { resetPasswordUser, requestingNewPassword } = user

  useEffect(() => {
    const params = qs.parse(window.location.search, { ignoreQueryPrefix: true })
    resetPasswordUserAction(params)
  }, [])

  const onCancel = () => {
    window.location.replace('/')
  }

  const onSubmit = (password) => {
    const urlParams = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    })
    const params = {
      ...urlParams,
      password,
    }
    resetPasswordAction(params)
  }

  return (
    <>
      {resetPasswordUser ? (
        <Modal visible footer={null} className={className} width="500px">
          <div className="forgot-password-actions">
            <p>Reset Password</p>
            <p>
              Hi, <Icon type="user" />{' '}
              {`${
                resetPasswordUser.firstName
                  ? `${resetPasswordUser.firstName} `
                  : ''
              } ${
                resetPasswordUser.middleName
                  ? `${resetPasswordUser.middleName} `
                  : ''
              }${resetPasswordUser.lastName ? resetPasswordUser.lastName : ''}`}
            </p>
            <ConnectedInputPasswordForm
              onSubmit={onSubmit}
              onCancel={onCancel}
              t={t}
              requestingNewPassword={requestingNewPassword}
            />
          </div>
        </Modal>
      ) : null}
    </>
  )
}

const InputPasswordForm = (props) => {
  const { getFieldDecorator, getFieldError, setFields } = props.form
  const { t, onCancel, onSubmit: _onSubmit, requestingNewPassword } = props
  const [passwd, setPasswd] = useState('')
  const [confPasswd, setConfPasswd] = useState('')

  const onNewPasswordChange = (event) => {
    setPasswd(event.currentTarget.value)
  }

  const onConfirmPasswordChange = (event) => {
    setConfPasswd(event.currentTarget.value)
  }

  const checkPassword = (rule, value, callback) => {
    if (value.length < 4) {
      callback(t('component.signup.teacher.shortpassword'))
    } else if (value.includes(' ')) {
      callback(t('component.signup.teacher.validpassword'))
    } else if (value !== confPasswd) {
      callback(t("Passwords don't match"))
    }
    callback()
  }

  const checkConfirmPassword = (rule, value, callback) => {
    if (value.length < 4) {
      callback(t('component.signup.teacher.shortpassword'))
    } else if (value.includes(' ')) {
      callback(t('component.signup.teacher.validpassword'))
    } else if (value !== passwd) {
      callback(t("Passwords don't match"))
    }
    callback()
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const { form } = props
    form.validateFieldsAndScroll((err, { newPassword, confirmPassword }) => {
      _onSubmit(newPassword)
    })
  }

  const newPasswordError = getFieldError('newPassword')
  const confirmPasswordError = getFieldError('confirmPassword')
  if (
    ((newPasswordError && !confirmPasswordError) ||
      (!newPasswordError && confirmPasswordError)) &&
    passwd === confPasswd
  ) {
    setFields({ newPassword: { value: passwd, errors: undefined } })
    setFields({ confirmPassword: { value: confPasswd, errors: undefined } })
  }
  return (
    <Form onSubmit={onSubmit} autoComplete="new-password">
      <Form.Item
        validateStatus={newPasswordError ? 'error' : 'success'}
        help={newPasswordError}
      >
        {getFieldDecorator('newPassword', {
          validateTrigger: ['onChange', 'onBlur'],
          validateFirst: true,
          initialValue: '',
          rules: [
            {
              required: true,
              message: t('component.signup.teacher.validpassword'),
            },
            {
              validator: checkPassword,
            },
          ],
        })(
          <Input
            className="password-input"
            type="password"
            placeholder="New Password"
            autoComplete="new-password"
            prefix={<Icon type="key" style={{ color: 'white' }} />}
            onChange={onNewPasswordChange}
          />
        )}
      </Form.Item>
      <Form.Item
        validateStatus={confirmPasswordError ? 'error' : 'success'}
        help={confirmPasswordError}
      >
        {getFieldDecorator('confirmPassword', {
          validateTrigger: ['onChange', 'onBlur'],
          validateFirst: true,
          initialValue: '',
          rules: [
            {
              required: true,
              message: t('component.signup.teacher.validpassword'),
            },
            {
              validator: checkConfirmPassword,
            },
          ],
        })(
          <Input
            className="password-input"
            type="password"
            placeholder="Confirm Password"
            autoComplete="new-password"
            prefix={<Icon type="key" style={{ color: 'white' }} />}
            onChange={onConfirmPasswordChange}
            data-cy="confirmPasswordTextBox"
          />
        )}
      </Form.Item>
      <div className="model-buttons">
        <Form.Item>
          <Button className="cancel-button" key="cancel" onClick={onCancel}>
            Cancel
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            className="reset-password-button"
            key="resetPassword"
            htmlType="submit"
            disabled={requestingNewPassword}
          >
            Reset Password
          </Button>
        </Form.Item>
      </div>
    </Form>
  )
}

const ConnectedInputPasswordForm = Form.create({ name: 'resetPasswordForm' })(
  InputPasswordForm
)

const StyledResetPasswordPopup = styled(ResetPasswordPopup)`
  .ant-modal-content {
    background-color: #40444f;
    color: ${white};
    .ant-modal-close {
      display: none;
    }
    .forgot-password-actions {
      display: flex;
      justify-content: center;
      flex-direction: column;
      text-align: center;

      p {
        margin: 13px;
      }

      form {
        display: contents;

        .ant-row {
          margin: 13px;
      }

      .password-input {
        input {
          background-color: #40444f;
          color: white;
        }
      }

      .model-buttons {
        display: flex;
        justify-content: space-between;
        margin: 8px;
        button {
          height: 40px;
          background-color: transparent;
          border: none;
          border-radius: 5px;
          font-weight: 600;
          margin: 0 5px;
        }
        .cancel-button {
          border: solid 1px ${orange};
          color: ${orange};
        }
        .reset-password-button {
          border: solid 1px ${greenDark};
          color: ${greenDark};
        }
      }
    }
  }
`

const enhance = compose(
  withNamespaces('login'),
  connect(
    (state) => ({
      user: get(state, 'user', null),
    }),
    { resetPasswordAction, resetPasswordUserAction }
  )
)

const ConnectedStyledResetPasswordPopup = enhance(StyledResetPasswordPopup)

export { ConnectedStyledResetPasswordPopup as ResetPasswordPopup }
