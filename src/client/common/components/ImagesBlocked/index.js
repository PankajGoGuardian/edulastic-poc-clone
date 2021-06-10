import React, { useEffect } from 'react'
import { notification } from '@edulastic/common'
import '../AppUpdate/notification.scss'

const ImagesBlocked = ({ visible, onClose }) => {
  const btn = (
    <span style={{ whiteSpace: 'nowrap' }}>
      Images seem to be blocked on this site. <br />
      Allow Images in site settings to view images & PDFs.
    </span>
  )

  useEffect(() => {
    if (visible) {
      notification({
        msg: btn,
        placement: 'bottomRight',
        duration: 0,
        className: 'notification',
        onClose,
      })
    }
  }, [visible])

  return null
}

export default ImagesBlocked
