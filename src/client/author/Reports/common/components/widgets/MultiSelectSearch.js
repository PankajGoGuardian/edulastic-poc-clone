import React from 'react'
import { Select } from 'antd'
import { SelectInputStyled } from '@edulastic/common'
import { FilterLabel } from '../../styled'

const MultiSelectSearch = ({
  label,
  placeholder,
  onChange,
  onSearch,
  onBlur = () => {},
  value,
  options,
  dataCy,
  el,
  loading,
  onFocus = () => {},
}) => (
  <>
    <FilterLabel data-cy={dataCy}>{label}</FilterLabel>
    <SelectInputStyled
      showSearch
      loading={loading}
      placeholder={placeholder}
      mode="multiple"
      ref={el}
      onChange={onChange}
      onSearch={onSearch}
      onBlur={onBlur}
      onFocus={onFocus}
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
          <Select.Option key={data.key} value={data.key}>
            {data.name === 'All' ? `All ${label}` : data.title}
          </Select.Option>
        ))}
    </SelectInputStyled>
  </>
)

export default MultiSelectSearch
