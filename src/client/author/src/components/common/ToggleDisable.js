import React from 'react'
import { Tooltip } from 'antd'
import { notification } from '@edulastic/common'

const WithDisableMessage = ({ children, disabled, errMessage }) => {
  const handleClick = () => {
    if (disabled) {
      notification({
        type: 'warn',
        msg: errMessage || 'Option is currently disabled.',
      })
    }
  }
  return disabled ? (
    <Tooltip title={errMessage || 'Option is currently disabled.'}>
      <span className="tool-tip" onClick={handleClick}>
        {children}
      </span>
    </Tooltip>
  ) : (
    children
  )
}

export default WithDisableMessage
