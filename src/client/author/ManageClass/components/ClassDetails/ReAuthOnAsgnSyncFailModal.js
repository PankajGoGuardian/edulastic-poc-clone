import React from 'react'
import styled from 'styled-components'
import { Modal, Row, Col } from 'antd'
import * as Sentry from '@sentry/browser'
import { EduButton, notification } from '@edulastic/common'
import { darkGrey2 } from '@edulastic/colors'
import GoogleLogin from 'react-google-login'
import { scopes } from '../ClassListContainer/ClassCreatePage'

const ReAuthOnAsgnSyncFailModal = ({ visible, handleLoginSuccess, toggle }) => {
  const handleError = (err) => {
    notification({ messageKey: 'googleLoginFailed' })
    Sentry.captureException(err)
    toggle()
  }
  return (
    <StyledModal
      onCancel={toggle}
      visible={visible}
      footer={null}
      centered
      title="Re-authentication required"
    >
      <Row type="flex" align="middle" gutter={[20, 20]}>
        <StyledCol span={24}>
          <div
            style={{
              color: darkGrey2,
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            Please re-authenticate to continue.
          </div>
        </StyledCol>
        <StyledCol span={24}>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Re-authenticate"
            render={(renderProps) => (
              <EduButton isBlue isGhost onClick={renderProps.onClick}>
                <span>Re-authenticate</span>
              </EduButton>
            )}
            scope={scopes}
            onSuccess={handleLoginSuccess}
            onFailure={handleError}
            prompt="consent"
            responseType="code"
          />
        </StyledCol>
      </Row>
    </StyledModal>
  )
}

export default ReAuthOnAsgnSyncFailModal

const StyledModal = styled(Modal)`
  .ant-modal-content {
    width: 500px;
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
