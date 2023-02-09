import React from 'react'
import notification from 'antd/es/notification'
import { EduButton } from '@edulastic/common'

export const notificationMessage = ({
  title = '',
  message = '',
  showButton = false,
  buttonLink = '',
  buttonText = '',
  notificationPosition = 'bottomRight',
  notificationKey = '',
  onCloseNotification = () => {},
  onButtonClick = () => {},
  duration,
}) => {
  notification.open({
    key: notificationKey,
    message: title,
    description: (
      <div>
        <p
          style={{ 'margin-top': '10px' }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
        {showButton && (
          <EduButton
            height="30px"
            width="150px"
            href={buttonLink}
            target="_blank"
            style={{
              marginTop: '20px',
              marginLeft: '0px',
              padding: '0px',
            }}
          >
            {buttonText}
          </EduButton>
        )}
      </div>
    ),
    placement: notificationPosition,
    top: 70,
    duration: duration || 0,
    onClose: () => onCloseNotification(),
    onClick: (e) => onButtonClick(e),
  })
}

export const destroyNotificationMessage = () => {
  notification.destroy()
}

export const closeHangoutNotification = (key) => {
  notification.close(key)
}
