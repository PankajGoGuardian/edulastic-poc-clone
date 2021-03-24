import React from 'react'
import { Select } from 'antd'
import { SelectInputStyled } from '@edulastic/common'
import { FilterLabel } from '../../styled'

const MultiSelectDropdown = ({
  label,
  onChange,
  value,
  options,
  dataCy,
  el,
  showSearch = false,
}) => (
  <>
    <FilterLabel data-cy={dataCy}>{label}</FilterLabel>
    <SelectInputStyled
      showSearch={showSearch}
      placeholder={`All ${label}`}
      mode="multiple"
      ref={el}
      onChange={onChange}
      onSelect={() => el && el?.current?.blur()}
      onDeselect={() => el && el?.current?.blur()}
      value={value}
      maxTagCount={4}
      maxTagTextLength={10}
      optionFilterProp="children"
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
    >
      {options &&
        options.map((data) => (
          <Select.Option key={data.key} value={data.key} title={data.title}>
            {data.name === 'All' ? `All ${label}` : data.title}
          </Select.Option>
        ))}
    </SelectInputStyled>
  </>
)

export default MultiSelectDropdown
