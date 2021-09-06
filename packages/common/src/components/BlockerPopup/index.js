import React from 'react'
import { Modal } from 'antd'
import { IconClose } from '@edulastic/icons'

import './styles.scss'

const showBlockerPopup = (message) => {
  const destoryPopup = () => {
    Modal.destroyAll()
  }

  Modal.confirm({
    centered: true,
    className: 'customized-blocker-popup',
    maskClosable: true,
    title: 'Warning',
    content: (
      <div className="blocker-popup-text">
        <IconClose onClick={destoryPopup} className="close-icon" />
        {message}
      </div>
    ),
  })
}

export default showBlockerPopup
