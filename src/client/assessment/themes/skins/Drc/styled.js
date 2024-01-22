import styled from 'styled-components'
import { Popover, Dropdown, Menu, Icon, Button } from 'antd'
import { themeColor } from '@edulastic/colors'
import { withKeyboard } from '@edulastic/common'
import { themes } from '../../../../theme'

const {
  playerSkin: { drc },
} = themes

const { footer, header1, header2, button } = drc

export const StyledPopover = styled(Popover)`
  padding: 0;
  .ant-popover-inner-content {
    padding: 0;
  }
`

export const StyledButton = withKeyboard(styled.div`
  background-color: ${header2.background};
  border: 1px solid ${button.background};
  color: ${button.background};
  cursor: pointer;
  padding: 7px 25px;
  text-transform: uppercase;
  border-radius: 5px;
  font-size: 10px;
  &:hover {
    background: ${button.background};
    color: ${header2.background};
    border-color: ${header2.background};
  }
`)

export const ControlBtn = styled(Button)`
  border: 1px solid ${button.background};
  color: ${button.textColor};
  background-color: ${button.background};
  cursor: pointer;
  padding: 7px 20px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  text-transform: uppercase;
  svg {
    fill: ${button.textColor};
  }
  &:hover {
    background-color: ${button.textColor};
    color: ${button.background};
    border: 1px solid ${button.background};
    svg {
      fill: ${button.background};
    }
  }
  &:focus {
    outline: none;
    border: none;
    box-shadow: 0 0 0 3px ${themeColor};
  }
  i {
    display: none;
  }
  &[disabled] {
    background-color: ${button.background};
    border: 1px solid ${button.background};
    color: ${button.textColor};
    cursor: default;
    opacity: 0.3;
    svg {
      fill: ${button.textColor};
    }
  }
`

export const StyledDropdown = styled(Dropdown)``

export const StyledMenu = styled(Menu)`
  ${({ style }) => style};
  .ant-dropdown-menu-item,
  .ant-menu-item {
    font-weight: 600;
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
    height: 50px;
    width: 66px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    float: left;
    border-radius: 4px;
  }
`

export const MenuItem = withKeyboard(styled(Menu.Item)`
  &.ant-menu-item {
    background-color: ${(props) => props.bg};
    color: #fff;
    transition: all ease-in 0.3s;
    ${({ disabled }) =>
      !disabled &&
      `&:hover {
    box-shadow: 1px 2px 4px 1px #333;
  }`}
  }
`)

export const StyledHeaderTitle = styled.div`
  display: flex;
  align-items: center;
  background: ${header1.background};
  width: 100%;
  font-size: 14px;
  color: ${footer.textColor} !important;
  border-bottom: 1px solid ${header1.border};
  padding: 9px 50px;
  justify-content: space-between;
  .ant-breadcrumb-link,
  .ant-breadcrumb-separator,
  a {
    color: ${footer.textColor} !important;
  }
  svg {
    fill: ${footer.textColor};
  }
`

export const HistoryBackLeftArrow = styled(Icon)`
  margin-right: 5px;
  font-size: 10px;
`

export const Container = styled.div`
  display: flex;
  align-items: center;
`
