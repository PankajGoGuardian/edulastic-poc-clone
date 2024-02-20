import React, { useCallback, useState } from 'react'
import { Empty, Select } from 'antd'
import { SelectInputStyled, useDropdownData } from '@edulastic/common'
import PropTypes from 'prop-types'

const { OptGroup } = SelectInputStyled

const SelectSearch = React.forwardRef(function SelectSearch(
  {
    loading,
    onBlur,
    onChange,
    onFocus,
    onSearch,
    options,
    placeholder,
    value,
    tagsSearch,
    loc,
    suffixIcon,
    onSelectAll,
    ...props
  },
  ref
) {
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
  const CustomGroupLabel = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 'bold',
      }}
    >
      <div>SELECT TESTS</div>
      <a onClick={onSelectAll}>SELECT ALL</a>
    </div>
  )
  const dropDownData = useDropdownData(options, {
    id_key: tagsSearch ? 'index' : 'key',
    OptionComponent: Select.Option,
    searchText,
    title_key: 'title',
    value_key: 'key',
    optionProps: (item) => ({ associatedNames: item.associatedNames }),
  })
  return (
    <SelectInputStyled
      filterOption={false}
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
      loading={loading}
      maxTagCount={4}
      maxTagTextLength={10}
      onBlur={handleBlur}
      onChange={onChange}
      onFocus={onFocus}
      onSearch={handleSearch}
      placeholder={placeholder}
      ref={ref}
      showSearch
      value={value}
      notFoundContent={
        <Empty
          className="ant-empty-small"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ textAlign: 'left', margin: '10px 0' }}
          description="No matching results"
        />
      }
      suffixIcon={!loading && suffixIcon}
      showArrow={!loading && loc === 'completion-report'}
      $paddingRight={!loading && !!suffixIcon && '80px'}
      {...props}
    >
      {loc === 'completion-report' ? (
        <OptGroup label={<CustomGroupLabel />}>{dropDownData}</OptGroup>
      ) : (
        dropDownData
      )}
    </SelectInputStyled>
  )
})

SelectSearch.propTypes = {
  loading: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onSearch: PropTypes.func,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.object,
  ]),
}

SelectSearch.defaultProps = {
  loading: false,
  onBlur: () => {},
  onChange: () => {},
  onFocus: () => {},
  onSearch: () => {},
  options: [],
  placeholder: null,
  value: [],
}

export default SelectSearch
