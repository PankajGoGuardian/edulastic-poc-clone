import React from 'react'
import styled from 'styled-components'
import { Modal, Row, Col } from 'antd'
import * as Sentry from '@sentry/browser'
import { EduButton, notification } from '@edulastic/common'
import { darkGrey2 } from '@edulastic/colors'
import { AUTH_FLOW, GoogleLoginWrapper } from '../../../../../vendors/google'
import { scopes } from '../ClassListContainer/ClassCreatePage'

const ReauthenticateModal = ({ visible, handleLoginSuccess, toggle }) => {
  const handleError = (err) => {
    notification({ messageKey: 'googleLoginFailed' })
    Sentry.captureException(err)
    toggle()
  }

  const loginGoogle = (googleClient) => googleClient.requestCode()

  return (
    <StyledModal onCancel={toggle} visible={visible} footer={null} centered>
      <Row type="flex" align="middle" gutter={[20, 20]}>
        <StyledCol span={24}>
          <div
            style={{
              color: darkGrey2,
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            Re-authenticate for Google Classroom
          </div>
        </StyledCol>
        <StyledCol span={24}>
          <GoogleLoginWrapper
            WrappedComponent={({ googleClient }) => (
              <EduButton
                isBlue
                isGhost
                onClick={() => loginGoogle(googleClient)}
              >
                <span>Re-authenticate</span>
              </EduButton>
            )}
            scopes={scopes}
            successCallback={handleLoginSuccess}
            errorCallback={handleError}
            prompt="consent"
            flowType={AUTH_FLOW.CODE}
          />
        </StyledCol>
      </Row>
    </StyledModal>
  )
}

export default ReauthenticateModal

const StyledModal = styled(Modal)`
  .ant-modal-content {
    width: 500px;
    .ant-modal-close {
      display: none;
    }
    .ant-modal-header {
      display: none;
    }
    .ant-modal-body {
      padding: 24px 46px 32px;
    }
  }
`

const StyledCol = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`
