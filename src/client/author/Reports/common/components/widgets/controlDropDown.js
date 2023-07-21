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

function searchItemOrDefault(data, searchItem) {
  let item = null
  if (data.length) {
    item = data.find((_item) => {
      if (typeof searchItem === 'string' && _item.key === searchItem) {
        return true
      }
      if (
        searchItem &&
        typeof searchItem === 'object' &&
        _item.key === searchItem.key
      ) {
        return true
      }
    })
    if (!item) {
      item = data[0]
    }
  } else {
    item = { key: '', title: '' }
  }
  return item
}

const ControlDropDown = ({
  className,
  dataCy = '',
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
  height = '32px',
}) => {
  const [selected, setSelected] = useState(by)
  const [isActive, setActive] = useState(false)

  // FIXME: WHY Internal Effect ??
  // (setState synchronously in render fn is wrong.)
  // Moreover, setState is asynchronous, so it'll take effect in next render anyways.
  useInternalEffect(() => {
    // FIXME: `selected` should be `by`. Otherwise, when both `by` and `data` change, `selected` will be `data[0]` instead of `by`.
    const item = searchItemOrDefault(data, selected)
    setSelected(item)
  }, [data])

  useInternalEffect(() => {
    const item = searchItemOrDefault(data, by)
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
      data-cy={dataCy}
      buttonWidth={buttonWidth}
      style={style}
      height={height}
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
