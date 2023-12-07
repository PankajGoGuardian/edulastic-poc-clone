import {
  extraDesktopWidth,
  greyThemeLighter,
  mobileWidthLarge,
  tabletWidth,
  themeColor,
  white,
} from '@edulastic/colors'
import { OnDarkBgLogo } from '@edulastic/common'
import {
  IconProfileHighlight,
  IconSignoutHighlight,
  IconSwitchUser,
} from '@edulastic/icons'
import { Dropdown, Icon, Layout, Menu } from 'antd'
import { get } from 'lodash'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'redux'
import styled from 'styled-components'
import { AssessPeardeckLabelOnDarkBgLogo } from '@edulastic/common/src/components/EduLogo'
import { logoutAction } from '../../author/src/actions/auth'
import { AssessPeardeckLogoCompact, LogoCompact } from './StyledComponents'
import { toggleSideBarAction } from '../../author/src/actions/toggleMenu'
import SwitchUserModal from '../../common/components/SwtichUserModal/SwitchUserModal'
import { switchUser } from '../../author/authUtils'
import { isEASuperAdmin } from './Utils'
import {
  getAccountSwitchDetails,
  getUserOrgId,
} from '../../author/src/selectors/user'
import { isPearDomain } from '../../../utils/pear'
import { SideMenuContainer } from '../../author/src/Sidebar/styledComponents'

const { Sider } = Layout

const siderMenuData = [
  {
    icon: 'pie-chart',
    label: 'Proxy',
    href: '/admin/proxyUser',
  },
  {
    icon: 'team',
    label: 'Clever Search',
    href: '/admin/search/clever',
  },
  {
    icon: 'team',
    label: 'Edlink Setup',
    href: '/admin/search/classlink',
  },
  {
    icon: 'team',
    label: 'Upgrade Plan',
    href: '/admin/upgrade',
  },

  {
    icon: 'team',
    label: 'Api Forms',
    href: '/admin/apiForms',
  },
  {
    icon: 'team',
    label: 'Content',
    href: '/admin/content/collections',
  },
  {
    icon: 'team',
    label: 'Custom Report',
    href: '/admin/customReport',
  },
]

const SideMenu = ({
  history,
  location,
  logoutBtn,
  profileThumbnail,
  userRole,
  firstName,
  middleName,
  lastName,
  isCollapsed,
  toggleState,
  toggleSideBar,
  userId,
  permissions,
  switchDetails,
  orgId,
}) => {
  const [isVisible, toggleIsVisible] = useState(false)
  const [showModal, toggleShowModal] = useState(false)
  const [isExpandedOnHover, setIsExpandedOnHover] = useState(false)

  const userName = `${firstName} ${middleName ? `${middleName} ` : ``} ${
    lastName || ``
  }`

  const toggleDropdown = () => {
    toggleIsVisible(!isVisible)
  }

  const getInitials = () => {
    if (firstName && lastName) return `${firstName[0] + lastName[0]}`
    if (firstName) return `${firstName.substr(0, 2)}`
    if (lastName) return `${lastName.substr(0, 2)}`
  }

  const onClickFooterDropDownMenu = ({ key }) => {
    if (key === '1') {
      toggleDropdown()
      toggleSideBar
    }
    if (key === '3') {
      toggleShowModal(!showModal)
      toggleIsVisible(!isVisible)
    }
  }

  const personId = get(switchDetails, 'personId')

  const menuItem = (item) => (
    <Menu.Item
      data-cy={item.label}
      onClick={() => {
        toggleState(false)
        if (item.href) {
          history.push(item.href)
        }
      }}
      key={item.href}
    >
      <Icon title={item.label} type={item.icon} />
      <span>{item.label}</span>
    </Menu.Item>
  )
  const footerDropdownMenu = (
    <FooterDropDown
      data-cy="footer-dropdown"
      isVisible={isVisible}
      isCollapsed={isCollapsed}
    >
      <Menu onClick={onClickFooterDropDownMenu} style={{ height: 'auto' }}>
        <Menu.Item key="1" className="removeSelectedBorder">
          <Link to="/admin/profile">
            <IconProfileHighlight /> {isCollapsed ? '' : 'My Profile'}
          </Link>
        </Menu.Item>
        {personId && (
          <Menu.Item key="3" className="removeSelectedBorder">
            <a>
              <IconSwitchUser />
              <span data-cy="switch-user">
                {isCollapsed ? '' : 'Switch Account'}{' '}
              </span>
            </a>
          </Menu.Item>
        )}
        <Menu.Item
          data-cy="signout"
          key="0"
          className="removeSelectedBorder"
          onClick={logoutBtn}
        >
          <a>
            <IconSignoutHighlight /> {isCollapsed ? '' : 'Logout'}
          </a>
        </Menu.Item>
      </Menu>
    </FooterDropDown>
  )

  return (
    <Sidebar
      isCollapsed={isCollapsed}
      className="admin-sidebar"
      width="220"
      collapsible
      trigger={null}
      collapsed={isCollapsed}
      role="navigation"
    >
      <ToggleSidemenu onClick={() => toggleState((val) => !val)}>
        <Icon type={isCollapsed ? 'right' : 'left'} />
      </ToggleSidemenu>
      <SideMenuContainer
        onMouseEnter={
          isCollapsed && !isExpandedOnHover
            ? () => {
                toggleState((val) => !val)
                setIsExpandedOnHover(true)
              }
            : null
        }
        onMouseLeave={
          !isCollapsed && isExpandedOnHover
            ? () => {
                toggleState((val) => !val)
                setIsExpandedOnHover(false)
              }
            : null
        }
      >
        <LogoWrapper
          onClick={() => toggleState((val) => !val)}
          className="logoWrapper"
          aria-label={`${isCollapsed ? 'Open' : 'Close'} sidebar`}
        >
          {isCollapsed ? (
            isPearDomain ? (
              <AssessPeardeckLogoCompact />
            ) : (
              <LogoCompact margin="0px" />
            )
          ) : isPearDomain ? (
            <AssessPeardeckLabelOnDarkBgLogo height="36px" />
          ) : (
            <OnDarkBgLogo height="26px" />
          )}
        </LogoWrapper>

        <Menu
          className="main-menu"
          defaultSelectedKeys={[location.pathname]}
          mode="inline"
          isCollapsed={isCollapsed}
        >
          {siderMenuData.slice(0, 1).map((item) => menuItem(item))}

          {isEASuperAdmin(permissions, userRole) &&
            siderMenuData.slice(1).map((item) => menuItem(item))}
        </Menu>
        <MenuFooter>
          <UserInfoButton
            isVisible={isVisible}
            isCollapsed={isCollapsed}
            className={`userinfoBtn ${isCollapsed ? 'active' : ''}`}
          >
            <Dropdown
              onClick={toggleDropdown}
              overlayStyle={{
                position: 'fixed',
                minWidth: isCollapsed ? '70px' : '220px',
                maxWidth: isCollapsed ? '70px' : '0px',
              }}
              className="footerDropdown"
              overlay={footerDropdownMenu}
              trigger={['click']}
              placement="topCenter"
              isVisible={isVisible}
              onVisibleChange={toggleDropdown}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              <div>
                {profileThumbnail ? (
                  <UserImg src={profileThumbnail} isCollapsed={isCollapsed} />
                ) : (
                  <PseudoDiv isCollapsed={isCollapsed}>
                    {getInitials()}
                  </PseudoDiv>
                )}
                <div
                  style={{
                    width: '100px',
                    display: !isCollapsed ? 'block' : 'none',
                  }}
                >
                  <UserName>{userName || 'Anonymous'}</UserName>
                  <UserType isVisible={isVisible}>{userRole}</UserType>
                </div>
                {!isCollapsed && (
                  <IconDropdown
                    style={{ fontSize: 15, pointerEvents: 'none' }}
                    className="drop-caret"
                    type={isCollapsed ? 'caret-up' : 'caret-down'}
                  />
                )}
              </div>
            </Dropdown>
          </UserInfoButton>
        </MenuFooter>
      </SideMenuContainer>

      <SwitchUserModal
        userId={userId}
        switchUser={switchUser}
        orgId={orgId}
        showModal={showModal}
        closeModal={() => toggleShowModal(!showModal)}
        otherAccounts={get(switchDetails, 'switchAccounts', [])}
        personId={personId}
        userRole={userRole}
      />
    </Sidebar>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      firstName: get(state.user, 'user.firstName', ''),
      middleName: get(state.user, 'user.middleName', ''),
      lastName: get(state.user, 'user.lastName', ''),
      userRole: get(state.user, 'user.role', ''),
      userId: get(state.user, 'user._id', ''),
      permissions: get(state.user, 'user.permissions', []),
      orgId: getUserOrgId(state),
      profileThumbnail: get(state.user, 'user.thumbnail'),
      switchDetails: getAccountSwitchDetails(state),
    }),
    { toggleSideBar: toggleSideBarAction, logoutBtn: logoutAction }
  )
)

export default enhance(SideMenu)

const ToggleSidemenu = styled.div`
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

  @media (max-width: ${tabletWidth}) {
    display: none;
  }
`

const LogoWrapper = styled.div`
  height: ${({ theme }) => theme.HeaderHeight.xl}px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 25px;
`

const Sidebar = styled(Sider)`
  &.admin-sidebar {
    height: 100vh;
    background-color: #2f4151;
    z-index: 22;
    padding-bottom: 0;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    &.ant-layout-sider-collapsed {
      max-width: 70px !important;
      min-width: 70px !important;
    }
  }
  ul.main-menu {
    background: transparent;
    padding: 8px 0px 0px;
    &:not(.ant-menu-horizontal) {
      .ant-menu-item {
        color: ${(props) => props.theme.sideMenu.menuItemLinkColor};
        i {
          margin-right: ${(props) => (props.isCollapsed ? '0px' : '1.5rem')};
        }
        svg {
          position: relative;
          z-index: 5;
          fill: ${(props) => props.theme.sideMenu.menuItemLinkColor};
          width: 18px;
          height: 22px;
        }
      }
      .ant-menu-item-selected {
        color: ${(props) => props.theme.sideMenu.menuSelectedItemLinkColor};
        background-color: transparent;

        svg {
          fill: ${(props) => props.theme.sideMenu.menuSelectedItemLinkColor};
        }

        &:before {
          opacity: 1;
        }
      }
    }

    .ant-menu-item:not(.ant-menu-item-selected) {
      &:hover {
        svg {
          fill: ${(props) => props.theme.sideMenu.menuItemLinkHoverColor};
        }
        color: ${(props) => props.theme.sideMenu.menuItemLinkHoverColor};
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
      margin: 8px 0px;
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
      margin: 8px 0px;
      padding: 0px 10px !important;
      height: 38px;
      width: 100%;
    }

    @media (min-width: ${extraDesktopWidth}) {
      &.ant-menu-inline-collapsed > .ant-menu-item,
      &.ant-menu-inline .ant-menu-item {
        margin: 10px 0px;
      }
    }
    @media (max-height: 720px) {
      &.ant-menu-inline-collapsed > .ant-menu-item,
      &.ant-menu-inline .ant-menu-item {
        margin: 4px 0px;
      }
    }
    @media (max-height: 650px) {
      &.ant-menu-inline-collapsed > .ant-menu-item,
      &.ant-menu-inline .ant-menu-item {
        height: 36px;
        margin: 2px 0px;
      }
    }
    @media (max-height: 600px) {
      overflow: auto;
      height: calc(100vh - 190px);
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
  }
`

const UserName = styled.div`
  font-size: ${(props) => props.theme.sideMenu.userInfoNameFontSize};
  color: ${(props) => props.theme.sideMenu.userInfoNameTextColor};
  text-transform: capitalize;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const UserType = styled.div`
  font-size: 12px;
  color: ${(props) =>
    props.isVisible ? white : props.theme.sideMenu.userInfoRoleTextColor};
  width: 96%;
`

const FooterDropDown = styled.div`
  position: relative;
  opacity: ${(props) => (props.isVisible ? '1' : '0')};
  transition: 0.2s;
  -webkit-transition: 0.2s;
  ul {
    overflow: hidden;
    max-width: 100%;
    border: none;
    .ant-menu-item:not(.ant-menu-item-selected) svg {
      fill: ${(props) => props.theme.sideMenu.userInfoDropdownItemTextColor};
      &:hover,
      &:focus {
        fill: ${(props) =>
          props.theme.sideMenu.userInfoDropdownItemTextHoverColor};
      }
    }
    &.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
      &.removeSelectedBorder {
        border: none;
        background-color: ${themeColor};
        svg {
          fill: ${white};
        }
        &:hover {
          background-color: #fff;
          svg {
            fill: ${themeColor};
          }
        }
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
          padding: 15px !important;
          a {
            justify-content: center;
            svg {
              margin-right: 0px;
              padding-left: 0px;
            }
          }
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
          &:hover,
          &:focus {
            color: ${(props) =>
              props.theme.sideMenu.userInfoDropdownItemTextHoverColor};
            a {
              color: ${(props) =>
                props.theme.sideMenu.userInfoDropdownItemTextHoverColor};
            }
            svg,
            svg path {
              fill: ${(props) =>
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
      }
    }
  }
`

const MenuFooter = styled.div`
  position: absolute;
  width: 100%;
  margin-top: auto;
  bottom: 0;
  left: 0;
  right: 0;
`

const UserImg = styled.div`
  width: 50px;
  height: 50px;
  background: url(${(props) => props.src});
  background-position: center center;
  background-size: cover;
  border-radius: 50%;
  margin: ${({ isCollapsed }) =>
    isCollapsed ? '0px auto' : '10px 10px 15px 20px'};
`

const UserInfoButton = styled.div`
  cursor: pointer;
  position: relative;
  &.active {
    padding: 0;
    background: transparent;
    border-radius: 50%;
    width: 50px;
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
    min-width: ${(props) => (props.isCollapsed ? '70px' : '220px')} !important;
    max-width: ${(props) => (props.isCollapsed ? '70px' : '220px')} !important;
    @media (max-width: ${mobileWidthLarge}) {
      bottom: 75px !important;
    }
  }

  .footerDropdown {
    width: 100%;
    height: 80px;
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
  }
  .ant-select-selection {
    background: transparent;
    border: 0px;
    color: ${white};
  }

  @media (max-width: ${tabletWidth}) {
    &.active {
      opacity: 0;
      pointer-events: none;
      background: transparent;
    }
  }
`

const PseudoDiv = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #dddddd;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  font-size: 22px;
  font-weight: bold;
  line-height: 50px;
  text-align: center;
  text-transform: uppercase;
  margin: ${({ isCollapsed }) =>
    isCollapsed ? '0px auto' : '10px 10px 15px 20px'};
`

const IconDropdown = styled(Icon)`
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
  color: ${(props) => props.theme.sideMenu.dropdownIconColor};
`
