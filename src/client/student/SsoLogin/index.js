import React from 'react'
import { withRouter } from 'react-router'
import { compose } from 'redux'
import { connect } from 'react-redux'
import qs from 'qs'
import { get } from 'lodash'
import styled from 'styled-components'

import { Modal, Row, Col } from 'antd'

import { EduButton } from '@edulastic/common'
import { darkGrey2 } from '@edulastic/colors'

import {
  googleSSOLoginAction,
  cleverSSOLoginAction,
  msoSSOLoginAction,
  atlasSSOLoginAction,
  googleLoginAction,
  getUserDataAction,
  toggleRoleConfirmationPopupAction,
  msoLoginAction,
  newselaSSOLoginAction,
} from '../Login/ducks'
import ConfirmationModal from '../../common/components/ConfirmationModal'

class SsoLogin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmationInput: '',
    }
  }

  componentDidMount() {
    const {
      location,
      googleSSOLogin,
      cleverSSOLogin,
      msoSSOLogin,
      atlasSSOLogin,
      newselaSSOLogin,
    } = this.props
    const { addAccount, addAccountTo } = JSON.parse(
      sessionStorage.getItem('addAccountDetails') || '{}'
    )

    const path = location.pathname.split('/')

    const payload = {
      code: qs.parse(location.search, { ignoreQueryPrefix: true }).code,
      edulasticRole: localStorage.getItem('thirdPartySignOnRole') || undefined,
      addAccountTo: addAccount ? addAccountTo : undefined,
    }

    const _payloadForUserData = localStorage.getItem('payloadForUserData')
    if (_payloadForUserData) {
      this.payloadForUserData = JSON.parse(_payloadForUserData)
      localStorage.removeItem('payloadForUserData')
    }

    if (localStorage.getItem('thirdPartySignOnAdditionalRole') === 'admin') {
      payload.isAdmin = true
    }

    if (path.includes('mso')) {
      msoSSOLogin(payload)
    } else if (path.includes('google')) {
      if (!this.payloadForUserData) {
        googleSSOLogin(payload)
      }
    } else if (path.includes('clever')) {
      cleverSSOLogin({
        ...payload,
        state: qs.parse(location.search, { ignoreQueryPrefix: true }).state,
      })
    } else if (path.includes('atlas')) {
      const state = qs.parse(location.search, { ignoreQueryPrefix: true })
        ?.state
      if (state) payload.state = JSON.parse(state)
      atlasSSOLogin(payload)
    } else if (path.includes('newsela')) {
      const query = qs.parse(location.search, { ignoreQueryPrefix: true })
      const { redirect, state } = query
      if (redirect) {
        localStorage.setItem('loginRedirectUrl', redirect)
      }
      if (state) payload.state = JSON.parse(state)
      newselaSSOLogin(payload)
    }
    /**
     * to force render with current instance variables
     * This is equivalent to a simple setState. But using foceUpdate for minimal impact
     */
    this.forceUpdate()
  }

  handleConfirmation = () => {
    const { googleLogin, msoLogin, location } = this.props
    const path = location.pathname.split('/')
    localStorage.setItem('studentRoleConfirmation', 'true')
    if (path.includes('google')) {
      googleLogin({ role: 'teacher' })
    }
    if (path.includes('mso')) {
      msoLogin({ role: 'teacher' })
    }
  }

  handleRejection = () => {
    const { history, toggleRoleConfirmationPopup } = this.props
    toggleRoleConfirmationPopup(false)
    history.push('/login')
  }

  setConfirmationInput = (e) =>
    this.setState({ confirmationInput: e.target.value })

  render() {
    const {
      getUserData,
      googleLogin,
      isRoleConfirmation,
      email,
      location,
    } = this.props
    const { confirmationInput } = this.state

    const path = location.pathname.split('/')
    const showConfirmationModal =
      isRoleConfirmation && (path.includes('google') || path.includes('mso'))
    const reAuthenticate = () => googleLogin({ prompt: true })
    return (
      <div>
        <p>Authenticating...</p>
        {showConfirmationModal && (
          <ConfirmationModal
            title="Confirm Teacher Signup"
            bodyText={`The email ${email} is already registered as a student in Edulastic. Are you sure you want to continue registering as a teacher? If so, type "CONTINUE" in the field below and proceed.`}
            show={isRoleConfirmation}
            onOk={this.handleConfirmation}
            onCancel={this.handleRejection}
            inputVal={confirmationInput}
            onInputChange={this.setConfirmationInput}
            expectedVal="CONTINUE"
            okText="CONFIRM"
            placeHolder="Type the text here"
            showConfirmationText
            hideUndoneText
            centered
          />
        )}
        {this.payloadForUserData && (
          <StyledModal
            onCancel={() => getUserData(this.payloadForUserData)}
            visible={!!this.payloadForUserData}
            footer={null}
            centered
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
                  Re-authenticate for Google Classroom
                </div>
              </StyledCol>
              <StyledCol span={24}>
                <EduButton height="40px" width="180px" onClick={reAuthenticate}>
                  Re-authenticate
                </EduButton>
              </StyledCol>
            </Row>
          </StyledModal>
        )}
      </div>
    )
  }
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      user: get(state, 'user.user', null),
      isRoleConfirmation: state.user.isRoleConfirmation,
      email: state.user?.email || 'Email',
    }),
    {
      googleSSOLogin: googleSSOLoginAction,
      cleverSSOLogin: cleverSSOLoginAction,
      msoSSOLogin: msoSSOLoginAction,
      atlasSSOLogin: atlasSSOLoginAction,
      googleLogin: googleLoginAction,
      msoLogin: msoLoginAction,
      newselaSSOLogin: newselaSSOLoginAction,
      getUserData: getUserDataAction,
      toggleRoleConfirmationPopup: toggleRoleConfirmationPopupAction,
    }
  )
)
export default enhance(SsoLogin)

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
