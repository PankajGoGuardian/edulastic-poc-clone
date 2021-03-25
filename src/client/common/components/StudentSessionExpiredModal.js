import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { CustomModalStyled, EduButton } from '@edulastic/common'
import { removeAllTokens } from '@edulastic/api/src/utils/Storage'
import { logoutAction } from '../../author/src/actions/auth'

function closeTab(logout) {
  removeAllTokens()
  logout()
}

function StudentSessionExpiredModal({ logout }) {
  const [showPopup, setShowPopup] = useState(false)

  const closePopupFn = () => {
    setShowPopup(false)
    closeTab(logout)
  }

  useEffect(() => {
    const showPopupFn = () => setShowPopup(true)
    window.addEventListener('student-session-expired', showPopupFn)
    return () =>
      window.removeEventListener('student-session-expired', showPopupFn)
  }, [])

  return (
    <CustomModalStyled
      title="Oops! Multiple Logins"
      centered
      onCancel={closePopupFn}
      onOk={closePopupFn}
      visible={showPopup}
      footer={
        <center>
          <EduButton onClick={closePopupFn}>Ok</EduButton>
        </center>
      }
    >
      <p>
        We noticed you are already logged in. This session will close, but you
        can continue working in the session you logged into first.
      </p>
    </CustomModalStyled>
  )
}

export default connect(null, {
  logout: logoutAction,
})(StudentSessionExpiredModal)
