import styled from 'styled-components'
import { Popover, Dropdown, Menu, Icon } from 'antd'
// import { smallDesktopWidth } from '@edulastic/colors'
import { themes } from '../../../../theme'

const {
  playerSkin: { quester },
} = themes
const { defaultButton, menuItem, breadcrumb, header } = quester

export const StyledPopover = styled(Popover)`
  padding: 0;
  .ant-popover-inner-content {
    padding: 0;
  }
`

export const StyledButton = styled.div`
  background-color: #a2d8fd;
  border: none;
  color: #334049;
  cursor: pointer;
  font-weight: bold;
  padding: 7px 15px;
  text-transform: capitalize;
`

export const ControlBtn = styled.button`
  border: none;
  color: #334049;
  cursor: pointer;
  font-weight: bold;
  padding: 7px 15px;
  background-color: #a2d8fd;
  &[disabled] {
    cursor: default;
    opacity: 0.3;
    svg {
      fill: ${defaultButton.color};
    }
  }
`

export const StyledDropdown = styled(Dropdown)``

export const StyledMenu = styled(Menu)`
  ${({ style }) => style};
  .ant-dropdown-menu-item,
  .ant-menu-item {
    font-weight: 600;
    &:hover {
      background: ${menuItem.hover.background};
      color: ${menuItem.hover.color};
    }
  }
  .ant-dropdown-menu-item-disabled {
    &:hover {
      color: rgba(0, 0, 0, 0.25);
      background: white;
    }
  }
  .ant-dropdown-menu-item {
    display: flex;
    justify-content: space-between;
  }
  .ant-menu-item {
    height: 76px;
    width: 66px;
    border: 2px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    float: left;
    svg {
      margin-right: 6px;
    }
  }
`

export const StyledHeaderTitle = styled.div`
  display: flex;
  align-items: center;
  background: ${header.background};
  width: 100%;
  font-size: 14px;
  color: ${breadcrumb.color}!important;
  border-bottom: 1px solid #2b2b2b;
  padding: 8px 15px;
  justify-content: space-between;
  .ant-breadcrumb-link,
  .ant-breadcrumb-separator,
  a {
    color: ${breadcrumb.color}!important;
  }
  svg {
    fill: ${breadcrumb.color};
  }
`

export const HistoryBackLeftArrow = styled(Icon)`
  margin-right: 5px;
  font-size: 10px;
`

export const Container = styled.div``
