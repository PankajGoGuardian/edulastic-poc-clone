import React, { useState, useEffect } from 'react'
import { CustomModalStyled, EduButton } from '@edulastic/common'
import { forceLogout } from '@edulastic/api/src/utils/API'

function closeTab() {
  forceLogout()
  window.location.href = '/login'
}

function UserTokenExpiredModal() {
  const [showPopup, setShowPopup] = useState(false)

  const closePopupFn = () => {
    setShowPopup(false)
    closeTab()
  }

  useEffect(() => {
    const showPopupFn = () => setShowPopup(true)
    window.addEventListener('user-token-expired', showPopupFn)
    return () => window.removeEventListener('user-token-expired', showPopupFn)
  }, [])

  return (
    <CustomModalStyled
      title={
        <p style={{ fontSize: '20px', textAlign: 'center' }}>
          User Session Expired.
        </p>
      }
      closable={false}
      maskClosable={false}
      centered
      onOk={closePopupFn}
      visible={showPopup}
      footer={[
        <EduButton width="180px" onClick={closePopupFn}>
          LOGIN
        </EduButton>,
      ]}
    >
      <p style={{ fontWeight: '500', textAlign: 'center' }}>
        You have been logged out, please login again
      </p>
    </CustomModalStyled>
  )
}

export default UserTokenExpiredModal
