import React, { useState, useEffect } from 'react'
import { CustomModalStyled, EduButton } from '@edulastic/common'

function closeTab() {
  sessionStorage.clear()
  localStorage.clear()
  window.location.href = '/'
}

export default function StudentSessionExpiredModal() {
  const [showPopup, setShowPopup] = useState(false)

  const closePopupFn = () => {
    setShowPopup(false)
    closeTab()
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
