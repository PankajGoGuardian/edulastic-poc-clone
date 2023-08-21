import { Form } from 'antd'
import React from 'react'

export const FieldLabel = ({ children, fieldName, label }) => {
  return (
    <Form.Item name={fieldName} label={label}>
      {children}
    </Form.Item>
  )
}
