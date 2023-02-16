import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { CustomModalStyled, EduButton } from '@edulastic/common'
import { removeAllTokens } from '@edulastic/api/src/utils/Storage'
import { logoutAction } from '../../author/src/actions/auth'
import { setStudentSessionExpiredAction } from '../../assessment/actions/test'

function closeTab(logout) {
  removeAllTokens()
  logout()
}

function StudentSessionExpiredModal({ logout, setStudentSessionExpired }) {
  const [showPopup, setShowPopup] = useState(false)

  const closePopupFn = () => {
    setShowPopup(false)
    setStudentSessionExpired(false)
    closeTab(logout)
  }

  useEffect(() => {
    const showPopupFn = () => {
      setShowPopup(true)
      setStudentSessionExpired(true)
    }
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
        We noticed you are already logged in. Please return to the session you
        last logged into.
      </p>
    </CustomModalStyled>
  )
}

export default connect(null, {
  logout: logoutAction,
  setStudentSessionExpired: setStudentSessionExpiredAction,
})(StudentSessionExpiredModal)
