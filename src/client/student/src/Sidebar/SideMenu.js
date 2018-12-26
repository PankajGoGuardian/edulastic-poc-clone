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
  Affix,
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
  IconAssignment,
  IconReport,
  IconManage,
  IconQuestion
} from '@edulastic/icons';
import { withWindowSizes } from '@edulastic/common';

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
      collapsed: false,
      isVisible: false
    };
  }

  onCollapse = () => {
    this.setState(prevState => ({ collapsed: !prevState.collapsed }));
  };

  handleMenu = (item) => {
    const { history } = this.props;
    if (menuItems[item.key].path !== undefined) {
      history.push(`/${menuItems[item.key].path}`);
    }
  };

  toggleDropdown = () => {
    this.setState(prevState => ({ isVisible: !prevState.isVisible }));
  };

  renderIcon(icon) {
    const { collapsed } = this.state;
    return styled(icon)`
      width: 22px !important;
      height: 22px !important;
      fill: rgb(67, 75, 93);
      margin-right: ${() => (collapsed ? '0rem' : '1rem')};
      .ant-menu-item-active > & {
        fill: #1890ff;
      }
      .ant-menu-item-selected > & {
        fill: #4aac8b;
      }
    `;
  }

  render() {
    const { collapsed, broken, isVisible } = this.state;
    const { windowWidth, currentPath, firstName } = this.props;
    const isCollapsed =
      windowWidth > 1200 || windowWidth <= 480 || windowWidth === 646
        ? collapsed
        : true;

    const page = currentPath.split('/').filter(item => !!item)[1];

    const menuIndex = getIndex(page, menuItems);
    const footerDropdownMenu = (
      <FooterDropDown isVisible={isVisible} className="footerDropWrap">
        <Menu>
          <Menu.Item key="0">
            <a href="#">
              <IconDropdown type="caret-down" /> {isCollapsed ? '' : 'SIGN OUT'}
            </a>
          </Menu.Item>
          <Menu.Item key="1">
            <Link to="/home/profile">
              <IconDropdown type="caret-down" />{' '}
              {isCollapsed ? '' : 'MY PROFILE'}
            </Link>
          </Menu.Item>
        </Menu>
      </FooterDropDown>
    );
    return (
      <Affix style={{ width: isCollapsed ? 107 : 293 }}>
        <SideBar
          collapsed={isCollapsed}
          onCollapse={collapsedStatus =>
            this.setState({ collapsed: collapsedStatus })
          }
          breakpoint="md"
          onBreakpoint={brokenStatus => this.setState({ broken: brokenStatus })}
          width={broken ? '100%' : 238}
          collapsedWidth={broken ? '0' : '100'}
          theme="light"
          className="sideBarwrapper"
        >
          <LogoWrapper className="logoWrapper">
            {broken ? (
              <Col span={3}>
                <AntIcon
                  className="mobileCloseIcon"
                  type="close"
                  theme="outlined"
                  onClick={this.onCollapse}
                />
              </Col>
            ) : null}
            <Col span={18} style={{ textAlign: 'left' }}>
              {isCollapsed ? <LogoCompact /> : <Logo />}
            </Col>
            {broken ? null : (
              <Col span={6} style={{ textAlign: 'right', color: '#1fe3a1' }}>
                <AntIcon
                  className="trigger"
                  type={isCollapsed ? 'right' : 'left'}
                  onClick={this.onCollapse}
                />
              </Col>
            )}
          </LogoWrapper>
          <LogoDash />
          <MenuWrapper>
            <Menu
              theme="light"
              defaultSelectedKeys={[menuIndex.toString()]}
              mode="inline"
              onClick={item => this.handleMenu(item)}
            >
              {menuItems.map((menu, index) => {
                const MenuIcon = this.renderIcon(menu.icon);
                return (
                  <MenuItem key={index.toString()}>
                    <MenuIcon />
                    {!isCollapsed && <span>{menu.label}</span>}
                  </MenuItem>
                );
              })}
            </Menu>
            <MenuFooter className="footerBottom">
              <QuestionButton className="questionBtn">
                <HelpIcon />
                {isCollapsed ? null : <span>Help Center</span>}
              </QuestionButton>

              <UserInfoButton
                onClick={this.toggleDropdown}
                isVisible={isVisible}
                isCollapsed={isCollapsed}
                className="userinfoBtn"
              >
                <Dropdown
                  overlayStyle={{ position: 'fixed' }}
                  className="footerDropdown"
                  overlay={footerDropdownMenu}
                  trigger={['click']}
                  placement="topCenter"
                >
                  <div>
                    <img src={Profile} alt="Profile" />
                    <div style={{ paddingLeft: 11 }}>
                      {!isCollapsed && (
                        <div style={{ fontSize: 14, color: '#057750' }}>
                          {firstName || 'Zack Oliver'}
                        </div>
                      )}
                      {!isCollapsed && (
                        <div style={{ fontSize: 12, color: 'white' }}>
                          Student
                        </div>
                      )}
                    </div>
                    {!isCollapsed && (
                      <IconDropdown
                        style={{ fontSize: 20 }}
                        className="drop-caret"
                        type="caret-down"
                      />
                    )}
                  </div>
                </Dropdown>
              </UserInfoButton>
            </MenuFooter>
          </MenuWrapper>
        </SideBar>
      </Affix>
    );
  }
}

SideMenu.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
  currentPath: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired
};

const enhance = compose(
  withRouter,
  withWindowSizes,
  connect(
    ({ router, user }) => ({
      currentPath: router.location.pathname,
      firstName: user.firstName
    }),
    {}
  )
);

export default enhance(SideMenu);

const SideBar = styled(Layout.Sider)`
  width: 245px;
  height: 100vh;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #fbfafc;
  z-index: 22;
  &.ant-layout-sider-collapsed .logoWrapper {
    padding: 21px;
  }
  .footerBottom {
    position: fixed;
    bottom: 10px;
    width: 239px;
  }
  &.ant-layout-sider-collapsed .footerBottom {
    padding: 8px 8px 0px;
    width: 100px;
  }
  &.ant-layout-sider-collapsed .questionBtn {
    width: 60px;
    height: 60px;
    border-radius: 65px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
    background-color: #ffffff;
    padding: 0px;
    margin: 0 auto;
    justify-content: center;
    margin-bottom: 15px;
    &:hover {
      background: #1890ff;
    }
  }
  &.ant-layout-sider-collapsed .userinfoBtn {
    border-radius: 10px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
    background-color: #1fe3a1;
    justify-content: space-between;
    padding: 10px;
    margin: 0px;
  }
  &.ant-layout-sider-collapsed .userinfoBtn .ant-select-arrow {
    right: 15px;
    top: 25px;
  }
  &.ant-layout-sider-collapsed .ant-select-selection-selected-value {
    display: none !important;
  }
  &.ant-layout-sider-collapsed .ant-select {
    width: auto;
    padding-left: 5px;
  }
  .ant-layout-sider-zero-width-trigger {
    top: 10px;
    right: -33px;
    color: #fff;
    background: transparent;
  }
  .ant-select {
    width: 125px;
  }
`;

const LogoWrapper = styled(Row)`
  padding: 30px 20px;
  text-align: center;
  display: flex;
  align-items: center;
`;

const LogoDash = styled.div`
  width: 90%;
  height: 0;
  opacity: 0.61;
  border-bottom: solid 1px #d9d6d6;
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
  background: transparent;
  &:not(.ant-menu-horizontal) {
    .ant-menu-item-selected {
      background-color: transparent;
      color: #4aac8b;
      border-left: 3px solid #4aac8b;
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
  }
  &.ant-menu-inline-collapsed > .ant-menu-item {
    text-align: center;
    justify-content: center;
    margin-top: 10px;
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
  background-color: #ffffff;
  height: 60px;
  padding-left: 23px;
  margin: 10px 21px;
  display: flex;
  align-items: center;
  span {
    padding-left: 25px;
  }
  &:hover {
    background: #1890ff;
    svg {
      fill: #fff;
    }
    span {
      color: #fff;
    }
  }
`;

const FooterDropDown = styled.div`
  position: relative;
  bottom: ${props => (props.isVisible ? '-4px' : '-30px')};
  opacity: ${props => (props.isVisible ? '1' : '0')};
  transition: 0.2s;
  -webkit-transition: 0.2s;
  ul {
    background: #1fe3a1;
    border-bottom: 1px solid #4fd08c;
    border-radius: 15px 15px 0px 0px;
    overflow: hidden;
    &.ant-menu-inline-collapsed {
      width: 84px;
      padding-top: 10px;
      margin: -4px 0px 0px 8px;
    }
    li {
      margin: 0px !important;
      &:hover,
      &:focus {
        background: #4fd08c;
      }
      a {
        color: white;
        font-size: 14px;
        font-weight: 600;
        &:hover,
        &:focus {
          color: white;
        }
        i {
          position: relative;
          margin-right: 5px;
          top: auto;
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
    background-color: #1fe3a1;
    display: flex;
    align-items: center;
    padding: ${props => (props.isCollapsed ? 0 : '0px 25px 0px 55px')};
    margin: ${props => (props.isCollapsed ? 0 : '0 21px')};
    position: relative;
    font-weight: 600;
    transition: 0s;
    -webkit-transition: 0s;
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
  .ant-select-selection {
    background: transparent;
    border: 0px;
    color: #ffffff;
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
  fill: #1fe3a1;
  width: 25px !important;
  height: 22px !important;
`;

const IconDropdown = styled(AntIcon)`
  color: #ffffff;
  position: absolute;
  top: -10px;
`;
