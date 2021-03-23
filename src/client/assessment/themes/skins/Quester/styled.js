import styled from 'styled-components'
import { Popover, Dropdown, Menu, Icon } from 'antd'
import { themes } from '../../../../theme'

const {
  playerSkin: { quester },
} = themes

const { footer, header1, header2, button } = quester

export const StyledPopover = styled(Popover)`
  padding: 0;
  .ant-popover-inner-content {
    padding: 0;
  }
`

export const StyledButton = styled.div`
  background-color: ${header2.background};
  border: 1px solid ${button.background};
  color: ${button.background};
  cursor: pointer;
  padding: 8px 25px;
  text-transform: uppercase;
  border-radius: 5px;
  font-size: 12px;
  &:hover {
    background: ${button.background};
    color: ${header2.background};
    border-color: ${header2.background};
  }
  &:focus {
    outline: none;
  }
`

export const ControlBtn = styled.button`
  border: 1px solid ${button.background};
  color: ${button.textColor};
  background-color: ${button.background};
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  font-size: 12px;
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

export const MenuItem = styled(Menu.Item)`
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
`

export const StyledHeaderTitle = styled.div`
  display: flex;
  align-items: center;
  background: ${header1.background};
  width: 100%;
  font-size: 14px;
  color: ${footer.textColor} !important;
  border-bottom: 1px solid ${header1.border};
  padding: 8px 50px;
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

export const Container = styled.div``
