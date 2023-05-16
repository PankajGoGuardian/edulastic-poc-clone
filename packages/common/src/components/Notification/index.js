import React, { Fragment } from 'react'
import styled from 'styled-components'
import EduButton from '@edulastic/common/src/components/Button'
import i18n from '@edulastic/localization'
import antNotification from 'antd/es/notification'
import './notification.scss'

const defaultConf = {
  key: '',
  className: 'customized-notification',
  message: '',
  description: '',
  type: 'warn',
  buttonLink: '',
  buttonText: '',
  showButton: false,
  onClose: () => null,
  onClick: () => null,
  placement: 'bottomLeft',
  style: {
    width: 'fit-content',
    minWidth: 120,
  },
}

/**
 * @see https://ant.design/components/notification/
 * type is notification type.
 * messageKey is notification's message and description, we can get it from locales.
 * msg is custom message, if msg is passed, then will not use locales.
 * @param {{type?:'success' | 'error' | 'info' | 'warn' | 'warning', messageKey: String, showButton?:boolean, msg?:String }} options
 */
const notification = (options) => {
  const { messageKey, msg, exact, destroyAll, ...restOptions } = options
  // destroy existing notifications before showing new notification
  if (destroyAll) {
    antNotification.destroy()
  }
  // get messages from localization
  let translatedMessage =
    msg ||
    i18n.t(`notifications:${messageKey}.message`) ||
    'Something went wrong! '
  const translatedDescription = msg
    ? ''
    : i18n.t(`notifications:${messageKey}.description`)

  if (
    restOptions.type === 'error' &&
    translatedMessage !== 'Incorrect' &&
    !exact
  ) {
    translatedMessage = `${translatedMessage} Please try again later, or email support@edulastic.com.`
  }

  const config = {
    ...defaultConf,
    ...restOptions,
    message: translatedMessage,
    description: translatedDescription || '',
  }

  const {
    type,
    description,
    showButton,
    buttonLink,
    buttonText,
    ...rest
  } = config

  const handlClickActionButton = () => {}

  const buttonProps = buttonLink
    ? {
        href: buttonLink,
        target: '_blank',
      }
    : {
        onClick: handlClickActionButton,
      }
  if (antNotification[type] && config.message) {
    const messageTemplate = (
      <>
        {description ? <Description>{description}</Description> : <></>}
        {showButton && (
          <ActionButton {...buttonProps}>{buttonText}</ActionButton>
        )}
      </>
    )
    const notificationData = {
      description: messageTemplate,
      duration: 6.5, // default notification duration
      ...rest,
    }
    antNotification[type](notificationData)
  }
}

const Description = styled.p`
  margin-top: 6px;
`

const ActionButton = styled(EduButton)`
  height: 30px;
  width: 150px;
  margin-top: 20px;
  margin-left: 0px;
  padding: 0px;
`

export default notification
