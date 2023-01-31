import React from 'react'
import { Select } from 'antd'
import {
  ValueEditor as DefaultValueEditor,
  ValueEditorProps,
} from 'react-querybuilder'

const ValueEditor = (props: ValueEditorProps) => {
  const { operator, type, values, handleOnChange, handleSearch, value } = props

  if (operator === 'null' || operator === 'notNull') {
    return null
  }

  console.log('here', props)
  if (!value) handleOnChange(undefined)
  if (type === 'multiselect') {
    return (
      <Select
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
        mode="multiple"
        style={{ width: '200px' }}
        onChange={handleOnChange}
        onSearch={handleSearch || (() => {})}
        value={value}
      >
        {values.map((item) => {
          return <Select.Option value={item.value}>{item.label}</Select.Option>
        })}
      </Select>
    )
  }
  if (type === 'select') {
    return (
      <Select
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
        style={{ width: '200px' }}
        onChange={handleOnChange}
        value={value}
      >
        {values.map((item) => {
          return <Select.Option value={item.value}>{item.label}</Select.Option>
        })}
      </Select>
    )
  }
  return <DefaultValueEditor {...props} />
}

export default ValueEditor
