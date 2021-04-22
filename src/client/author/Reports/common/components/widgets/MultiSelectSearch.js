import React, { useCallback, useMemo, useState } from 'react'
import { Empty, Select } from 'antd'
import { SelectInputStyled } from '@edulastic/common'
import { FilterLabel } from '../../styled'
import useDropdownData from '../../hooks/useDropdownData'

const MultiSelectSearch = ({
  label,
  placeholder,
  onChange,
  onSearch,
  onBlur = () => {},
  value,
  options = [],
  dataCy,
  el,
  loading,
  onFocus = () => {},
}) => {
  const [searchText, setSearchText] = useState('')
  const handleSearch = useCallback(
    s => {
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
    options.map(data => ({
      ...data,
      title: data.name === 'All' ? `All ${label}` : data.title
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
    <>
      <FilterLabel data-cy={dataCy}>{label}</FilterLabel>
      <SelectInputStyled
        showSearch
        loading={loading}
        placeholder={placeholder}
        mode="multiple"
        ref={el}
        onChange={onChange}
        onSearch={handleSearch}
        onBlur={handleBlur}
        onFocus={onFocus}
        onSelect={() => el && el?.current?.blur()}
        onDeselect={() => el && el?.current?.blur()}
        value={value}
        maxTagCount={4}
        maxTagTextLength={10}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        filterOption={false}
        notFoundContent={
          <Empty
            className="ant-empty-small"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ textAlign: 'left', margin: '10px 0' }}
            description="No matching results"
          />
        }
      >
        {dropDownData}
      </SelectInputStyled>
    </>
  )
}

export default MultiSelectSearch
