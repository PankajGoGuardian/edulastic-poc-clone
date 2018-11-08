import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { Layout, Menu as AntMenu, Row, Col, Select, Icon as AntIcon } from 'antd';
import styled from 'styled-components';
import {
  IconHeader,
  IconLogoCompact,
  IconClockDashboard,
  IconAssignment,
  IconBarChart,
  IconManage,
  IconQuestion,
  IconItemList,
  IconTestList,
} from '@edulastic/icons';
import { withWindowSizes } from '@edulastic/common';

import Profile from '../assets/Profile.png';

const menuItems = [
  {
    label: 'Dashboard',
    icon: IconClockDashboard,
  },
  {
    label: 'Assignements',
    icon: IconAssignment,
  },
  {
    label: 'Skill Report',
    icon: IconBarChart,
  },
  {
    label: 'Manage Class',
    icon: IconManage,
  },
  {
    label: 'Item List',
    icon: IconItemList,
  },
  {
    label: 'Test List',
    icon: IconTestList,
  },
];

class SideMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
    };
  }

  onCollapse = () => {
    this.setState(prevState => ({ collapsed: !prevState.collapsed }));
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
    const { collapsed, broken } = this.state;
    const { windowWidth } = this.props;
    const isCollapsed = (windowWidth > 1200 || windowWidth <= 480 || windowWidth === 646) ? collapsed : true;
    return (
      <SideBar
        collapsed={isCollapsed}
        onCollapse={collapsedStatus => this.setState({ collapsed: collapsedStatus })}
        breakpoint="md"
        onBreakpoint={brokenStatus => this.setState({ broken: brokenStatus })}
        width={broken ? '100%' : 245}
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
          <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
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
            <UserInfoButton className="userinfoBtn">
              <img src={Profile} alt="Profile" />
              <div>
                {!isCollapsed && <label style={{ marginLeft: 11 }}>Zack oliver</label>}
                <Select
                  defaultValue="Student"
                  suffixIcon={
                    <IconDropdown type="caret-down" />
                  }
                >
                  <Select.Option value="Student">Student</Select.Option>
                </Select>
              </div>
            </UserInfoButton>
          </MenuFooter>
        </MenuWrapper>
      </SideBar>
    );
  }
}

SideMenu.propTypes = {
  windowWidth: PropTypes.number.isRequired,
};

const enhance = compose(
  withWindowSizes,
);

export default enhance(SideMenu);

const SideBar = styled(Layout.Sider)`
  width: 245px;
  height: 900px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #fbfafc;
  z-index: 22;

  &.ant-layout-sider-collapsed .logoWrapper {
    padding: 21px;
  }
  &.ant-layout-sider-collapsed .footerBottom{
    padding: 8px;
  }
  &.ant-layout-sider-collapsed .questionBtn{
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
  &.ant-layout-sider-collapsed .ant-select-selection-selected-value{
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
  @media screen and (max-width: 1300px) {
    height: 700px;
  }
`;

const LogoWrapper = styled(Row)`
  padding: 32px 21px;
  text-align: center;
  display: flex;
  align-items: center;
`;

const LogoDash = styled.div`
  width: 90%;
  height: 0;
  opacity: 0.61;
  border-bottom:  solid 1px #d9d6d6;
  margin: 0 auto;
`;

const MenuWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 786px;
  padding: 21px 0px;

  @media screen and (max-width: 1300px) {
    height: 600px;    
  }
`;

const Menu = styled(AntMenu)`
  background: transparent;
  &:not(.ant-menu-horizontal) {
    .ant-menu-item-selected {
      background-color: transparent;
      color: #4aac8b;
    }
  }

  &.ant-menu-vertical .ant-menu-item:after,
  &.ant-menu-vertical-left .ant-menu-item:after,
  &.ant-menu-vertical-right .ant-menu-item:after,
  &.ant-menu-inline .ant-menu-item:after {
    content: unset;
  }
  &.ant-menu-inline, &.ant-menu-vertical, &.ant-menu-vertical-left{
    border-right: 0px;
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
    padding: 0px 32px !important;
  }
  &.ant-menu-inline-collapsed {
    width: 100px;
    padding-top: 20px;
  }
  &.ant-menu-inline-collapsed > .ant-menu-item {
      text-align: center;
      margin-top: 20px;
  }
  &.ant-menu-inline {
    padding-top: 23px;
  }
  &.ant-menu-inline > .ant-menu-item {
    margin-top: 20px;
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

const MenuFooter = styled.div`
`;

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

const UserInfoButton = styled.div`
  width: auto;
  margin: 0 21px;
  height: 60px;
  border-radius: 65px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  background-color: #1fe3a1;
  display: flex;
  align-items: center;
  padding-left: 12px;

  img {
    width: 44px;
  }

  .ant-select-selection{
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
