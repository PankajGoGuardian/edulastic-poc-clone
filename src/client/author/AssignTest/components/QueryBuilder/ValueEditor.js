import React from 'react'
import { Select } from 'antd'
import {
  ValueEditor as DefaultValueEditor,
  ValueEditorProps,
} from 'react-querybuilder'
import { StyledSelect } from './QueryBuilder'

const ValueEditor = (props: ValueEditorProps) => {
  const { operator, type, values, handleOnChange, handleSearch, value } = props

  if (operator === 'null' || operator === 'notNull') {
    return null
  }

  if (!value) handleOnChange(undefined)
  if (type === 'multiselect') {
    return (
      <StyledSelect
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
      </StyledSelect>
    )
  }
  if (type === 'select') {
    return (
      <StyledSelect
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
        style={{ width: '200px' }}
        onChange={handleOnChange}
        value={value}
      >
        {values.map((item) => {
          return <Select.Option value={item.value}>{item.label}</Select.Option>
        })}
      </StyledSelect>
    )
  }
  return <DefaultValueEditor {...props} />
}

export default ValueEditor
