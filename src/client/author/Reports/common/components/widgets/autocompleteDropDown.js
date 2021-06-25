/* eslint-disable array-callback-return */
import React, { useState, useRef } from 'react'
import { AutoComplete, Input, Icon, Empty } from 'antd'

import { useInternalEffect } from '../../hooks/useInternalEffect'

import { StyledAutocompleteDropDownContainer } from '../../styled'

const Option = AutoComplete.Option
const OptGroup = AutoComplete.OptGroup

export const AutocompleteDropDown = ({
  className,
  containerClassName = '',
  prefix = '',
  by = { key: '', title: '' },
  selectCB,
  data = [],
  dropdownMenuIcon,
  comData,
  iconType = 'down',
  iconActiveType = 'up',
}) => {
  const [dropDownData, setDropDownData] = useState(data)
  const [selected, setSelected] = useState(by)
  const [text, setText] = useState(by.title)
  const [isActive, setActive] = useState(false)
  const autoRef = useRef(null)
  const textChangeStatusRef = useRef(false)

  useInternalEffect(() => {
    let item = null
    if (data.length) {
      item = data.find((_item) => {
        if (typeof selected === 'string' && _item.key === selected) {
          return true
        }
        if (typeof selected === 'object' && _item.key === selected.key) {
          return true
        }
      })
      if (!item) {
        item = data[0]
      }
    } else {
      item = { key: '', title: '' }
    }

    setSelected(item)
    setText(item.title)
    setDropDownData(data)
  }, [data])

  useInternalEffect(() => {
    let item = data.find((_item) => {
      if (typeof by === 'string' && _item.key === by) {
        return true
      }
      if (typeof by === 'object' && _item.key === by.key) {
        return true
      }
    })

    if (!item && data.length) {
      item = data[0]
    } else if (!item && !data.length) {
      item = { key: '', title: '' }
    }

    setSelected(item)
    setText(item.title)
  }, [by])

  const buildDropDownData = (datum) => {
    const arr = [
      <OptGroup key="group" label={prefix || ''}>
        {datum.map((item) => {
          const isSelected = selected.key === item.key
          const _className = isSelected
            ? 'ant-select-dropdown-menu-item-active'
            : null
          return (
            <Option key={item.key} title={item.title} className={_className}>
              {dropdownMenuIcon || item.dropdownMenuIcon}
              {item.title}
            </Option>
          )
        })}
      </OptGroup>,
    ]
    return arr
  }

  const onSearch = (value) => {
    if (value.length > 2) {
      const regExp = new RegExp(`${value}`, 'i')
      const searchedData = data.filter((item) => {
        if (regExp.test(item.title)) {
          return true
        }
        return false
      })
      setDropDownData(searchedData)
    } else if (data.length !== dropDownData.length) {
      setDropDownData(data)
    }
    setText(value)
    textChangeStatusRef.current = true
  }

  const onBlur = (key) => {
    const item = data.find((o) => o.key === key)
    if (!item) {
      setText(selected.title)
    }
    setActive(false)

    textChangeStatusRef.current = false
  }

  const onSelect = (key, item) => {
    const obj = { key, title: item.props.title }
    setSelected(obj)
    selectCB(obj, comData)
    setActive(false)

    textChangeStatusRef.current = false
  }

  const onChange = () => {
    if (textChangeStatusRef.current !== true) {
      autoRef.current.blur()
    }
  }

  const onFocus = () => {
    setText('')
    setDropDownData(data)
    setActive(true)
    textChangeStatusRef.current = true
  }

  const dataSource = buildDropDownData(dropDownData)

  const title = selected.title || prefix

  return (
    <StyledAutocompleteDropDownContainer
      className={`${containerClassName} autocomplete-dropdown`}
    >
      <AutoComplete
        dataSource={dataSource}
        dropdownClassName={className}
        className={className}
        onSearch={onSearch}
        onBlur={onBlur}
        onFocus={onFocus}
        onSelect={onSelect}
        onChange={onChange}
        value={text}
        ref={autoRef}
        notFoundContent={
          <Empty
            className="ant-empty-small"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ textAlign: 'left', margin: '10px 0' }}
            description="No matching results"
          />
        }
      >
        <Input
          title={title}
          suffix={
            <Icon type={isActive ? iconActiveType : iconType} className="" />
          }
          placeholder={selected.title}
        />
      </AutoComplete>
    </StyledAutocompleteDropDownContainer>
  )
}

export default AutocompleteDropDown
