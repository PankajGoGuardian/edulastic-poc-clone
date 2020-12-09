import React from 'react'
import message from "antd/es/message";
import Tooltip from "antd/es/tooltip";
import { notification } from '@edulastic/common'

const WithDisableMessage = ({ children, disabled, errMessage }) => {
  const handleClick = () => {
    if (disabled) {
      notification({
        type: 'warn',
        msg:
          errMessage || 'This assignment has random items for every student.',
      })
    }
  }
  return disabled ? (
    <Tooltip
      title={
        errMessage || 'This assignment has random items for every student.'
      }
    >
      <span onClick={handleClick}>{children}</span>
    </Tooltip>
  ) : (
    children
  )
}

export default WithDisableMessage
