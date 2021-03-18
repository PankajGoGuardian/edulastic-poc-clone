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
      title="Session To Be Closed"
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
        We have detected multiple logins into the same account and this session
        has to be closed
      </p>
    </CustomModalStyled>
  )
}
