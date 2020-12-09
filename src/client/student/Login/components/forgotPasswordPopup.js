import React, { useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Modal from "antd/es/modal";
import Button from "antd/es/button";
import Input from "antd/es/input";
import Icon from "antd/es/icon";
import Form from "antd/es/form";
import { get, trim } from 'lodash'
import { white, greenDark, orange } from '@edulastic/colors'
import { withNamespaces } from '@edulastic/localization'
import { isEmailValid } from '../../../common/utils/helpers'
import {
  requestNewPasswordAction,
  requestNewPasswordResetControlAction,
} from '../ducks'

const ForgotPasswordPopup = (props) => {
  const {
    visible,
    className,
    onCancel,
    onOk,
    t,
    requestNewPassword,
    user,
    districtPolicy,
    requestNewPasswordResetControl,
  } = props
  const { requestingNewPassword, requestNewPasswordSuccess } = user

  useEffect(() => {
    requestNewPasswordResetControl()
  }, [])

  const onCancelForgotPassword = () => {
    onCancel()
  }

  const onSendLink = (email) => {
    requestNewPassword({ email, districtId: districtPolicy.orgId })
  }

  const onClickTryAgain = () => {
    requestNewPasswordResetControl()
  }

  const onClickClose = () => {
    onCancel()
  }

  return (
    <Modal
      visible={visible}
      footer={null}
      className={className}
      width="500px"
      onCancel={onCancelForgotPassword}
      destroyOnClose
    >
      <div className="third-party-signup-select-role">
        {!requestNewPasswordSuccess ? (
          <div className="link-not-sent">
            <p>Forgot Password?</p>
            <p>Username or Email</p>
            <ConnectedForgotPasswordForm
              onSubmit={onSendLink}
              onCancel={onCancelForgotPassword}
              t={t}
              requestingNewPassword={requestingNewPassword}
            />
          </div>
        ) : requestNewPasswordSuccess.result === 'error' ? (
          <div className="link-sent-failed">
            <div className="message-container">
              <p>
                <Icon type="close-circle" />
              </p>
              <p>{requestNewPasswordSuccess.message}</p>
            </div>
            <div className="model-buttons">
              <Button
                className="try-again-button"
                key="tryAgain"
                onClick={onClickTryAgain}
              >
                Try Again
              </Button>
              <Button
                className="close-button"
                key="close"
                onClick={onClickClose}
              >
                Go back to SignIn page
              </Button>
            </div>
          </div>
        ) : (
          <div className="link-sent">
            <div className="message-container">
              <p>
                <Icon type="check" /> You've got mail
              </p>
              <p>
                We sent you an email with instruction on how to reset your
                password.
              </p>
            </div>
            <div className="model-buttons">
              <Button
                className="close-button"
                key="close"
                onClick={onClickClose}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

const ForgotPasswordForm = (props) => {
  const { getFieldDecorator } = props.form
  const { t, onCancel, onSubmit: _onSubmit, requestingNewPassword } = props

  const onSubmit = (event) => {
    event.preventDefault()
    const { form } = props
    form.validateFieldsAndScroll((err, { email }) => {
      if (!err) {
        _onSubmit(email)
      }
    })
  }

  return (
    <Form onSubmit={onSubmit} autoComplete="new-password">
      <Form.Item>
        {getFieldDecorator('email', {
          validateFirst: true,
          initialValue: '',
          rules: [
            {
              transform: (value) => trim(value),
            },
            {
              required: true,
              message: t('common.forgotpassworderror'),
            },
            {
              type: 'string',
              message: t('common.forgotpassworderror'),
            },
            {
              validator: (rule, value, callback) =>
                isEmailValid(
                  rule,
                  value,
                  callback,
                  'both',
                  t('common.forgotpassworderror')
                ),
            },
          ],
        })(
          <Input
            className="email-input"
            placeholder="Enter Registered Username or Email"
            autoComplete="new-password"
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
            className="send-link-button"
            key="sendLink"
            htmlType="submit"
            disabled={requestingNewPassword}
          >
            Send Link
          </Button>
        </Form.Item>
      </div>
    </Form>
  )
}

const ConnectedForgotPasswordForm = Form.create({ name: 'forgotPasswordForm' })(
  ForgotPasswordForm
)

const StyledForgotPasswordPopup = styled(ForgotPasswordPopup)`
  .ant-modal-content {
    background-color: #40444f;
    color: ${white};
    .ant-modal-close {
      border: solid 3px white;
      border-radius: 20px;
      color: white;
      margin: -17px;
      height: 35px;
      width: 35px;
      .ant-modal-close-x {
        height: 100%;
        width: 100%;
        line-height: normal;
        padding: 5px;
        path {
          stroke: white;
          stroke-width: 150;
          fill: white;
        }
      }
    }
    .third-party-signup-select-role {
      display: flex;
      justify-content: center;
      flex-direction: column;
      text-align: center;

      p {
        text-align: left;
        margin: 13px;
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
      }

      .link-not-sent {
        display: contents;

        form {
          display: contents;

          .ant-row {
            margin: 13px;

            .email-input {
              background-color: #40444f;
              color: white;
            }
          }
        }

        .model-buttons {
          .cancel-button {
            border: solid 1px ${greenDark};
            color: ${greenDark};
          }
          .send-link-button {
            border: solid 1px ${orange};
            color: ${orange};
          }
        }
      }
      .link-sent {
        display: contents;
        .message-container {
          i {
            border: solid 3px green;
            border-radius: 20px;
            font-size: 25px;
            padding: 5px;
            background-color: green;
            margin: 5px;
          }
        }
        .model-buttons {
          .close-button {
            border: solid 1px ${greenDark};
            color: ${greenDark};
          }
        }
      }

      .link-sent-failed {
        display: contents;
        .message-container {
          i {
            border: solid 3px red;
            border-radius: 20px;
            font-size: 25px;
            padding: 5px;
            background-color: red;
            margin: 5px;
          }
        }
        .model-buttons {
          .close-button,
          .try-again-button {
            border: solid 1px ${greenDark};
            color: ${greenDark};
          }
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
      districtPolicy: get(state, 'signup.districtPolicy', {}),
    }),
    {
      requestNewPassword: requestNewPasswordAction,
      requestNewPasswordResetControl: requestNewPasswordResetControlAction,
    }
  )
)

const ConnectedStyledForgotPasswordPopup = enhance(StyledForgotPasswordPopup)

export { ConnectedStyledForgotPasswordPopup as ForgotPasswordPopup }
