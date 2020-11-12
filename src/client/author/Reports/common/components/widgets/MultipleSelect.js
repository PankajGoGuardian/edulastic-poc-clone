import React from 'react'
import PropTypes from 'prop-types'
import { find, map } from 'lodash'
import { Select } from 'antd'
import { StyledAutocompleteDropDownContainer } from '../../styled'

const Option = Select.Option
const OptGroup = Select.OptGroup

const getOption = ({ props = {} }) => ({
  key: props.optionkey || '',
  title: props.title || '',
})

const buildDropDownData = (datum, selected, prefix) => {
  const arr = [
    <OptGroup key="group" label={prefix || ''}>
      {datum.map((item) => {
        const isSelected = find(
          selected,
          (selectedItem) => selectedItem.key == item.key
        )
        const className = isSelected
          ? 'ant-select-dropdown-menu-item-selected'
          : null
        return (
          <Option
            className={className}
            key={item.key}
            optionkey={item.key}
            title={item.title}
            value={`${item.title}${item.key}`}
          >
            {item.title}
          </Option>
        )
      })}
    </OptGroup>,
  ]
  return arr
}

const MultipleSelect = ({
  className,
  containerClassName = '',
  prefix = '',
  valueToDisplay,
  by = [{ key: '', title: '' }],
  onChange = () => {},
  onSelect = () => {},
  data = [],
  comData,
  placeholder = '',
}) => {
  const selected = [].concat(by) // convert selected value to an array even if an object is passed
  const _displayValue = [].concat(valueToDisplay) || selected
  const dataSource = buildDropDownData(data, selected, prefix)

  const _onChange = (values, items) => onChange(map(items, getOption), comData)
  const _onSelect = (_, item) => onSelect(getOption(item))

  return (
    <StyledAutocompleteDropDownContainer
      className={`${containerClassName} autocomplete-dropdown`}
    >
      <Select
        dropdownClassName={className}
        className={className}
        onChange={_onChange}
        onSelect={_onSelect}
        onDeselect={_onSelect}
        value={map(_displayValue, (item) => item.title)}
        placeholder={placeholder}
        mode="multiple"
      >
        {dataSource}
      </Select>
    </StyledAutocompleteDropDownContainer>
  )
}

MultipleSelect.propTypes = {
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  prefix: PropTypes.string,
  valueToDisplay: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  by: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  data: PropTypes.array,
  comData: PropTypes.object,
  placeholder: PropTypes.string,
}

MultipleSelect.defaultProps = {
  className: '',
  containerClassName: '',
  prefix: '',
  by: [{ key: '', title: '' }],
  onChange: () => {},
  onSelect: () => {},
  data: [],
  comData: {},
  placeholder: '',
}

export { MultipleSelect }
