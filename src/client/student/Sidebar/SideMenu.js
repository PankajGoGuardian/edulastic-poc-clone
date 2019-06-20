import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import ReactOutsideEvent from "react-outside-event";
import PerfectScrollbar from "react-perfect-scrollbar";
import { withNamespaces } from "@edulastic/localization";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Layout, Menu as AntMenu, Row, Col, Icon as AntIcon, Dropdown } from "antd";
import styled, { css } from "styled-components";
import {
  IconAssignment,
  IconHeader,
  IconLogoCompact,
  IconClockDashboard,
  IconBarChart,
  IconReport,
  IconManage,
  IconQuestion
} from "@edulastic/icons";
import { withWindowSizes } from "@edulastic/common";
import { tabletWidth } from "@edulastic/colors";
import { toggleSideBarAction } from "./ducks";
import { logoutAction } from "../Login/ducks";

import Profile from "../assets/Profile.png";

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
    label: "Dashboard",
    icon: IconClockDashboard
  },
  {
    label: "Assignments",
    icon: IconAssignment,
    path: "home/assignments"
  },
  {
    label: "Reports",
    icon: IconReport,
    path: "home/reports"
  },
  {
    label: "Skill Reports",
    icon: IconBarChart,
    path: "home/skill-report"
  },
  {
    label: "Manage Class",
    icon: IconManage,
    path: "home/manage"
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

  handleMenu = e => {
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

  handleVisibleChange = flag => {
    this.setState({ isVisible: flag });
  };

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

  onOutsideEvent = event => {
    const { isSidebarCollapsed } = this.props;

    if (event.type === "mousedown" && !isSidebarCollapsed) {
      this.toggleMenu();
      this.setState({ isVisible: false });
    }
  };

  render() {
    const { broken, isVisible } = this.state;
    const { windowWidth, currentPath, firstName, logout, isSidebarCollapsed, t } = this.props;
    const page = currentPath.split("/").filter(item => !!item)[1];
    const menuIndex = getIndex(page, menuItems);
    const isMobile = windowWidth <= parseFloat(tabletWidth);
    const footerDropdownMenu = (
      <FooterDropDown isVisible={isVisible} className="footerDropWrap" isSidebarCollapsed={isSidebarCollapsed}>
        <Menu>
          <Menu.Item key="0" className="removeSelectedBorder">
            <a onClick={logout}>
              <LogoutIcon type="logout" /> {isSidebarCollapsed ? "" : t("common.signOutText")}
            </a>
          </Menu.Item>
          <Menu.Item key="1" className="removeSelectedBorder">
            <Link to="/home/profile" onClick={this.handleProfileClick}>
              <IconDropdown type="user" /> {isSidebarCollapsed ? "" : t("common.myProfileText")}
            </Link>
          </Menu.Item>
        </Menu>
      </FooterDropDown>
    );

    return (
      <FixedSidebar
        className={`${!isSidebarCollapsed ? "full" : ""}`}
        onClick={isSidebarCollapsed && !isMobile ? this.toggleMenu : null}
        isSidebarCollapsed={isSidebarCollapsed}
      >
        <SideBar
          collapsed={isSidebarCollapsed}
          collapsible
          breakpoint="md"
          onBreakpoint={brokenStatus => this.setState({ broken: brokenStatus })}
          width="245"
          collapsedWidth={broken ? "0" : "100"}
          className="sideBarwrapper"
          data-cy="side-wrapper"
        >
          <PerfectScrollbar>
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
                  {isSidebarCollapsed ? <LogoCompact /> : <Logo />}
                </Col>
                {broken ? null : (
                  <Col
                    span={6}
                    style={{
                      textAlign: "right",
                      color: "#1fe3a1",
                      right: isSidebarCollapsed ? "-5px" : "-21px",
                      top: isSidebarCollapsed ? "0" : "-5px"
                    }}
                  >
                    {!isSidebarCollapsed && (
                      <AntIcon
                        className="trigger"
                        type={isSidebarCollapsed ? "right" : "left"}
                        onClick={this.toggleMenu}
                      />
                    )}
                  </Col>
                )}
              </LogoWrapper>
            )}
            <LogoDash />
            <MenuWrapper isSidebarCollapsed={isSidebarCollapsed}>
              {isMobile && isSidebarCollapsed ? <IconBars type="bars" onClick={this.toggleMenu} /> : null}
              <Menu defaultSelectedKeys={[menuIndex.toString()]} mode="inline" onClick={this.handleMenu}>
                {menuItems.map((menu, index) => {
                  const MenuIcon = this.renderIcon(menu.icon, isSidebarCollapsed);
                  return (
                    <MenuItem key={index.toString()} data-cy={`label${index}`} onClick={this.toggleMenu}>
                      <MenuIcon />
                      {!isSidebarCollapsed && <LabelMenuItem>{menu.label}</LabelMenuItem>}
                    </MenuItem>
                  );
                })}
              </Menu>
              <MenuFooter className="footerBottom">
                <QuestionButton className={`questionBtn ${isSidebarCollapsed ? "active" : ""}`}>
                  <IconContainer className={isSidebarCollapsed ? "active" : ""}>
                    <HelpIcon />
                  </IconContainer>
                  {isSidebarCollapsed || isMobile ? null : <span>{t("common.helpButtonText")}</span>}
                </QuestionButton>

                <UserInfoButton
                  data-cy="userInfo"
                  isVisible={isVisible}
                  isSidebarCollapsed={isSidebarCollapsed}
                  className={`userinfoBtn ${isSidebarCollapsed ? "active" : ""}`}
                >
                  <DropdownBtn
                    onClick={this.toggleDropdown}
                    overlayStyle={{
                      position: "fixed",
                      minWidth: isSidebarCollapsed ? "60px" : "198px",
                      maxWidth: isSidebarCollapsed ? "60px" : "0px"
                    }}
                    className="footerDropdown"
                    overlay={footerDropdownMenu}
                    trigger={["click"]}
                    placement="topCenter"
                    isVisible={isVisible}
                    isSidebarCollapsed={isSidebarCollapsed}
                    onVisibleChange={this.handleVisibleChange}
                  >
                    <div>
                      <img src={Profile} alt="Profile" />
                      <div style={{ paddingLeft: 11 }}>
                        {!isSidebarCollapsed && <UserName>{firstName || "Zack Oliver"}</UserName>}
                        {!isSidebarCollapsed && <UserType>{t("common.userRoleStudent")}</UserType>}
                      </div>
                      {!isSidebarCollapsed && !isMobile && (
                        <IconDropdown
                          style={{ fontSize: 20, pointerEvents: "none" }}
                          className="drop-caret"
                          type={isVisible ? "caret-up" : "caret-down"}
                        />
                      )}
                    </div>
                  </DropdownBtn>
                </UserInfoButton>
              </MenuFooter>
            </MenuWrapper>
          </PerfectScrollbar>
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
  isSidebarCollapsed: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired
};

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces("sidemenu"),
  connect(
    ({ router, user, ui }) => ({
      currentPath: router.location.pathname,
      firstName: (user.user && user.user.firstName) || "",
      isSidebarCollapsed: ui.isSidebarCollapsed
    }),
    { logout: logoutAction, toggleSideBar: toggleSideBarAction }
  )
);

export default enhance(ReactOutsideEvent(SideMenu, ["mousedown"]));

const FixedSidebar = styled.div`
  position: fixed;
  left: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 1000;
  cursor: ${props => (props.isSidebarCollapsed ? "pointer" : "initial")};

  .scrollbar-container {
    max-height: 100vh;

    > * {
      pointer-events: ${props => (props.isSidebarCollapsed ? "none" : "all")};
    }
  }

  .ant-layout-sider-children {
    height: 100vh !important;
  }

  @media (max-width: ${tabletWidth}) {
    z-index: 1000;
    max-width: 245px;
  }
`;

const SideBar = styled(Layout.Sider)`
  min-height: 100vh;
  width: 245px;
  max-width: 245px;
  min-width: 245px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #fbfafc;
  z-index: 22;
  padding-bottom: 0;

  &.ant-layout-sider-collapsed .logoWrapper {
    padding: 22.5px 20px;
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
    margin-bottom: 23px;

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
  padding: 6px 0px 10px;
  min-height: calc(100% - 100px);

  @media (max-width: ${tabletWidth}) {
    min-height: 100%;
    display: ${props => (props.isSidebarCollapsed ? "none" : "flex")};
  }
`;

const Menu = styled(AntMenu)`
  background: transparent;
  &:not(.ant-menu-horizontal) {
    .ant-menu-item-selected {
      color: #fff;
      background-color: transparent;

      svg {
        fill: ${props => props.theme.sideMenu.menuSelectedItemLinkColor};
      }
      
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
    overflow: auto;
    
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
    margin-top: 16px;
    height: 64px;
    padding: 10px 39px !important;
    max-width: 100%;
    
  }
  &.ant-menu-inline-collapsed {
    width: 100px;
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
    background: ${props => props.theme.sideMenu.menuItemBgColor};
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 18px;
      right: 18px;
      border-radius: 4px;
      background: ${props => props.theme.sideMenu.menuSelectedItemBgColor};
      z-index: -1;
      opacity: 0;
      pointer-events: none;
      transition: all .3s ease;
    }
  }
  .ant-menu-item:not(.ant-menu-item-selected) {
    svg {
      position: relative;
      z-index: 5;
      fill: ${props => props.theme.sideMenu.menuItemLinkColor};
    }
    &:hover {
      svg {
        fill: ${props => props.theme.sideMenu.menuItemLinkHoverColor};
      }
      color: ${props => props.theme.sideMenu.menuItemLinkHoverColor};
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
  color: ${props => props.theme.sideMenu.menuItemLinkColor};
  display: flex;
  align-items: center;
  margin-top: 16px;
`;

const MenuFooter = styled.div`
  position: static;
  width: 100%;
  margin-top: auto;

  @media (max-width: ${tabletWidth}) {
    display: flex;
  }
`;

const QuestionButton = styled.div`
  border-radius: 65px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  font-size: ${props => props.theme.sideMenu.helpButtonFontSize};
  background-color: ${props => props.theme.sideMenu.helpButtonBgColor};
  color: ${props => props.theme.sideMenu.helpButtonTextColor};
  height: 60px;
  margin: 0 21px 23px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  svg {
    fill: ${props => props.theme.sideMenu.helpIconColor};
  }
  span {
    font-weight: 600;
  }
  &:hover {
    background: ${props => props.theme.sideMenu.helpButtonBgHoverColor};
    color: ${props => props.theme.sideMenu.helpButtonTextHoverColor};
    svg {
      fill: ${props => props.theme.sideMenu.helpIconHoverColor};
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

const UserName = styled.div`
  font-size: ${props => props.theme.sideMenu.userInfoNameFontSize};
  color: ${props => props.theme.sideMenu.userInfoNameTextColor};
`;

const UserType = styled.div`
  font-size: ${props => props.theme.sideMenu.userInfoRoleFontSize};
  color: ${props => props.theme.sideMenu.userInfoRoleTextColor};
`;

const FooterDropDown = styled.div`
  position: relative;
  bottom: -4px;
  opacity: ${props => (props.isVisible ? "1" : "0")};
  transition: 0.2s;
  -webkit-transition: 0.2s;
  ul {
    background: ${props => props.theme.sideMenu.userInfoDropdownBgColor};
    border-bottom: 1px solid #fff;
    border-radius: 15px 15px 0px 0px;
    overflow: hidden;
    max-width: 100%;

    &.ant-menu-inline-collapsed {
      width: 84px;
      height: auto;
      margin-top: ${props => (props.isSidebarCollapsed ? "0" : "10px")};
      margin-left: ${props => (props.isSidebarCollapsed ? "0" : "8px")};
      box-shadow: ${props => (props.isSidebarCollapsed ? "0 -3px 5px 0 rgba(0,0,0,0.07)" : "none")};

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
        background: ${props => props.theme.sideMenu.userInfoDropdownItemBgColor};
        &:hover,
        &:focus {
          background: ${props => props.theme.sideMenu.userInfoDropdownItemBgHoverColor};
        }
        a {
          color: ${props => props.theme.sideMenu.userInfoDropdownItemTextColor};
          font-size: ${props => props.theme.sideMenu.userInfoDropdownItemFontSize};
          font-weight: 600;
          &:hover,
          &:focus {
            color: ${props => props.theme.sideMenu.userInfoDropdownItemTextHoverColor};
          }
          i {
            color: ${props => props.theme.sideMenu.itemIconColor};
            position: relative;
            margin-right: 5px;
            top: 2px;
            font-size: ${props => props.theme.sideMenu.userInfoDropdownItemIconSize};
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
  }
`;

const DropdownBtn = styled(Dropdown)`
  width: auto;
  height: 60px;
  border-radius: ${props => (props.isVisible ? "0px 0px 30px 30px" : "65px")};
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  background-color: ${props => props.theme.sideMenu.userInfoButtonBgColor};
  display: flex;
  align-items: center;
  padding: ${props => (props.isSidebarCollapsed ? 0 : "0px 25px 0px 60px")};
  margin: ${props => (props.isSidebarCollapsed ? 0 : "0 21px")};
  position: relative;
  font-weight: 600;
  transition: 0.2s;
  -webkit-transition: 0.2s;
  .drop-caret {
    position: absolute;
    right: 10px;
    top: 20px;
    color: ${props => props.theme.sideMenu.dropdownIconColor};
  }
  @media (max-width: ${tabletWidth}) {
    &.footerDropdown {
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

const IconBars = styled(AntIcon)`
  display: none;
  @media (max-width: 768px) {
    display: inline-block;
    padding-left: 17px;
    position: absolute;
    top: 18px;
    left: 12px;
    font-size: 24px;
    color: #fff;
  }
`;

const LabelMenuItem = styled.span`
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
`;
