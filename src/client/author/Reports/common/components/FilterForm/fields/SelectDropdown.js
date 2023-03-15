import React, { useCallback, useMemo, useState } from 'react'
import { Empty, Select } from 'antd'
import { SelectInputStyled, useDropdownData } from '@edulastic/common'
// import { FilterLabel } from '../../styled'

const SelectDropdown = ({
  label,
  onChange,
  value,
  options,
  dataCy,
  el,
  showSearch = false,
  onSearch = () => {},
  onBlur = () => {},
  maxTagCount = 4,
  height = 'auto',
  ...restProps
}) => {
  const [searchText, setSearchText] = useState('')
  const handleSearch = useCallback(
    (s) => {
      setSearchText(s)
      onSearch(s)
    },
    [onSearch]
  )
  const handleBlur = useCallback(
    (...e) => {
      setSearchText('')
      onBlur(...e)
    },
    [onBlur]
  )
  const updatedOptions = useMemo(() =>
    options.map((data) => ({
      ...data,
      title: data.name === 'All' ? `All ${label}` : data.title,
    }))
  )
  const dropDownData = useDropdownData(updatedOptions, {
    id_key: 'key',
    value_key: 'key',
    title_key: 'title',
    OptionComponent: Select.Option,
    searchText,
  })
  return (
    <SelectInputStyled
      height={height}
      showSearch={showSearch}
      placeholder={`All ${label}`}
      ref={el}
      onChange={onChange}
      onSelect={() => el && el?.current?.blur()}
      onDeselect={() => el && el?.current?.blur()}
      value={value}
      maxTagCount={maxTagCount}
      onSearch={handleSearch}
      onBlur={handleBlur}
      maxTagTextLength={10}
      optionFilterProp="title"
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
      notFoundContent={
        <Empty
          className="ant-empty-small"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ textAlign: 'left', margin: '10px 0' }}
          description="No matching results"
        />
      }
      {...restProps}
    >
      {dropDownData}
    </SelectInputStyled>
  )
}

export default SelectDropdown
