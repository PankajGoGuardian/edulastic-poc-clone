import React from 'react'
import Dropdown from 'antd/lib/dropdown'
import Menu from 'antd/lib/menu'
import styled from 'styled-components'
import { IconCaretDown, IconClose } from '@edulastic/icons'

const ActionMenu = () => {
  const menu = (
    <Menu>
      <Header>
        <h2>Actions</h2>
        <IconClose />
      </Header>
      <Menu.Item key="0">
        <a href="http://www.alipay.com/">View Summary</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1">
        <a href="http://www.taobao.com/">View Trends</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">Delete</Menu.Item>
    </Menu>
  )
  return (
    <Dropdown
      overlayClassName="action-menu"
      overlay={menu}
      placement="bottomCenter"
      trigger={['click']}
    >
      <a onClick={(e) => e.preventDefault()}>
        Actions
        <IconCaretDown />
      </a>
    </Dropdown>
  )
}

const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  h2 {
    font-weight: 700;
    font-size: 10px;
    line-height: 30px;
    text-align: center;
    border-bottom: 1px solid #eeeeee;
    width: fit-content;
    padding: 0 10px;
  }
  svg {
    cursor: pointer;
    position: absolute;
    top: 5px;
    right: 5px;
    width: 5px;
    height: 5px;
  }
`

export default ActionMenu
