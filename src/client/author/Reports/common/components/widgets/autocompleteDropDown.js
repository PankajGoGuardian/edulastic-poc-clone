/* eslint-disable array-callback-return */
import React, { useState, useRef } from 'react'
import { AutoComplete, Input, Icon, Empty } from 'antd'
import styled from 'styled-components'

import {
  black,
  lightGreySecondary,
  themeColor,
  themeColorBlue,
} from '@edulastic/colors'
import { useInternalEffect } from '../../hooks/useInternalEffect'

import { StyledAutocompleteDropDownContainer } from '../../styled'

const Option = AutoComplete.Option
const OptGroup = AutoComplete.OptGroup

const AutocompleteDropDown = ({
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

  const descText = selected.desc ? `: ${selected.desc}` : ''
  const title = selected.title ? `${selected.title}${descText}` : prefix

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

const StyledAutocompleteDropDown = styled(AutocompleteDropDown)`
  .ant-input {
    background-color: ${lightGreySecondary};
    border-radius: 3px;
    padding: 16px;
    padding-right: 24px;
    font-size: 11px;
    font-weight: 600;
    &:focus {
      outline: 0px;
      box-shadow: none;
      border-color: ${themeColor};
    }
  }

  .ant-select-dropdown-menu {
    display: flex;
    flex-direction: column;
    .ant-select-dropdown-menu-item-group {
      display: flex;
      flex-direction: column;
      .ant-select-dropdown-menu-item-group-title {
        font-weight: 600;
        color: ${black};
        cursor: default;
      }
      .ant-select-dropdown-menu-item-group-list {
        flex: 1;
        overflow: auto;
        > .ant-select-dropdown-menu-item {
          padding-left: 12px;
          justify-content: left;
        }
      }
    }
  }
  .ant-select-dropdown-menu-item-disabled {
    font-weight: 600;
    color: ${black};
    cursor: default;
  }

  .anticon {
    height: 13px;
    font-size: 11px;
  }
  .ant-select-dropdown-menu-item {
    font-size: 11px;
  }
  .ant-input-suffix .anticon-loading {
    font-size: 1.4em;
    & > svg {
      fill: ${themeColorBlue};
    }
  }
`

export { StyledAutocompleteDropDown as AutocompleteDropDown }
