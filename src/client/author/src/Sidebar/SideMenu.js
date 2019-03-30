import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { tabletWidth } from "@edulastic/colors";
import { get } from "lodash";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Layout, Menu as AntMenu, Row, Col, Dropdown, Icon as AntIcon } from "antd";
import styled from "styled-components";
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
  IconCurriculumSequence
} from "@edulastic/icons";
import { withWindowSizes } from "@edulastic/common";
import { logoutAction } from "../actions/auth";
import { toggleSideBarAction } from "../actions/togglemenu";
import Profile from "../assets/Profile.png";

const menuItems = [
  {
    label: "Dashboard",
    icon: IconClockDashboard
  },
  {
    label: "Curriculum Sequence",
    icon: IconCurriculumSequence,
    path: "author/curriculum-sequence"
  },
  {
    label: "Assignments",
    icon: IconAssignment,
    path: "author/assignments"
  },
  {
    label: "Report",
    icon: IconBarChart,
    path: "author/reports"
  },
  {
    label: "Manage Class",
    icon: IconManage,
    path: "author/manageClass"
  },
  {
    label: "Item List",
    icon: IconItemList,
    path: "author/items"
  },
  {
    label: "Test List",
    icon: IconTestList,
    path: "author/tests"
  }
];

class SideMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false
    };
  }

  renderIcon = (icon, isSidebarCollapsed) => styled(icon)`
    width: 22px;
    height: 22px;
    fill: rgb(67, 75, 93);
    margin-right: ${() => (isSidebarCollapsed ? "0rem" : "1rem")};

    .ant-menu-item-active > & {
      fill: #1890ff;
    }
    .ant-menu-item-selected > & {
      fill: rgb(67, 75, 93);
    }
  `;

  handleMenu = item => {
    const { history } = this.props;
    if (menuItems[item.key].path !== undefined) {
      history.push(`/${menuItems[item.key].path}`);
    }
  };

  toggleMenu = () => {
    const { toggleSideBar } = this.props;
    toggleSideBar();
  };

  handleVisibleChange = flag => {
    this.setState({ isVisible: flag });
  };

  toggleDropdown = () => {
    this.setState(prevState => ({ isVisible: !prevState.isVisible }));
  };

  closeMenuByClickOutside = (e, menu) => {
    const { target } = e;

    const hamburger = document.querySelector(".hamburger");
    const footerDropDown = document.querySelector(".footerDropdown");
    const itsMenu = target === menu && menu.contains(target);
    const itsHamburger = target === hamburger && hamburger.contains(target);
    const itsFooterDropDown = target === footerDropDown && footerDropDown.contains(target);
    const isFull = menu.classList.contains("full");

    if (!itsMenu && !itsHamburger && !itsFooterDropDown && isFull) {
      this.toggleMenu();
    }
  };

  componentDidMount(): void {
    const fixedSidebarClassName = this.fixedSidebar._reactInternalFiber.stateNode.state.generatedClassName;
    const menu = document.querySelector(`.${fixedSidebarClassName}`);

    document.addEventListener("click", e => this.closeMenuByClickOutside(e, menu));
  }

  componentWillMount(): void {
    document.removeEventListener("click", () => this.closeMenuByClickOutside);
  }

  render() {
    const { broken, isVisible } = this.state;
    const { windowWidth, history, isSidebarCollapsed, firstName, logout } = this.props;
    const isPickQuestion = !!history.location.pathname.includes("pickup-questiontype");

    const isCollapsed = isPickQuestion || isSidebarCollapsed;
    const isMobile = windowWidth < 770;
    const defaultSelectedMenu = menuItems.findIndex(menuItem => `/${menuItem.path}` === history.location.pathname);

    const footerDropdownMenu = (
      <FooterDropDown isVisible={isVisible} isCollapsed={isCollapsed}>
        <Menu>
          <Menu.Item key="0" className="removeSelectedBorder">
            <a onClick={logout}>
              <LogoutIcon type="logout" /> {isCollapsed ? "" : "SIGN OUT"}
            </a>
          </Menu.Item>
          <Menu.Item key="1" className="removeSelectedBorder">
            <Link to="/home/profile">
              <IconDropdown type="user" /> {isCollapsed ? "" : "MY PROFILE"}
            </Link>
          </Menu.Item>
        </Menu>
      </FooterDropDown>
    );

    return (
      <FixedSidebar
        className={`${!isCollapsed ? "full" : ""}`}
        ref={e => {
          this.fixedSidebar = e;
        }}
        onClick={isCollapsed && !isMobile ? this.toggleMenu : null}
        isCollapsed={isCollapsed}
      >
        <SideBar
          collapsed={isCollapsed}
          collapsible
          breakpoint="md"
          onBreakpoint={brokenStatus => this.setState({ broken: brokenStatus })}
          width="245"
          collapsedWidth={broken ? "0" : "100"}
          theme="light"
          className="sideBarwrapper"
        >
          {isMobile ? (
            <AntIcon className="mobileCloseIcon" type="close" theme="outlined" onClick={this.toggleMenu} />
          ) : (
            <LogoWrapper className="logoWrapper">
              {broken ? (
                <Col span={3}>
                  <AntIcon className="mobileCloseIcon" type="close" theme="outlined" onClick={this.toggleMenu} />
                </Col>
              ) : null}
              <Col span={18} style={{ textAlign: "left" }}>
                {isCollapsed ? <LogoCompact /> : <Logo />}
              </Col>
              {broken ? null : (
                <Col
                  span={6}
                  style={{
                    textAlign: "right",
                    color: "#1fe3a1",
                    right: isCollapsed ? "-5px" : "-21px",
                    top: isCollapsed ? "0" : "-5px"
                  }}
                >
                  {!isPickQuestion && !isCollapsed && (
                    <AntIcon className="trigger" type={isCollapsed ? "right" : "left"} onClick={this.toggleMenu} />
                  )}
                </Col>
              )}
            </LogoWrapper>
          )}
          {!isMobile && <LogoDash />}
          <MenuWrapper>
            <Menu
              theme="light"
              defaultSelectedKeys={[defaultSelectedMenu.toString()]}
              mode="inline"
              onClick={item => this.handleMenu(item)}
            >
              {menuItems.map((menu, index) => {
                const MenuIcon = this.renderIcon(menu.icon, isCollapsed);
                return (
                  <MenuItem key={index.toString()} onClick={this.toggleMenu}>
                    <MenuIcon />
                    {!isCollapsed && <LabelMenuItem>{menu.label}</LabelMenuItem>}
                  </MenuItem>
                );
              })}
            </Menu>
            <MenuFooter className="footerBottom">
              <QuestionButton className={`questionBtn ${isCollapsed ? "active" : ""}`}>
                <IconContainer className={isCollapsed ? "active" : ""}>
                  <HelpIcon />
                </IconContainer>
                {isCollapsed || isMobile ? null : <span>Help Center</span>}
              </QuestionButton>
              <UserInfoButton
                isVisible={isVisible}
                isCollapsed={isCollapsed}
                className={`userinfoBtn ${isCollapsed ? "active" : ""}`}
              >
                <Dropdown
                  onClick={this.toggleDropdown}
                  overlayStyle={{
                    position: "fixed",
                    minWidth: isCollapsed ? "60px" : "198px",
                    maxWidth: isCollapsed ? "60px" : "0px"
                  }}
                  className="footerDropdown"
                  overlay={footerDropdownMenu}
                  trigger={["click"]}
                  placement="topCenter"
                  isVisible={isVisible}
                  onVisibleChange={this.handleVisibleChange}
                >
                  <div>
                    <img src={Profile} alt="Profile" />
                    <div style={{ paddingLeft: 11 }}>
                      {!isCollapsed && !isMobile && <UserName>{firstName || "Zack Oliver"}</UserName>}
                      {!isCollapsed && !isMobile && <UserType>Teacher</UserType>}
                    </div>
                    {!isCollapsed && !isMobile && (
                      <IconDropdown
                        style={{ fontSize: 20 }}
                        className="drop-caret"
                        type={isVisible ? "caret-up" : "caret-down"}
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
  toggleSideBar: PropTypes.func.isRequired,
  firstName: PropTypes.string.isRequired,
  isSidebarCollapsed: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired
};

const enhance = compose(
  withRouter,
  withWindowSizes,
  connect(
    ({ authorUi, user }) => ({
      isSidebarCollapsed: authorUi.isSidebarCollapsed,
      firstName: get(user, "user.firstName", "")
    }),
    { toggleSideBar: toggleSideBarAction, logout: logoutAction }
  )
);

export default enhance(SideMenu);

const FixedSidebar = styled.div`
  position: fixed;
  left: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 1000;
  cursor: ${props => (props.isCollapsed ? "pointer" : "initial")};

  > * {
    pointer-events: ${props => (props.isCollapsed ? "none" : "all")};
  }
  @media (max-width: ${tabletWidth}) {
    z-index: 1000;
    max-width: 245px;
  }
`;
const SideBar = styled(Layout.Sider)`
  height: 100vh;
  width: 245px;
  max-width: 245px;
  min-width: 245px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #fbfafc;
  z-index: 22;

  &.ant-layout-sider-collapsed .logoWrapper {
    padding: 22.5px 20px;
  }
  .footerBottom {
    position: fixed;
    bottom: 10px;
    width: 245px;

    @media (max-width: ${tabletWidth}) {
      display: flex;
    }
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
    color: #fff;
    background: transparent;
    display: none;
  }
  .ant-select {
    width: 125px;
  }
  @media (max-width: ${tabletWidth}) {
    flex: 0 0 0px;
    max-width: 0px;
    min-width: 0px;
    width: 0px;
    background-color: rgba(251, 250, 252, 0.94);

    .mobileCloseIcon {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 10;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 20px !important;
        height: 20px !important;
        fill: #434b5d;
      }
    }
  }
`;

const LogoWrapper = styled(Row)`
  padding: 39px 39px 31px;
  text-align: center;
  display: flex;
  align-items: center;
`;

const LogoDash = styled.div`
  width: 100%;
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
  padding: 6px 0px 10px;
`;

const Menu = styled(AntMenu)`
  background: transparent;
  &:not(.ant-menu-horizontal) {
    .ant-menu-item-selected {
      color: #fff;
      background-color: transparent;
      
      &:before {
        opacity: 1;
      }
      &.removeSelectedBorder {
        border: none;
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
    height: calc(100vh - 270px);
    overflow: auto;
    
    @media (max-width: ${tabletWidth}) {
      height: calc(100vh - 105px);
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
    margin-top: 16px;
    height: 64px;
    padding: 10px 39px !important;
    max-width: 100%;
    
  }
  &.ant-menu-inline-collapsed {
    width: 100px;
    height: calc(100vh - 270px);
    overflow: auto;
    
    @media (max-width: ${tabletWidth}) {
      height: calc(100vh - 105px);
    }
  }
  &.ant-menu-inline-collapsed > .ant-menu-item {
    display: flex;
    text-align: center;
    justify-content: center;
    margin-top: 14px;
    padding: 10px 18px !important;
    height: 64px;
    width: 100%;
  }
  &.ant-menu-inline > .ant-menu-item {
    margin-top: 14px;
  }
  .ant-menu-item {
    position: relative;
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 18px;
      right: 18px;
      border-radius: 4px;
      background: #0EB08D;
      z-index: -1;
      opacity: 0;
      pointer-events: none;
      transition: all .3s ease;
    }
    svg {
      position: relative;
      z-index: 5;
    }
  }
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

const UserName = styled.div`
  font-size: 14px;
  color: #444;
`;

const UserType = styled.div`
  font-size: 12px;
  color: #444;
`;

const FooterDropDown = styled.div`
  position: relative;
  bottom: -4px;
  opacity: ${props => (props.isVisible ? "1" : "0")};
  transition: 0.2s;
  -webkit-transition: 0.2s;
  ul {
    background: #fff;
    border-bottom: 1px solid #fff;
    border-radius: 15px 15px 0px 0px;
    overflow: hidden;
    max-width: 100%;

    &.ant-menu-inline-collapsed {
      width: 84px;
      height: auto;
      margin-top: ${props => (props.isCollapsed ? "0" : "10px")};
      margin-left: ${props => (props.isCollapsed ? "0" : "8px")};
      box-shadow: ${props => (props.isCollapsed ? "0 -3px 5px 0 rgba(0,0,0,0.07)" : "none")};

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
        padding: 5px 16px;
        height: 50px;
        &:hover,
        &:focus {
          background: #fff;
        }
        a {
          color: #444;
          font-size: 14px;
          font-weight: 600;
          &:hover,
          &:focus {
            color: #444;
          }
          i {
            color: #425066;
            position: relative;
            margin-right: 5px;
            top: 2px;
            font-size: 20px;
          }
        }
      }
    }
  }
  @media (max-width: ${tabletWidth}) {
    ul {
      width: 60px;
      margin: 0 auto;
      box-shadow: 0 -4px 5px 0 rgba(0, 0, 0, 0.07) !important;

      li {
        padding: 0 !important;
        display: flex;
        align-items: center;
        justify-content: center;

        a {
          height: 20px;
          font-size: 0 !important;
        }
      }
    }
  }
`;

const MenuFooter = styled.div``;

const QuestionButton = styled.div`
  border-radius: 65px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  background-color: #ffffff;
  height: 60px;
  margin: 0 21px 23px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;

  span {
    font-weight: 600;
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
  @media (max-width: ${tabletWidth}) {
    width: 60px;
    margin: 0 auto 0 18px;

    &.active {
      opacity: 0;
      pointer-events: none;
    }
  }
`;

const UserInfoButton = styled.div`
  cursor: pointer;

  &.active {
    padding: 0;
    background: transparent;
    border-radius: 50%;
    width: 60px;
    margin: 0 auto;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);

    img {
      box-shadow: none;
    }
  }

  .footerDropdown {
    width: auto;
    height: 60px;
    border-radius: ${props => (props.isVisible ? "0px 0px 30px 30px" : "65px")};
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: ${props => (props.isCollapsed ? 0 : "0px 25px 0px 60px")};
    margin: ${props => (props.isCollapsed ? 0 : "0 21px")};
    position: relative;
    font-weight: 600;
    transition: 0.2s;
    -webkit-transition: 0.2s;
    .drop-caret {
      position: absolute;
      right: 10px;
      top: 20px;
    }
  }
  img {
    width: 60px;
    height: 60px;
    position: absolute;
    left: 0;
    border-radius: 50%;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  }
  .ant-select-selection {
    background: transparent;
    border: 0px;
    color: #ffffff;
  }

  @media (max-width: ${tabletWidth}) {
    width: 60px;
    padding: 0;
    margin: 0 18px 0 auto;
    background: ${props => (props.isVisible ? "#fff" : "transparent")};
    border-radius: ${props => (props.isVisible ? "0 0 15px 15px" : "50%")};
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);

    &.active {
      opacity: 0;
      pointer-events: none;
      background: transparent;
    }
    .footerDropdown {
      padding: 0;
      border-radius: 50%;
      width: 60px;
      margin: 0;
    }
  }
`;

const Logo = styled(IconHeader)`
  width: 119px;
  height: 21px;
`;

const LogoCompact = styled(IconLogoCompact)`
  width: 22px;
  height: 22px;
  margin: 14px 0 9px 19px;
  fill: #0eb08d;
  &:hover {
    fill: #0eb08d;
  }
`;

const IconContainer = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 60px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  border-radius: 50%;
  margin-right: 11px;

  &.active {
    margin-right: 0;
    box-shadow: none;
  }
  @media (max-width: ${tabletWidth}) {
    margin-right: 0;
    box-shadow: none;
  }
`;

const HelpIcon = styled(IconQuestion)`
  fill: #1fe3a1;
  width: 25px;
  height: 22px;
`;

const IconDropdown = styled(AntIcon)`
  color: #444;
  position: absolute;
  top: -10px;
`;
const LogoutIcon = styled(IconDropdown)`
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
`;

const LabelMenuItem = styled.span`
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
`;
