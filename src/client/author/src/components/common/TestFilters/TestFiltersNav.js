import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { SelectInputStyled } from '@edulastic/common'

const TestFiltersNav = ({ items, onSelect, search = {} }) => {
  let selected = items[0].path
  if (search.filter) {
    const getCurrent = items.find((item) => item.filter === search.filter) || {}
    selected = getCurrent?.path
  }
  const handleSelect = useCallback(
    (key) => {
      onSelect({ key })
    },
    [onSelect]
  )
  return (
    <SelectInputStyled
      data-cy="selectSource"
      size="large"
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      onSelect={handleSelect}
      value={selected}
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
    >
      {items.map((item) => (
        <Select.Option data-cy={item.text} key={item.path} value={item.path}>
          {item.text}
        </Select.Option>
      ))}
    </SelectInputStyled>
  )
}

TestFiltersNav.propTypes = {
  items: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
}

TestFiltersNav.defaultProps = {
  onSelect: () => {},
}

export default TestFiltersNav
