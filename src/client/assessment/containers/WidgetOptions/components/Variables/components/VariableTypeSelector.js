import React from 'react'
import { Modal } from 'antd'
import { variableTypes } from '@edulastic/constants'
import { SelectInputStyled } from '@edulastic/common'

const { Option } = SelectInputStyled

const VariableTypeSelector = ({
  value,
  variableName,
  hasExamples,
  onSelect,
}) => {
  const types = Object.keys(variableTypes)

  const handleSelect = (v) => {
    if (hasExamples) {
      Modal.confirm({
        title: 'Confirm',
        content:
          'This will clear all previously generated values. Do you wish to proceed?',
        okText: 'Confirm',
        cancelText: 'Cancel',
        onOk: () => onSelect(variableName, 'type', v),
      })
    } else {
      onSelect(variableName, 'type', v)
    }
  }

  return (
    <SelectInputStyled
      size="large"
      data-cy="variableType"
      value={value}
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
      onChange={handleSelect}
      style={{ width: '100%' }}
    >
      {types.map((key) => (
        <Option data-cy={key} key={key} value={key}>
          {variableTypes[key]}
        </Option>
      ))}
    </SelectInputStyled>
  )
}

export default VariableTypeSelector
