import styled from 'styled-components'
import {
  white,
  tabletWidth,
  themeColor,
  extraDesktopWidth,
  extraDesktopWidthMax,
  greyThemeLighter,
  smallDesktopWidth,
  mobileWidthLarge,
  themeColorBlue,
} from '@edulastic/colors'

import { Layout, Menu as AntMenu, Row, Icon as AntIcon } from 'antd'

import {
  IconLogoCompact,
  IconExclamationMark,
  IconCircleCheck,
  IconQuestion,
} from '@edulastic/icons'

export const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  background-color: black;
  opacity: 0.2;
  z-index: 1000;
`

export const FixedSidebar = styled.div`
  position: fixed;
  left: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 1002;
  cursor: ${(props) => (props.isCollapsed ? 'pointer' : 'initial')};

  @media (max-width: ${tabletWidth}) {
    z-index: 1000;
    max-width: 220px;
    display: block !important;
    .scrollbar-container {
      padding-top: 25px;
    }
  }
`
export const SideBar = styled(Layout.Sider)`
  height: 100%;
  width: 220px;
  max-width: 220px;
  min-width: 220px;
  background-color: #2f4151;
  z-index: 22;
  padding-bottom: 0;

  &.ant-layout-sider-collapsed .userinfoBtn .ant-select-arrow {
    right: 15px;
    top: 25px;
  }
  &.ant-layout-sider-collapsed .ant-select-selection-selected-value {
    display: none !important;
  }
  &.ant-layout-sider-has-trigger .ant-layout-sider-trigger {
    display: none !important;
  }
  &.ant-layout-sider-collapsed .ant-select {
    width: auto;
    padding-left: 5px;
  }
  .ant-layout-sider-zero-width-trigger {
    top: 10px;
    right: -50px;
    color: ${white};
    background: transparent;
    display: none;
  }
  .ant-select {
    width: 125px;
  }
  @media (max-width: ${mobileWidthLarge}) {
    &.ant-layout-sider-collapsed {
      min-width: 0px !important;
      max-width: 0px !important;
    }

    .mobileCloseIcon {
      margin-right: 24px;
      svg {
        width: 20px !important;
        height: 20px !important;
        fill: #c2c6cb;
      }
    }

    ${({ collapsed }) =>
      collapsed
        ? `
      flex: inherit;
      max-width: 220px;
      min-width: 0;
      width: 100%;
    `
        : ``}
  }
  @media print {
    display: none;
  }
`

export const LogoWrapper = styled(Row)`
  height: ${({ theme }) => theme.HeaderHeight.xl}px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 25px;
  margin-bottom: 8px;

  @media (max-width: ${extraDesktopWidthMax}) {
    height: ${({ theme }) => theme.HeaderHeight.md}px;
  }
  @media (max-width: ${smallDesktopWidth}) {
    height: ${({ theme }) => theme.HeaderHeight.sd}px;
  }
  @media (max-width: ${mobileWidthLarge}) {
    height: ${({ theme }) => theme.HeaderHeight.xs}px;
  }
`

export const ToggleSidemenu = styled.div`
  position: absolute;
  right: -10px;
  top: 51px;
  background: ${greyThemeLighter};
  height: 20px;
  width: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1;
  box-shadow: 0px 2px 5px #00000029;
  svg {
    width: 12px;
    fill: ${themeColor};
  }

  @media (max-width: ${mobileWidthLarge}) {
    display: none;
  }
`

export const MenuWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  flex-direction: column;
  padding: 0;
  position: relative;
  overflow: hidden;
  min-height: ${({ theme }) => `calc(100% - ${theme.HeaderHeight.xl}px)`};

  @media (max-height: 720px) {
    padding: 2px 0px 0px;
  }

  @media (max-width: ${extraDesktopWidthMax}) {
    min-height: ${({ theme }) => `calc(100% - ${theme.HeaderHeight.md}px)`};
  }
  @media (max-width: ${smallDesktopWidth}) {
    min-height: ${({ theme }) => `calc(100% - ${theme.HeaderHeight.sd}px)`};
  }
  @media (max-width: ${mobileWidthLarge}) {
    min-height: ${({ theme }) => `calc(100% - ${theme.HeaderHeight.xs}px)`};
  }
`

export const Menu = styled(AntMenu)`
  background: transparent;
  overflow: auto;
  height: ${({ isBannerShown }) =>
    isBannerShown ? 'calc(100vh - 270px)' : 'calc(100vh - 235px)'};
  &:not(.ant-menu-horizontal) {
    .ant-menu-item-selected {
      color: ${white};
      background-color: transparent;

      svg {
        fill: ${(props) => props.theme.sideMenu.menuSelectedItemLinkColor};
      }

      &:before {
        opacity: 1;
      }

      &.removeSelectedBorder {
        border: none;
        background-color: ${themeColor};
        &:hover {
          background-color: #fff;
          svg {
            fill: ${themeColor};
          }
        }
      }
    }
  }

  &.ant-menu-vertical .ant-menu-item:after,
  &.ant-menu-vertical-left .ant-menu-item:after,
  &.ant-menu-vertical-right .ant-menu-item:after,
  &.ant-menu-inline .ant-menu-item:after {
    content: unset;
  }
  &.ant-menu-inline,
  &.ant-menu-vertical,
  &.ant-menu-vertical-left {
    border-right: 0px;
  }
  &.ant-menu-inline {
    overflow-x: hidden;
    overflow-y: auto;

    @media (max-width: ${tabletWidth}) {
      height: auto;
    }
  }
  &.ant-menu-inline .ant-menu-item {
    font-family: Open Sans;
    font-size: 14px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.36;
    letter-spacing: 0.3px;
    text-align: left;
    display: flex;
    align-items: center;
    margin: 0 0 8px;
    height: 38px;
    padding: 5px 25px !important;
    max-width: 100%;
  }
  &.ant-menu-inline-collapsed {
    width: 70px;
  }
  &.ant-menu-inline-collapsed > .ant-menu-item {
    display: flex;
    text-align: center;
    justify-content: center;
    margin: 0 0 8px;
    padding: 0px 10px !important;
    height: 38px;
    width: 100%;
  }
  @media (max-height: 780px) {
    &.ant-menu-inline-collapsed > .ant-menu-item,
    &.ant-menu-inline .ant-menu-item {
      margin: 0px 0px 6px;
    }
  }
  @media (max-height: 730px) {
    &.ant-menu-inline-collapsed > .ant-menu-item,
    &.ant-menu-inline .ant-menu-item {
      height: 34px;
      margin: 0px 0px 4px;
    }
  }
  @media (max-height: 680px) {
    &.ant-menu-inline-collapsed > .ant-menu-item,
    &.ant-menu-inline .ant-menu-item {
      height: 32px;
      &:before {
        left: 15px;
        right: 15px;
      }
      &[data-cy='library'],
      &[data-cy='user management'] {
        height: 20px;
        font-size: 12px;
      }
    }
  }
  @media (min-width: ${extraDesktopWidth}) {
    &.ant-menu-inline-collapsed > .ant-menu-item,
    &.ant-menu-inline .ant-menu-item {
      margin: 0 0 10px;
    }
  }
  .ant-menu-item {
    position: relative;
    background: transparent;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 14px;
      right: 14px;
      border-radius: 4px;
      background: ${(props) => props.theme.sideMenu.menuSelectedItemBgColor};
      z-index: -1;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s ease;
    }
  }
  .ant-menu-item:not(.ant-menu-item-selected) {
    svg {
      position: relative;
      z-index: 5;
      fill: ${(props) => props.theme.sideMenu.menuItemLinkColor};
    }
    &:hover {
      svg {
        fill: ${(props) => props.theme.sideMenu.menuItemLinkHoverColor};
      }
      color: ${(props) => props.theme.sideMenu.menuItemLinkHoverColor};
    }
  }

  @media (max-height: 780px) {
    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: transparent;
    }

    &:hover {
      &::-webkit-scrollbar-track {
        background: #2f4151;
      }

      &::-webkit-scrollbar-thumb {
        background: #557390;
      }
    }
  }
  @media (max-height: 720px) {
    height: ${({ isBannerShown }) =>
      isBannerShown ? 'calc(100vh - 250px)' : 'calc(100vh - 225px)'};
  }
  @media (max-height: 650px) {
    height: ${({ isBannerShown }) =>
      isBannerShown ? 'calc(100vh - 205px)' : 'calc(100vh - 185px)'};
  }
  @media (max-height: 600px) {
    height: ${({ isBannerShown }) =>
      isBannerShown ? 'calc(100vh - 165px)' : 'calc(100vh - 135px)'};
  }
`

export const MenuItem = styled(AntMenu.Item)`
  font-family: Open Sans;
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: 0.3px;
  text-align: left;
  color: ${(props) =>
    props.divider
      ? props.theme.sideMenu.sidebarDividerColor
      : props.theme.sideMenu.menuItemLinkColor};
  display: ${(props) => (props.visible ? 'flex' : 'none !important')};
  align-items: center;
  margin-top: 16px;
  text-transform: ${({ divider }) => divider && 'uppercase'};
  &.ant-menu-item-disabled,
  &.ant-menu-submenu-disabled {
    color: rgba(121, 143, 163, 0.3) !important;
    & svg {
      fill: rgba(121, 143, 163, 0.3) !important;
    }
  }
`

export const UserName = styled.div`
  font-size: ${(props) => props.theme.sideMenu.userInfoNameFontSize};
  color: ${(props) => props.theme.sideMenu.userInfoNameTextColor};
  text-transform: capitalize;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

export const UserType = styled.div`
  font-size: 12px;
  color: ${(props) =>
    props.isVisible ? white : props.theme.sideMenu.userInfoRoleTextColor};
  width: 96%;
`

export const FooterDropDown = styled.div`
  position: relative;
  opacity: ${(props) => (props.isVisible ? '1' : '0')};
  transition: 0.2s;
  -webkit-transition: 0.2s;
  ul {
    overflow: hidden;
    max-width: 100%;
    .ant-menu-item:not(.ant-menu-item-selected) svg {
      fill: ${(props) => props.theme.sideMenu.userInfoDropdownItemTextColor};
      &:hover,
      &:focus {
        fill: ${(props) =>
          props.theme.sideMenu.userInfoDropdownItemTextHoverColor};
      }
    }
    &.ant-menu-inline-collapsed {
      width: 84px;
      height: auto;
      margin-top: ${(props) => (props.isCollapsed ? '0' : '10px')};
      margin-left: ${(props) => (props.isCollapsed ? '0' : '8px')};
      box-shadow: ${(props) =>
        props.isCollapsed ? '0 -3px 5px 0 rgba(0,0,0,0.07)' : 'none'};

      li {
        &.ant-menu-item {
          margin: 0px;
          height: 58px;
        }
      }
    }
    li {
      &.ant-menu-item {
        margin: 0px;
        margin-bottom: 0 !important;
        padding: 5px 16px;
        height: 50px;
        background: ${(props) =>
          props.theme.sideMenu.userInfoDropdownItemBgColor};
        /* &:hover,
        &:focus {
          background: ${(props) =>
          props.theme.sideMenu.userInfoDropdownItemBgHoverColor};
        } */
        a {
          color: ${(props) =>
            props.theme.sideMenu.userInfoDropdownItemTextColor};
          font-size: ${(props) =>
            props.theme.sideMenu.userInfoDropdownItemFontSize};
          font-weight: 600;
          display: flex;
          align-items: center;
          padding-left: 10px;
          &:focus,
          &:hover {
            svg,
            svg path {
              fill: ${(props) =>
                props.theme.sideMenu.userInfoDropdownItemTextHoverColor};
            }
          }
          &:focus {
            color: ${(props) =>
              props.theme.sideMenu.userInfoDropdownItemTextHoverColor};
            a {
              color: ${(props) =>
                props.theme.sideMenu.userInfoDropdownItemTextHoverColor};
            }
          }
          svg {
            margin-right: 15px;
            padding-left: 5px;
            height: 23px;
            width: 23px;
          }
        }
        span:hover {
          color: ${white};
        }
      }
    }
  }
`

export const MenuFooter = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
`

export const HelpText = styled.span`
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: ${({ isCollapsed }) => (isCollapsed ? 'none' : 'block')};
`

export const QuestionButton = styled.div`
  margin: 0 0 6px;
  display: flex;
  position: relative;
  overflow: hidden;
  align-items: center;
  padding: ${({ isCollapsed }) => (isCollapsed ? '4px 0px' : '5px 25px')};
  justify-content: ${({ isCollapsed }) =>
    isCollapsed ? 'center' : 'flex-start'};
  font-size: ${(props) => props.theme.sideMenu.helpButtonFontSize};
  color: ${(props) => props.theme.sideMenu.helpButtonTextColor};
  cursor: pointer;

  svg {
    fill: ${(props) => props.theme.sideMenu.helpIconColor};
  }
  span {
    font-weight: 600;
  }
  &:hover {
    color: ${(props) => props.theme.sideMenu.helpButtonTextHoverColor};
    svg {
      fill: ${(props) => props.theme.sideMenu.helpIconHoverColor};
    }
  }

  @media (max-height: 720px) {
    margin: 4px 0px;
  }
  @media (max-height: 650px) {
    display: none;
  }
`

export const UserImg = styled.div`
  width: ${({ isCollapsed }) => (isCollapsed ? '45px' : '50px')};
  height: ${({ isCollapsed }) => (isCollapsed ? '45px' : '50px')};
  background: url(${(props) => props.src});
  background-position: center center;
  background-size: cover;
  border-radius: 50%;
  margin: ${({ isCollapsed }) =>
    isCollapsed ? '0px auto' : '10px 10px 15px 20px'};
`

export const UserInfoButton = styled.div`
  cursor: pointer;
  position: relative;
  &.active {
    padding: 0;
    background: transparent;
    border-radius: 50%;
    width: ${({ isCollapsed }) => (isCollapsed ? '45px' : '50px')};
    margin: 0 auto;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);

    img {
      box-shadow: none;
    }
  }

  .ant-dropdown {
    left: 0px !important;
    top: unset !important;
    bottom: 80px !important;
    @media (max-width: ${mobileWidthLarge}) {
      bottom: 75px !important;
    }
    @media (max-height: 720px) {
      bottom: 70px !important;
    }
  }

  .footerDropdown {
    width: 100%;
    height: ${({ isCollapsed }) => (isCollapsed ? '70px' : '80px')};
    padding: ${({ isCollapsed }) => (isCollapsed ? '10px 0px' : '15px 0px')};
    background-color: ${({ theme, isCollapsed, isVisible }) =>
      isCollapsed
        ? ''
        : isVisible
        ? theme.sideMenu.userInfoButtonBgHoverColor
        : theme.sideMenu.userInfoButtonBgColor};
    display: flex;
    align-items: center;
    position: relative;
    font-weight: 600;
    transition: 0.2s;
    -webkit-transition: 0.2s;
    @media (max-height: 720px) {
      height: ${({ isCollapsed }) => (isCollapsed ? '60px' : '70px')};
      padding: ${({ isCollapsed }) => (isCollapsed ? '7px 0px' : '10px 0px')};
    }
  }
  .ant-select-selection {
    background: transparent;
    border: 0px;
    color: ${white};
  }

  @media (max-width: ${mobileWidthLarge}) {
    &.active {
      opacity: 0;
      pointer-events: none;
      background: transparent;
    }
  }
`

export const PseudoDiv = styled.div`
  width: ${({ isCollapsed }) => (isCollapsed ? '45px' : '50px')};
  height: ${({ isCollapsed }) => (isCollapsed ? '45px' : '50px')};
  line-height: ${({ isCollapsed }) => (isCollapsed ? '45px' : '50px')};
  border-radius: 50%;
  background: #dddddd;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  margin: ${({ isCollapsed }) => (isCollapsed ? '0px auto' : '0px 15px')};
`

export const LogoCompact = styled(IconLogoCompact)`
  width: 22px;
  height: 25px;
  fill: #0eb08d;
  &:hover {
    fill: #0eb08d;
  }
`

export const IconContainer = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
  position: ${({ isCollapsed }) => (isCollapsed ? 'absolute' : 'relative')};

  &.active {
    margin-right: 0;
    box-shadow: none;
  }
`

export const HelpIcon = styled(IconQuestion)`
  fill: #1fe3a1;
  width: auto;
  height: 22px;
`
export const IconContainerDiv = styled.div`
  position: absolute;
  top: ${({ isCollapsed }) => (isCollapsed ? '5px' : '8px')};
  left: ${({ isCollapsed }) => (isCollapsed ? '30px' : '50px')};
`
export const CheckCircleIcon = styled(IconCircleCheck)`
  width: auto;
  height: 16px;
  margin-left: -10px;
`
export const ExclamationIcon = styled(IconExclamationMark)`
  width: auto;
  height: 16px;
`

export const IconDropdown = styled(AntIcon)`
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
  color: ${(props) => props.theme.sideMenu.dropdownIconColor};
`

export const LabelMenuItem = styled.span`
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: ${({ isCollapsed }) => (isCollapsed ? 'none' : 'block')};
`

export const Hr = styled.div`
  border: ${({ theme }) => `1px solid ${theme.sideMenu.sidebarDividerColor}`};
  opacity: 0.2;
  width: 80%;
`
export const PopConfirmWrapper = styled.div`
  .ant-popover.ant-popover-placement-bottomRight {
    position: fixed;
    top: auto !important;
    bottom: 30px;
    left: ${({ isCollapsed }) => (isCollapsed ? '80px' : '230px')} !important;
  }

  .ant-popover-buttons {
    .ant-btn {
      background: none !important;
      border: none !important;
      position: absolute;
      right: 2px;
      top: 2px;
    }
    .ant-btn-primary {
      display: none;
    }
  }

  .ant-popover-arrow {
    display: block !important;
    position: fixed;
    top: auto !important;
    bottom: 40px;
    left: ${({ isCollapsed }) => (isCollapsed ? '77px' : '227px')} !important;
    width: 15px;
    height: 15px;
    transform: rotate(-45deg);
  }

  .ant-popover-message {
    padding: 4px 0px;

    svg {
      float: left;
      margin-top: 6px;
      transform: scale(1.4);

      path:first-child {
        fill: ${themeColorBlue};
      }
    }
  }

  .ant-popover-message-title {
    color: white;
    width: 315px;
    padding-left: 30px;
    font-weight: 600;
    font-size: 16px;
  }

  .ant-popover-inner {
    background: #2f4151;
  }

  .ant-popover-placement-bottom > .ant-popover-content > .ant-popover-arrow,
  .ant-popover-placement-bottomLeft > .ant-popover-content > .ant-popover-arrow,
  .ant-popover-placement-bottomRight
    > .ant-popover-content
    > .ant-popover-arrow {
    border-top-color: #2f4151;
    border-left-color: #2f4151;
  }
`
export const CloseIconWrapper = styled.div`
  margin-top: -6px;
  float: right;

  &:hover {
    cursor: pointer;
  }

  svg {
    float: left;
    margin-top: 6px;
    transform: scale(0.6) !important;

    path:first-child {
      fill: ${white} !important;
    }
  }
`

export const DemoPlaygroundButtonContainer = styled.div`
  margin: 0 0 6px;
  display: flex;
  position: relative;
  overflow: hidden;
  align-items: center;
  padding: ${({ isCollapsed }) => (isCollapsed ? '5px 0px' : '5px 25px')};
  justify-content: ${({ isCollapsed }) =>
    isCollapsed ? 'center' : 'flex-start'};
  font-size: ${(props) => props.theme.sideMenu.helpButtonFontSize};
  cursor: pointer;
  span {
    font-weight: 600;
  }
  @media (max-height: 720px) {
    margin: 5px 0px;
  }
  @media (max-height: 600px) {
    display: none;
  }
`

export const DemoPlaygroundButton = styled.div`
  display: inline-flex;
  color: #7c93a7;
  &:hover {
    svg path {
      fill: ${themeColor};
    }
    span {
      color: ${themeColor};
    }
  }
`

export const SideMenuContainer = styled.div`
  display: inline;
`
