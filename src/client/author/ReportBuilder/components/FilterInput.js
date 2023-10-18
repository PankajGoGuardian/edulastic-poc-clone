import React from 'react'
import * as PropTypes from 'prop-types'
import { Select, Input } from 'antd'

const FilterInputs = {
  string: ({ values, onChange }) => (
    <Select
      key="input"
      style={{
        width: 300,
      }}
      mode="tags"
      onChange={onChange}
      value={values}
    />
  ),
  number: ({ values, onChange }) => (
    <Input
      key="input"
      style={{
        width: 300,
      }}
      onChange={(e) => onChange([e.target.value])}
      value={(values && values[0]) || ''}
    />
  ),
  boolean: ({ onChange }) => (
    <Select
      style={{ width: 300 }}
      mode="tags"
      onChange={(values) => onChange(values.map((v) => v === 'true'))}
    >
      <Select.Option value="true">True</Select.Option>
      <Select.Option value="false">False</Select.Option>
    </Select>
  ),
}
FilterInputs.string.propTypes = {
  values: PropTypes.array,
  onChange: PropTypes.func.isRequired,
}
FilterInputs.string.defaultProps = {
  values: [],
}
FilterInputs.number.propTypes = {
  values: PropTypes.array,
  onChange: PropTypes.func.isRequired,
}
FilterInputs.number.defaultProps = {
  values: [],
}

export const FilterInput = ({ member, updateMethods }) => {
  const Filter = FilterInputs[member.dimension.type] || FilterInputs.string
  return (
    <Filter
      key="filter"
      values={member.values}
      onChange={(values) => updateMethods(member, 'values', values)}
    />
  )
}

FilterInput.propTypes = {
  member: PropTypes.object.isRequired,
  updateMethods: PropTypes.object.isRequired,
}
