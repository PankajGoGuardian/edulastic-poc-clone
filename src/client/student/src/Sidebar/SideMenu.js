import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Layout,
  Menu as AntMenu,
  Row,
  Col,
  Icon as AntIcon,
  Dropdown
} from 'antd';
import styled from 'styled-components';
import {
  IconAssignment,
  IconHeader,
  IconLogoCompact,
  IconClockDashboard,
  IconBarChart,
  IconReport,
  IconManage,
  IconQuestion
} from '@edulastic/icons';
import { withWindowSizes } from '@edulastic/common';
import { tabletWidth } from '@edulastic/colors';
import { toggleSideBarAction } from '../actions/togglemenu';
import { logoutAction } from '../actions/auth';

import Profile from '../assets/Profile.png';

const getIndex = (page, items) => {
  let index;
  items.forEach((item, i) => {
    if (item.path && item.path.includes(page)) {
      index = i;
    }
  });
  return index || 0;
};

const menuItems = [
  {
    label: 'Dashboard',
    icon: IconClockDashboard,
    path: 'home/dashboard'
  },
  {
    label: 'Assignments',
    icon: IconAssignment,
    path: 'home/assignments'
  },
  {
    label: 'Reports',
    icon: IconReport,
    path: 'home/reports'
  },
  {
    label: 'Skill Report',
    icon: IconBarChart,
    path: 'home/skill-reports'
  },
  {
    label: 'Manage Class',
    icon: IconManage,
    path: 'home/manage'
  }
];

class SideMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false
    };
  }

  handleMenu = (e) => {
    const { history, windowWidth } = this.props;
    if (menuItems[e.key].path !== undefined) {
      history.push(`/${menuItems[e.key].path}`);
    }
    if (windowWidth <= parseFloat(tabletWidth)) {
      this.toggleMenu();
    }
  };

  toggleMenu = () => {
    const { toggleSideBar } = this.props;
    toggleSideBar();
  };

  handleVisibleChange = (flag) => {
    this.setState({ isVisible: flag });
  }

  toggleDropdown = () => {
    this.setState(prevState => ({ isVisible: !prevState.isVisible }));
  };

  handleProfileClick = () => {
    const { windowWidth } = this.props;
    this.toggleDropdown();
    if (windowWidth <= parseFloat(tabletWidth)) {
      this.toggleMenu();
    }
  };

  renderIcon = (icon, isSidebarCollapsed) => styled(icon)`
      width: 22px !important;
      height: 22px !important;
      fill: rgb(67, 75, 93);
      margin-right: ${() => (isSidebarCollapsed ? '0rem' : '1rem')};
      .ant-menu-item-active > & {
        fill: #1890ff;
      }
      .ant-menu-item-selected > & {
        fill: #4aac8b;
      }
    `

  render() {
    const { broken, isVisible } = this.state;
    const { windowWidth, currentPath, firstName, logout, isSidebarCollapsed } = this.props;
    const page = currentPath.split('/').filter(item => !!item)[1];
    const menuIndex = getIndex(page, menuItems);
    const isMobile = windowWidth <= parseFloat(tabletWidth);
    const footerDropdownMenu = (
      <FooterDropDown isVisible={isVisible} className="footerDropWrap">
        <Menu>
          <Menu.Item key="0" className="removeSelectedBorder">
            <a onClick={logout}>
              <LogoutIcon type="logout" /> {isSidebarCollapsed ? '' : 'SIGN OUT'}
            </a>
          </Menu.Item>
          <Menu.Item key="1" className="removeSelectedBorder">
            <Link to="/home/profile" onClick={this.handleProfileClick}>
              <IconDropdown type="user" />{' '}
              {isSidebarCollapsed ? '' : 'MY PROFILE'}
            </Link>
          </Menu.Item>
        </Menu>
      </FooterDropDown>
    );
    return (
      <FixedSidebar>
        <SideBar
          collapsed={isSidebarCollapsed}
          collapsible
          breakpoint="md"
          onBreakpoint={brokenStatus => this.setState({ broken: brokenStatus })}
          width={isMobile ? windowWidth : '240'}
          collapsedWidth={broken ? '0' : '100'}
          // theme={theme}
          className="sideBarwrapper"
        >
          <LogoWrapper className="logoWrapper">
            {broken ? (
              <Col span={3}>
                <AntIcon
                  className="mobileCloseIcon"
                  type="close"
                  theme="outlined"
                  onClick={this.toggleMenu}
                />
              </Col>
            ) : null}
            <Col span={18} style={{ textAlign: 'left' }}>
              {isSidebarCollapsed ? <LogoCompact /> : <Logo />}
            </Col>
            {broken ? null : (
              <Col span={6} style={{ textAlign: 'right', color: '#1fe3a1' }}>
                <AntIcon
                  className="trigger"
                  type={isSidebarCollapsed ? 'right' : 'left'}
                  onClick={this.toggleMenu}
                />
              </Col>
            )}
          </LogoWrapper>
          <LogoDash />
          <MenuWrapper>
            {isMobile && isSidebarCollapsed ? <IconBars type="bars" onClick={this.toggleMenu} /> : null}
            <Menu
              // theme="light"
              defaultSelectedKeys={[menuIndex.toString()]}
              mode="inline"
              onClick={this.handleMenu}
            >
              {menuItems.map((menu, index) => {
                const MenuIcon = this.renderIcon(menu.icon, isSidebarCollapsed);
                return (
                  <MenuItem key={index.toString()}>
                    <MenuIcon />
                    {!isSidebarCollapsed && <span>{menu.label}</span>}
                  </MenuItem>
                );
              })}
            </Menu>
            <MenuFooter className="footerBottom">
              <QuestionButton className="questionBtn">
                <HelpIcon />
                {isSidebarCollapsed ? null : <span>Help Center</span>}
              </QuestionButton>

              <UserInfoButton
                isVisible={isVisible}
                isSidebarCollapsed={isSidebarCollapsed}
                className="userinfoBtn"
              >
                <Dropdown
                  onClick={this.toggleDropdown}
                  overlayStyle={{ position: 'fixed', minWidth: '198px' }}
                  className="footerDropdown"
                  overlay={footerDropdownMenu}
                  trigger={['click']}
                  placement="topCenter"
                  isVisible={isVisible}
                  onVisibleChange={this.handleVisibleChange}

                >
                  <div>
                    <img src={Profile} alt="Profile" />
                    <div style={{ paddingLeft: 11 }}>
                      {!isSidebarCollapsed && (
                        <UserName>{firstName || 'Zack Oliver'}</UserName>
                      )}
                      {!isSidebarCollapsed && (
                        <UserType>Student</UserType>
                      )}
                    </div>
                    {!isSidebarCollapsed && (
                      <IconDropdown
                        style={{ fontSize: 20 }}
                        className="drop-caret"
                        type={isVisible ? 'caret-up' : 'caret-down'}
                      />
                    )}
                  </div>
                </Dropdown>
              </UserInfoButton>
            </MenuFooter>
          </MenuWrapper>
        </SideBar>
      </FixedSidebar>
    );
  }
}

SideMenu.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
  currentPath: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
  toggleSideBar: PropTypes.func.isRequired,
  isSidebarCollapsed: PropTypes.object.isRequired
};

const enhance = compose(
  withRouter,
  withWindowSizes,
  connect(
    ({ router, user, ui }) => ({
      currentPath: router.location.pathname,
      firstName: user.firstName || '',
      isSidebarCollapsed: ui.isSidebarCollapsed
    }),
    { logout: logoutAction, toggleSideBar: toggleSideBarAction }
  )
);

export default enhance(SideMenu);

const FixedSidebar = styled.div`
    position: fixed;
    left: 0px;
    top: 0px;
    bottom: 0px;
    @media (max-width: 768px) {
      z-index: 2;
    }
`;

const SideBar = styled(Layout.Sider)`
  height: 100vh;
  width: 240px;
  max-width: 240px;
  min-width: 240px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: ${props => props.theme.sidebarBgColor};
  z-index: 22;

  &.ant-layout-sider-collapsed .logoWrapper {
    padding: 5px 20px;
  }
  .footerBottom {
    position: fixed;
    bottom: 10px;
    width: 240px;
  }
  &.ant-layout-sider-collapsed .footerBottom {
    padding: 8px 8px 0px;
    width: 100px;
    @media (max-width: 768px) {
     display:none;
    }
  }
  &.ant-layout-sider-collapsed .questionBtn {
    width: 60px;
    height: 60px;
    border-radius: 65px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
    background-color: ${props => props.theme.helpButtonBgColor};
    padding: 0px;
    margin: 0 auto;
    justify-content: center;
    margin-bottom: 15px;

    &:hover {
      background: ${props => props.theme.helpButtonBgColor};
    }
  }
  &.ant-layout-sider-collapsed .userinfoBtn {
    border-radius: 10px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
    background-color: ${props => props.theme.userInfoButtonBgColor};
    justify-content: space-between;
    padding: 10px;
    margin: 0px;
  }
  &.ant-layout-sider-collapsed .userinfoBtn .ant-select-arrow {
    right: 15px;
    top: 25px;
  }
  &.ant-layout-sider-collapsed .ant-select-selection-selected-value,
  &.ant-layout-sider-has-trigger .ant-layout-sider-trigger {
    display: none !important;
  }
  .ant-layout-sider-zero-width-trigger {
    display:none;
  }
  &.ant-layout-sider-collapsed .ant-select {
    width: auto;
    padding-left: 5px;
  }
  .ant-select {
    width: 125px;
  }
`;

const LogoWrapper = styled(Row)`
  padding: 18px 20px;
  text-align: center;
  display: flex;
  align-items: center;
`;

const LogoDash = styled.div`
  width: 90%;
  height: 0;
  opacity: 0.61;
  border-bottom: solid 1px ${props => props.theme.logoBorderBottomColor};
  margin: 0 auto;
`;

const MenuWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: calc(100vh - 89px);
  padding: 20px 0px 10px;
`;

const Menu = styled(AntMenu)`
  background: ${props => props.theme.menuContainerBgColor};
  &:not(.ant-menu-horizontal) {
    .ant-menu-item {
      background-color: ${props => props.theme.menuItemBgColor};
      color: ${props => props.theme.menuItemLinkColor};
      &.ant-menu-item-selected {
        background-color: ${props => props.theme.menuSelectedItemBgColor};
        color: ${props => props.theme.menuSelectedItemLinkColor};
        border-left: 3px solid ${props => props.theme.selectedMenuItemBorderLeft};
        &.removeSelectedBorder{
          border:none;
        }
      }
      &:hover {
        color: ${props => props.theme.menuItemLinkHoverColor};
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
    height: calc(100vh - 300px);
    overflow: auto;
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
    margin-top: 16px;
    padding: 0px 10px 0px 25px;
    max-width: 100%;
  }
  &.ant-menu-inline-collapsed {
    width: 100px;
    height: calc(100vh - 300px);
    overflow: auto;
  }
  &.ant-menu-inline-collapsed > .ant-menu-item {
    display: flex;
    text-align: center;
    justify-content: center;
    margin-top: 10px;
    padding: 10px 10px 0px 10px !important;
    width: 100%;
    border: none;
  }
  &.ant-menu-inline > .ant-menu-item {
    margin-top: 10px;
  }
`;
const MenuItem = styled(AntMenu.Item)`
  font-family: Open Sans;
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: 0.3px;
  text-align: left;
  color: #434b5d;
  display: flex;
  align-items: center;
  margin-top: 16px;
`;

const MenuFooter = styled.div``;

const QuestionButton = styled.div`
  border-radius: 65px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  background-color: ${props => props.theme.helpButtonBgColor};
  height: 60px;
  padding-left: 23px;
  margin: 10px 21px;
  display: flex;
  align-items: center;
  span {
    padding-left: 25px;
  }
  &:hover {
    background: ${props => props.theme.helpButtonBgHoverColor};
    svg {
      fill: ${props => props.theme.helpButtonSvgHoverColor};
    }
    span {
      color: ${props => props.theme.helpButtonSvgHoverColor};
    }
  }
`;

const UserName = styled.div`
  font-size: ${props => props.theme.userInfoNameFontSize};
  color: ${props => props.theme.userInfoNameTextColor};
`;

const UserType = styled.div`
  font-size: ${props => props.theme.userInfoRoleFontSize};
  color: ${props => props.theme.userInfoRoleTextColor};
`;

const FooterDropDown = styled.div`
  position: relative;
  bottom: -4px;
  opacity: ${props => (props.isVisible ? '1' : '0')};
  transition: .2s;
  -webkit-transition: .2s;
  ul {
    background: ${props => props.theme.userInfoDropdownBgColor};
    border-bottom: 1px solid #4fd08c;
    border-radius: 15px 15px 0px 0px;
    overflow: hidden;
    &.ant-menu-inline-collapsed {
      width: 84px;
      height: auto;
      margin-top: 10px;
      margin-left: 8px;
      li{
        &.ant-menu-item{
          margin: 0px;
          height: 58px;
        }
      }
    }
    li{
      &.ant-menu-item {
      background: ${props => props.theme.userInfoDropdownItemBgColor};
      margin: 0px;
      padding: 5px 16px;
      height: 50px;
      &:hover,
      &:focus {
        background: ${props => props.theme.userInfoDropdownItemBgHoverColor};
        a { color: ${props => props.theme.userInfoDropdownItemTextHoverColor} }
        i { color: ${props => props.theme.userInfoDropdownItemIconHoverColor} }
      }
      a {
        color: ${props => props.theme.userInfoDropdownItemTextColor};
        font-size: ${props => props.theme.userInfoDropdownItemFontSize};
        font-weight: 600;
        i {
          color: ${props => props.theme.userInfoDropdownItemIconColor};
          position: relative;
          margin-right: 5px;
          top: 2px;
          font-size: ${props => props.theme.userInfoDropdownItemIconSize};
        }
      }
    }
    }
  }
`;

const UserInfoButton = styled.div`
  .footerDropdown {
    width: auto;
    height: 60px;
    border-radius: ${props => (props.isVisible ? '0px 0px 30px 30px' : '65px')};
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
    background-color: ${props => props.theme.userInfoButtonBgColor};
    display: flex;
    align-items: center;
    padding: ${props => (props.isSidebarCollapsed ? 0 : '0px 25px 0px 55px')};
    margin: ${props => (props.isSidebarCollapsed ? 0 : '0 21px')};
    position: relative;
    font-weight: 600;
    transition: .2s;
    -webkit-transition: .2s;
    .drop-caret {
      position: absolute;
      right: 10px;
      top: 20px;
    }
  }
  img {
    width: 44px;
    position: absolute;
    left: 10px;
  }
`;

const Logo = styled(IconHeader)`
  width: 119px !important;
  height: 20px !important;
`;

const LogoCompact = styled(IconLogoCompact)`
  width: 25px !important;
  height: 25px !important;
  margin: 10px;
  fill: #0eb08d;
  &:hover {
    fill: #0eb08d;
  }
`;

const HelpIcon = styled(IconQuestion)`
  fill: ${props => props.theme.helpIconColor};
  width: 25px !important;
  height: 22px !important;
`;

const IconDropdown = styled(AntIcon)`
  color: ${props => props.theme.dropdownIconColor};
  position: absolute;
  top: -10px;
`;

const LogoutIcon = styled(IconDropdown)`
  transform:rotate(180deg);
  -webkit-transform:rotate(180deg);
`;

const IconBars = styled(AntIcon)`
  display:none;
  @media (max-width: 768px) {
    display:inline-block;
    padding-left: 17px;
    position: absolute;
    top: 18px;
    left: 12px;
    font-size: 24px;
    color: #fff;
  }
`;
