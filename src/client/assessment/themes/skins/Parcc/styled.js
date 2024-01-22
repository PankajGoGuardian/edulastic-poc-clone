import styled from 'styled-components'
import { Popover, Button, Dropdown, Menu, Icon } from 'antd'
import {
  smallDesktopWidth,
  themeColor,
  themeColorBlue,
} from '@edulastic/colors'
import { themes } from '../../../../theme'

const {
  playerSkin: { parcc },
} = themes
const { defaultButton, navigationButtons, menuItem, breadcrumb } = parcc

export const StyledPopover = styled(Popover)`
  padding: 0;
  .ant-popover-inner-content {
    padding: 0;
  }
`

export const StyledButton = styled.button`
  margin-right: 10px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  padding: 5px 10px;
  letter-spacing: 0.5px;
  border-radius: 4px;
  border: 1px solid;
  cursor: pointer;
  font-weight: 600;
  ${({ theme, active, style }) => `
    color: ${active ? defaultButton.active.color : defaultButton.color};
    background: ${
      active ? defaultButton.active.background : defaultButton.background
    };
    border-color: ${theme.default.headerButtonBorderColor};
    font-size: 11px;
    width: 151px;
    height: 40px;
    ${style};
    &:hover,
    &:focus,
    &:active {
      background: ${defaultButton.active.background};
      border-color: ${theme.default.headerLeftButtonBgHoverColor};
      color: ${defaultButton.active.color};
      svg {
        fill: ${defaultButton.active.color};
      }
    }
    &:focus {
      border: none;
      outline: 0;
      box-shadow: 0 0 0 2px ${themeColorBlue};
    }
    svg {
      margin-right: 25px;
      fill: ${active ? defaultButton.active.color : defaultButton.color};
      &:hover {
        fill: ${defaultButton.active.color};
      }
    }
  `}

  @media (max-width: ${smallDesktopWidth}) {
    span {
      display: none;
    }
    svg {
      margin-right: 0px;
    }
  }
`

export const ControlBtn = styled(Button)`
  &[disabled] {
    color: ${defaultButton.color};
    background: ${defaultButton.background};
    svg {
      fill: ${defaultButton.color};
    }
  }
  font-size: 11px;
  width: 45px;
  height: 40px;
  border: none;
  text-transform: uppercase;
  ${({ style }) => style};
  background: ${navigationButtons.background};
  color: ${navigationButtons.color};
  &:hover {
    background: ${navigationButtons.background};
    color: ${navigationButtons.color};
  }
  &:focus {
    background: ${navigationButtons.background};
    border: none;
    outline: 0;
    box-shadow: 0 0 0 3px ${themeColor};
  }
  svg {
    fill: ${navigationButtons.color};
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
    padding: 8px 12px;
    height: 36px;
    line-height: 22px;
    svg {
      margin-right: 6px;
    }
  }
`

export const StyledHeaderTitle = styled.div`
  display: flex;
  align-items: center;
  background: ${breadcrumb.background};
  width: 100%;
  font-size: ${breadcrumb.fontSize};
  padding: 8px 80px;
  color: ${breadcrumb.color}!important;
  font-weight: bold;
  text-transform: uppercase;
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

export const Container = styled.div`
  margin-left: 40px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  span {
    line-height: 11px;
  }
`
