import React, { useEffect, useMemo } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Input, Form } from 'antd'
import { get, trim } from 'lodash'
import { white, greenDark, orange, themeColor } from '@edulastic/colors'
import { IconMail } from '@edulastic/icons'
import { CustomModalStyled, EduButton } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { isEmailValid } from '../../../common/utils/helpers'
import { ButtonsContainer } from '../../../common/styled'
import {
  getTooManyAtempt,
  requestNewPasswordAction,
  requestNewPasswordResetControlAction,
} from '../ducks'

const ForgotPasswordPopup = (props) => {
  const {
    visible,
    onCancel,
    t,
    requestNewPassword,
    user,
    districtPolicy,
    requestNewPasswordResetControl,
    tooManyAttempt = false,
  } = props
  const { requestingNewPassword, requestNewPasswordSuccess } = user

  useEffect(() => {
    requestNewPasswordResetControl()
  }, [])

  const onCancelForgotPassword = () => {
    onCancel()
  }

  const onSendLink = (email, multipleAttempt) => {
    requestNewPassword({
      email,
      districtId: districtPolicy.orgId,
      multipleAttempt,
    })
  }

  const onClickTryAgain = () => {
    requestNewPasswordResetControl()
  }

  const onClickClose = () => {
    onCancel()
  }

  const modalTitle = useMemo(
    () =>
      tooManyAttempt && !requestNewPasswordSuccess
        ? 'Password attempt exceeded'
        : !requestNewPasswordSuccess
        ? 'Forgot Password'
        : 'Email Sent',
    [requestNewPasswordSuccess, tooManyAttempt]
  )

  return (
    <CustomModalStyled
      visible={visible}
      title={modalTitle}
      modalWidth="500px"
      onCancel={onCancelForgotPassword}
      centered
      titleFontSize="20px"
      bodyPadding="25px 0px 0px 0px"
      footer={[]}
    >
      <div data-cy="passwordReset">
        {tooManyAttempt && !requestNewPasswordSuccess ? (
          <div>
            <StyledText>
              You have entered the wrong password too many times. For security
              reasons we have locked your account.
            </StyledText>
            <StyledText>
              Please enter your <b>registered username or email</b> to receive a
              link to reset your password and regain access.
            </StyledText>
            <StyledText>
              <b>Alternatively</b>, you can <b>ask your admin/teacher</b> to
              reset your password.
            </StyledText>
            <ConnectedForgotPasswordForm
              onSubmit={(e) => onSendLink(e, true)}
              onCancel={onCancelForgotPassword}
              t={t}
              requestingNewPassword={requestingNewPassword}
            />
          </div>
        ) : !requestNewPasswordSuccess ? (
          <div>
            <StyledText>
              Please enter your registered username or email. We will email you
              a link to reset your password.
            </StyledText>
            <ConnectedForgotPasswordForm
              onSubmit={onSendLink}
              onCancel={onCancelForgotPassword}
              t={t}
              requestingNewPassword={requestingNewPassword}
            />
          </div>
        ) : (
          <div>
            <div className="message-container">
              <StyledText>{requestNewPasswordSuccess.content}</StyledText>
              <StyledText>
                If you do not receive your password reset email shortly,
                please&nbsp;
                <a
                  href="https://edulastic.zendesk.com/hc/en-us/requests/new"
                  rel="noreferrer"
                  target="_blank"
                >
                  contact us
                </a>
                .
              </StyledText>
            </div>
            <ButtonsContainer>
              <EduButton key="close" onClick={onClickClose} data-cy="close">
                Close
              </EduButton>
            </ButtonsContainer>
          </div>
        )}
      </div>
    </CustomModalStyled>
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
      <p>Username / Email</p>
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
            data-testid="email-input"
            className="email-input"
            prefix={<IconMail color={themeColor} />}
            placeholder="Enter Registered Username or Email"
            data-cy="enterUsernameOrEmail"
            autoComplete="new-password"
          />
        )}
      </Form.Item>
      <ButtonsContainer>
        <EduButton isGhost onClick={onCancel} data-cy="cancel">
          Cancel
        </EduButton>
        <EduButton
          data-testid="send-reset"
          htmlType="submit"
          key="sendLink"
          ml="20px"
          disabled={requestingNewPassword}
          data-cy="sendResetLink"
        >
          Send Reset Link
        </EduButton>
      </ButtonsContainer>
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

const StyledText = styled.span`
  margin-bottom: 20px;
  display: block;
`

const enhance = compose(
  withNamespaces('login'),
  connect(
    (state) => ({
      user: get(state, 'user', null),
      districtPolicy: get(state, 'signup.districtPolicy', {}),
      tooManyAttempt: getTooManyAtempt(state),
    }),
    {
      requestNewPassword: requestNewPasswordAction,
      requestNewPasswordResetControl: requestNewPasswordResetControlAction,
    }
  )
)

const ConnectedStyledForgotPasswordPopup = enhance(StyledForgotPasswordPopup)

export { ConnectedStyledForgotPasswordPopup as ForgotPasswordPopup }
