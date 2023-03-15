/* eslint-disable array-callback-return */
import React, { useState, useCallback, useEffect } from 'react'
import { Button, Dropdown, Menu, Icon, Empty } from 'antd'
import styled from 'styled-components'
import { partial } from 'lodash'
import {
  fadedGrey,
  lightGreySecondary,
  themeColor,
  themeColorBlue,
} from '@edulastic/colors'

const CustomMenu = (className, data, handleMenuClick, prefix, selected) => (
  <Menu
    selectedKeys={[selected.key]}
    className={`${className}`}
    onClick={handleMenuClick}
  >
    <Menu.Item key="0" disabled>
      {data.length ? (
        prefix
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ textAlign: 'left', margin: '10px 0' }}
        />
      )}
    </Menu.Item>
    {data.map((item) => (
      <Menu.Item key={item.key} title={item.title}>
        {item.title}
      </Menu.Item>
    ))}
  </Menu>
)

const NO_ITEM = { key: '', title: '' }

function ControlDropDown({
  value,
  onChange,
  options,
  labelInValue = false,
  className,
  containerClassName = '',
  prefix = '',
  showPrefixOnSelected = true,
  trigger = ['click'],
  buttonWidth,
  style,
  height = '32px',
}) {
  const [selected, setSelected] = useState(value)
  const [isActive, setActive] = useState(false)

  useEffect(() => {
    const refreshSelectedValue = () => {
      let item = options.find((_item) => {
        if (typeof value === 'string' && _item.key === value) return true
        if (typeof value === 'object' && _item.key === value.key) return true
        return false
      })
      if (!item && options.length) {
        item = options[0]
      }
      if (!item && !options.length) {
        item = NO_ITEM
      }
      setSelected(item)
    }
    refreshSelectedValue()
  }, [value, options])

  const handleMenuClick = useCallback(
    (event) => {
      const _selected = { key: event.key, title: event.item.props.title }
      setActive(false)
      setSelected(_selected)
      if (!onChange) return

      if (labelInValue) {
        return onChange(_selected, event)
      }
      return onChange(_selected.key, event)
    },
    [onChange]
  )

  const title = (selected && selected.title) || prefix

  return (
    <StyledDiv
      className={`${containerClassName} control-dropdown`}
      buttonWidth={buttonWidth}
      style={style}
      height={height}
    >
      <Dropdown
        onVisibleChange={setActive}
        overlay={partial(
          CustomMenu,
          className,
          options,
          handleMenuClick,
          prefix,
          selected
        )}
        trigger={trigger}
      >
        <Button title={title}>
          {(showPrefixOnSelected ? `${prefix} ` : '') + selected?.title}
          <Icon type={isActive ? 'up' : 'down'} />
        </Button>
      </Dropdown>
    </StyledDiv>
  )
}

const StyledDiv = styled.div`
  button {
    height: ${(props) => props.height || 'auto'};
    display: flex;
    justify-content: start;
    align-items: center;
    font-size: 11px;
    width: ${({ buttonWidth }) => buttonWidth || 'auto'};
    &.ant-btn.ant-dropdown-trigger {
      background-color: ${lightGreySecondary};
      border-color: ${fadedGrey};

      &.ant-dropdown-open {
        background-color: transparent;
      }

      &:hover,
      &:focus {
        border-color: ${themeColorBlue};
        color: ${themeColor};
      }
      i {
        color: ${themeColor};
      }
      .anticon {
        height: 13px;
        font-size: 11px;
        transform: none;
      }
    }

    span {
      flex: 1;
      text-align: left;
      overflow: hidden;
    }
  }
`

const StyledControlDropDown = styled(ControlDropDown)`
  max-height: 250px;
  overflow: auto;
  .ant-dropdown-menu-item {
    padding: 4px 12px;
    &:hover {
      background-color: ${themeColorBlue};
    }
  }

  .ant-dropdown-menu-item-selected,
  .ant-dropdown-menu-item-active {
    background-color: ${themeColorBlue};
    color: #ffffff;
  }

  .ant-dropdown-menu-item,
  .ant-dropdown-menu-submenu-title {
    font-size: 11px;
  }
`

export { StyledControlDropDown as ControlDropDown }
