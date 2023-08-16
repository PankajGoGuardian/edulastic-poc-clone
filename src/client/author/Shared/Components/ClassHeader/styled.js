import {
  extraDesktopWidthMax,
  fadedBlue,
  mediumDesktopExactWidth,
  mobileWidth,
  mobileWidthMax,
  tabletWidth,
  themeColor,
  themeColorBlue,
  white,
} from '@edulastic/colors'
import { Button, Icon, Menu, Popconfirm, Switch } from 'antd'
import styled, { css } from 'styled-components'
import { themes } from '../../../../theme'
import { StyledTable as Table } from '../../../Reports/common/styled'

const classBoardTheme = themes.default.classboard

export const RightSideButtonWrapper = styled.div`
  display: flex;

  @media (max-width: ${mobileWidthMax}) {
    order: 2;
  }
`

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.header.headerBgColor};
  height: ${(props) => props.theme.HeaderHeight.xs}px;
  z-index: 1;
  padding: 0px 30px;
  &:hover {
    background-color: darken(
      ${(props) => props.theme.header.headerBgColor},
      10%
    );
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${(props) => props.theme.HeaderHeight.md}px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${(props) => props.theme.HeaderHeight.xl}px;
  }
  @media (max-width: ${mobileWidthMax}) {
    height: auto;
    padding: 10px 20px 15px;
    flex-wrap: wrap;
    border-radius: 0px;
  }
`

export const StyledTitle = styled.h1`
  color: ${white};
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  padding: 0;

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: 22px;
    margin: 20px 0;
  }
  @media (max-width: ${tabletWidth}) {
    display: flex;
    align-items: center;
  }
  @media (max-width: ${mobileWidthMax}) {
    margin: 5px 0;
    order: 1;
  }
`

export const StyledParaFirst = styled.p`
  max-width: 22rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding-right: 20px;
  font-size: ${(props) => props.theme.reviewPageHeaderFontSize};

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: ${(props) => props.theme.headerTitle};
    max-width: 400px;
  }
`

export const DownArrow = styled(Icon)`
  position: absolute;
  font-size: 12px;
  top: 7px;
  right: 5px;
  color: ${themeColor};
`

export const StyledParaSecond = styled.p`
  display: flex;
  align-items: center;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  div {
    white-space: nowrap;
    display: inline-block;
    margin-left: 3px;
  }
  span {
    margin: 0 5px;
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: 13px;
    div {
      margin-left: 0px;
    }
  }
`

export const StyledParaThird = styled.p`
  font-size: 0.83em;
  display: inline-block;
  color: white;
  margin-right: 30px;
  color: ${white};
  font-weight: bold;
`

export const StyledPopconfirm = styled(Popconfirm)``

export const StyledSwitch = styled(Switch)`
  background-color: ${classBoardTheme.SwitchColor};
`

export const StyledDiv = styled.div`
  @media (max-width: ${mobileWidth}) {
    position: absolute;
    right: 5px;
    top: 5px;
  }
`

export const Img = styled.img`
  width: 27px;
  height: 27px;
`

export const StyledButton = styled.button`
  width: 31px;
  height: 45px;
  background: transparent;
  color: ${white};
  font-size: 12px;
  border: 0px;
  :hover {
    svg {
      fill: ${fadedBlue};
    }
  }
  :focus {
    outline: none;
  }
`

export const MenuWrapper = styled.div`
  top: 46px;
  position: absolute;
  min-width: 90px;
  right: 10px;
`

export const StyledTable = styled(Table)`
  .ant-table-body {
    overflow: auto;
    table {
      thead {
        tr {
          th {
            text-align: center;
            font-weight: 900;
          }
        }
      }

      tbody {
        tr {
          td {
            text-align: center;
            font-weight: 900;
          }
        }
      }
    }
  }
  .ant-pagination {
    display: none;
  }
`

export const PresentModeSwitch = styled(Switch)`
  border-radius: 4px;
  min-width: 100px;
  height: 26px;
  line-height: 24px;
  &:after {
    border-radius: 4px;
    width: 14px;
    height: 22px;
  }
  &:not(.ant-switch-disabled):active::before,
  &:not(.ant-switch-disabled):active::after {
    width: 14px;
  }
  .ant-switch-inner {
    margin-left: 20px;
    margin-right: 6px;
    font-size: 14px;
  }
  &.ant-switch-checked {
    background: ${themeColor};
    .ant-switch-inner {
      margin-right: 20px;
      margin-left: 6px;
    }
  }
`

const commonButtonsCSS = css`
  color: ${themeColor};
  height: 100%;
  cursor: pointer;
  &:hover,
  &:focus {
    color: ${themeColor};
  }
`
export const HeaderMenuIcon = styled(Button)`
  ${commonButtonsCSS}
  width: 45px;
`

export const OpenCloseWrapper = styled.div`
  white-space: nowrap;
  display: flex;
`

export const OpenCloseButton = styled(Button)`
  ${commonButtonsCSS}
  padding: 10px 15px;
  font-size: 10px;
  margin-right: 2px;
  @media (min-width: ${mediumDesktopExactWidth}) {
    padding: 10px 30px;
    font-size: 12px;
    margin-right: 5px;
  }
`

export const MenuItems = styled(Menu.Item)`
  font-size: 12px;

  &:not(.ant-dropdown-menu-item-disabled):hover {
    color: ${white};
    background-color: ${themeColorBlue};
    > a {
      color: ${white};
    }
  }
`

export const CaretUp = styled.i`
  position: absolute;
  top: -20px;
  color: ${white};
  right: 12px;
  font-size: 30px;
`

export const DropMenu = styled(Menu)`
  margin-top: 10px;
  min-width: 175px;
`

export const ClassDropMenu = styled(DropMenu)`
  margin-top: 0px;
  max-width: 300px;
  max-height: calc(100vh - 100px);
  overflow: auto;

  .ant-dropdown-menu-item-selected {
    a {
      color: ${themeColor};
      background: ${white};
      font-weight: 700;
    }
  }

  .ant-dropdown-menu-item-selected:hover {
    a {
      color: ${white};
      background: ${themeColor};
    }
  }
`

export const StudentStatusDetails = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 20px;
  p {
    background: #f2f2f2;
    padding: 12px 10px;
    border-radius: 5px;
    font-size: 12px;
    color: #8f8f8f;
    text-align: center;
    text-transform: uppercase;
  }
`
