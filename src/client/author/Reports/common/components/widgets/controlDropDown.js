/* eslint-disable array-callback-return */
import React, { useState, useCallback } from 'react'
import { Button, Dropdown, Menu, Icon, Empty } from 'antd'
import styled from 'styled-components'
import { partial } from 'lodash'
import {
  fadedGrey,
  lightGreySecondary,
  themeColor,
  themeColorBlue,
} from '@edulastic/colors'

import { useInternalEffect } from '../../hooks/useInternalEffect'

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

const ControlDropDown = ({
  className,
  containerClassName = '',
  prefix = '',
  showPrefixOnSelected = true,
  by,
  selectCB,
  data,
  comData,
  trigger = ['click'],
  buttonWidth,
  style,
}) => {
  const [selected, setSelected] = useState(by)
  const [isActive, setActive] = useState(false)

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
  }, [by])

  const handleMenuClick = useCallback(
    (event) => {
      const _selected = { key: event.key, title: event.item.props.title }
      setActive(false)
      setSelected(_selected)
      if (selectCB) {
        selectCB(event, _selected, comData)
      }
    },
    [selectCB]
  )

  const title = (selected && selected.title) || prefix

  return (
    <StyledDiv
      className={`${containerClassName} control-dropdown`}
      buttonWidth={buttonWidth}
      style={style}
    >
      <Dropdown
        onVisibleChange={setActive}
        overlay={partial(
          CustomMenu,
          className,
          data,
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
  width: ${(props) => props.maxWidth}px;
  .ant-dropdown-menu-item {
    overflow: hidden;
    text-overflow: ellipsis;
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
