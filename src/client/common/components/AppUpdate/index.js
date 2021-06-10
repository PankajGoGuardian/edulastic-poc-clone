import React, { useEffect } from 'react'
import { notification } from '@edulastic/common'
import './notification.scss'

const AppUpdate = ({ visible, isCliUser }) => {
  const handleOk = () => {
    setTimeout(() => {
      if (
        window.frameElement ||
        window.self !== window.top ||
        window.location !== window.parent.location
      ) {
        const cliAppRefreshUrl = localStorage.getItem('cliAppRefreshUrl')
        if (isCliUser && cliAppRefreshUrl) {
          localStorage.removeItem('cliAppRefreshUrl')
          window.location.href = cliAppRefreshUrl
        } else {
          window.location.reload(true)
        }
      } else {
        window.location.reload(true)
      }
    }, 100)
  }

  const btn = (
    <span style={{ whiteSpace: 'nowrap' }}>
      A new update is available &nbsp;<a onClick={() => handleOk()}>Refresh</a>
    </span>
  )

  useEffect(() => {
    if (visible) {
      notification({
        msg: btn,
        placement: 'bottomRight',
        duration: 0,
        className: 'notification',
      })
    }
  }, [visible])

  return null
}

export default AppUpdate
