import { question } from '@edulastic/constants'
import React from 'react'

const ImmersiveReaderWrapper = ({ children }) => {
  return <div className={`${question.IR_CONTENT_SELECTOR}`}>{children}</div>
}

export default ImmersiveReaderWrapper
