/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import ReactOutsideEvent from "react-outside-event";
import PerfectScrollbar from "react-perfect-scrollbar";
import { withNamespaces } from "@edulastic/localization";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { get } from "lodash";
import styled, { withTheme } from "styled-components";
import { Layout, Menu as AntMenu, Row, Col, Icon as AntIcon, Dropdown, Tooltip } from "antd";
import {
  IconHeader,
  IconLogoCompact,
  IconClockDashboard,
  IconBarChart,
  IconReport,
  IconManage,
  IconQuestion,
  IconProfileHighlight,
  IconSignoutHighlight
} from "@edulastic/icons";
import { withWindowSizes } from "@edulastic/common";
import {
  white,
  tabletWidth,
  largeDesktopWidth,
  extraDesktopWidthMax,
  mainTextColor,
  themeColor,
  extraDesktopWidth,
  mediumDesktopWidth,
  mediumDesktopExactWidth
} from "@edulastic/colors";
import { toggleSideBarAction } from "./ducks";
import { logoutAction } from "../Login/ducks";
import { IPAD_LANDSCAPE_WIDTH } from "../../assessment/constants/others";

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
    label: "Assignments",
    icon: IconClockDashboard,
    path: "home/assignments"
  },
  {
    label: "Grades",
    icon: IconReport,
    path: "home/grades"
  },
  {
    label: "Skill Mastery",
    icon: IconBarChart,
    path: "home/skill-mastery"
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

    this.sideMenuRef = React.createRef();
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

    if (windowWidth <= parseFloat(tabletWidth)) {
      this.toggleMenu();
    }

    if (menuItems[e.key].path !== undefined) {
      history.push(`/${menuItems[e.key].path}`);
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

  onClickFooterDropDownMenu = ({ key }) => {
    const { logout } = this.props;
    if (key === "0") {
      // onClickLogout
      this.toggleMenu();
      logout();
    } else if (key === "1") {
      // onClickLogoutProfile
      this.toggleDropdown();
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

  getInitials = () => {
    const { firstName, lastName } = this.props;
    if (firstName && lastName) return `${firstName[0] + lastName[0]}`;
    if (firstName) return `${firstName.substr(0, 2)}`;
    if (lastName) return `${lastName.substr(0, 2)}`;
  };

  render() {
    const { broken, isVisible } = this.state;
    const {
      windowWidth,
      currentPath,
      firstName,
      middleName,
      lastName,
      isSidebarCollapsed,
      t,
      profileThumbnail
    } = this.props;
    const userName = `${firstName} ${middleName ? `${middleName} ` : ``} ${lastName || ``}`;
    const page = currentPath.split("/").filter(item => !!item)[1];
    const menuIndex = getIndex(page, menuItems);
    const isMobile = windowWidth <= parseFloat(tabletWidth);
    const footerDropdownMenu = (
      <FooterDropDown isVisible={isVisible} className="footerDropWrap" isSidebarCollapsed={isSidebarCollapsed}>
        <Menu isSidebarCollapsed={isSidebarCollapsed} onClick={this.onClickFooterDropDownMenu}>
          <Menu.Item key="1" className="removeSelectedBorder">
            <Link to="/home/profile">
              <IconProfileHighlight />
              <span>{isSidebarCollapsed ? "" : t("common.myProfileText")}</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="0" className="removeSelectedBorder">
            <a>
              <IconSignoutHighlight />
              <span>{isSidebarCollapsed ? "" : t("common.signOutText")}</span>
            </a>
          </Menu.Item>
        </Menu>
      </FooterDropDown>
    );

    return (
      <>
        <FixedSidebar
          className={`${!isSidebarCollapsed ? "full" : ""}`}
          onClick={isSidebarCollapsed && !isMobile ? this.toggleMenu : null}
          isSidebarCollapsed={isSidebarCollapsed}
          ref={this.sideMenuRef}
        >
          <SideBar
            collapsed={isSidebarCollapsed}
            collapsible
            breakpoint="md"
            onBreakpoint={brokenStatus => this.setState({ broken: brokenStatus })}
            width="245"
            collapsedWidth={broken ? "0" : windowWidth <= IPAD_LANDSCAPE_WIDTH ? "90" : "100"}
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
                  <Col span={isSidebarCollapsed ? 24 : 18} style={{ textAlign: "left" }}>
                    {isSidebarCollapsed ? <LogoCompact /> : <Logo />}
                  </Col>
                  {broken ? null : (
                    <Col
                      span={isSidebarCollapsed ? 0 : 6}
                      style={{
                        textAlign: "center",
                        color: themeColor
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
                <Menu
                  isSidebarCollapsed={isSidebarCollapsed}
                  selectedKeys={[menuIndex.toString()]}
                  mode="inline"
                  onClick={this.handleMenu}
                >
                  {menuItems.map((menu, index) => {
                    const MenuIcon = this.renderIcon(menu.icon, isSidebarCollapsed);
                    return (
                      <MenuItem key={index.toString()} data-cy={menu.label} onClick={this.toggleMenu}>
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
                      getPopupContainer={() => this.sideMenuRef.current}
                    >
                      <div>
                        {profileThumbnail ? (
                          <img src={profileThumbnail} alt="Profile" />
                        ) : (
                          <PseudoDiv>{this.getInitials()}</PseudoDiv>
                        )}
                        <StyledTooltip title={userName}>
                          <div style={{ paddingLeft: 11, width: "100px" }}>
                            {!isSidebarCollapsed && (
                              <UserName>{userName.replace(/\s/g, "").length ? userName : "Anonymous"}</UserName>
                            )}
                            {!isSidebarCollapsed && <UserType>{t("common.userRoleStudent")}</UserType>}
                          </div>
                        </StyledTooltip>

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
      </>
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
      firstName: user?.user?.firstName || "",
      middleName: get(user, "user.middleName", ""),
      lastName: get(user, "user.lastName", ""),
      isSidebarCollapsed: ui.isSidebarCollapsed,
      zoomLevel: ui.zoomLevel,
      profileThumbnail: get(user, "user.thumbnail")
    }),
    {
      logout: logoutAction,
      toggleSideBar: toggleSideBarAction
    }
  )
);

export default enhance(withTheme(ReactOutsideEvent(SideMenu, ["mousedown"])));

const StyledTooltip = styled(Tooltip)`
  @media (max-width: ${tabletWidth}) {
    display: none;
  }
`;

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
    display: block !important;
  }
`;

const SideBar = styled(Layout.Sider)`
  min-height: 100vh;
  width: 245px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: ${props => props.theme.sideMenu.sidebarBgColor};
  z-index: 22;
  padding-bottom: 0;

  &.ant-layout-sider-collapsed .logoWrapper {
    padding: 12.5px 20px;

    @media (min-width: ${extraDesktopWidthMax}) {
      padding: 22.5px 20px;
    }

    @media (max-width: ${largeDesktopWidth}) {
      padding: 4.5px 20px;
    }
  }
  &.ant-layout-sider-collapsed .footerBottom {
    padding: 8px 8px 0px;
    width: 100px;

    @media (max-width: ${largeDesktopWidth}) {
      width: 90px;
    }
  }
  &.ant-layout-sider-collapsed .questionBtn {
    width: 60px;
    height: 60px;
    border-radius: 65px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
    background-color: ${white};
    padding: 0px;
    margin: 0 auto;
    justify-content: center;
    margin-bottom: 15px;
    &:hover {
      background: ${themeColor};
    }

    @media (max-width: ${largeDesktopWidth}) {
      width: 47px;
      height: 47px;
      border-radius: 47px;
      margin-bottom: 10px;
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
    color: ${white};
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

    ${({ collapsed }) =>
      collapsed
        ? `
      flex: inherit;
      max-width: 245px;
      min-width: 0;
      width: 100%;
    `
        : ``}
  }
`;

const LogoWrapper = styled(Row)`
  height: ${({ theme }) => theme.HeaderHeight.xs}px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${({ theme }) => theme.HeaderHeight.md}px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${({ theme }) => theme.HeaderHeight.xl}px;
  }
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
  padding: 8px 0px;
  min-height: calc(100% - 100px);

  @media (max-width: ${mediumDesktopWidth}) {
    min-height: calc(100% - 65px);
  }
  @media (max-width: ${tabletWidth}) {
    min-height: calc(100% - 20px);
  }
`;

const Menu = styled(AntMenu)`
  background: transparent;
  
  &:not(.ant-menu-horizontal) {
    .ant-menu-item-selected {
      color: ${props => props.theme.sideMenu.menuSelectedItemLinkColor};
      background-color: transparent;

      svg {
        fill: ${props => props.theme.sideMenu.menuSelectedItemLinkColor};
      }
      
      &:before {
        opacity: 1;
      }
      
      &.removeSelectedBorder {
        border: none;
        background-color: ${themeColor};
        &:hover{
          background-color: #fff;
          svg{
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
    overflow: auto;
    
    @media (max-width: ${tabletWidth}) {
      height: auto;
      margin-top: 30px;
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
    margin: 10px 0px;
    height: 38px;
    padding: 5px 39px !important;
    max-width: 100%;

    @media(max-width: ${tabletWidth}) {
      height: 60px;
    }
    
  }
  &.ant-menu-inline-collapsed {
    width: 100px;
    
    @media(max-width: ${largeDesktopWidth}) {
      width: 90px;
    }
  }
  &.ant-menu-inline-collapsed > .ant-menu-item {
    display: flex;
    text-align: center;
    justify-content: center;
    margin: 10px 0px;
    padding: 5px 18px !important;
    height: 38px;
    width: 100%;
  }
  @media (min-width: ${extraDesktopWidth}) {
    &.ant-menu-inline-collapsed > .ant-menu-item,
    &.ant-menu-inline .ant-menu-item {
      margin: 15px 0px;
    }
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
      
      @media (max-width: ${largeDesktopWidth}) {
        left: 13px;
        right: 13px;
      }
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
    justify-content: space-between;
    padding: 15px;
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
    margin: 0px;

    &.active {
      opacity: 0;
      pointer-events: none;
    }
  }
`;

const UserName = styled.div`
  font-size: ${props => props.theme.sideMenu.userInfoNameFontSize};
  color: ${props => props.theme.sideMenu.userInfoNameTextColor};
  text-transform: capitalize;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
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
  .ant-menu-item:not(.ant-menu-item-selected) svg {
    fill: ${props => props.theme.sideMenu.userInfoDropdownItemTextColor};
    &:hover,
    &:focus {
      fill: ${props => props.theme.sideMenu.userInfoDropdownItemTextHoverColor};
    }
  }
  ul {
    background: ${props => props.theme.sideMenu.userInfoDropdownBgColor};
    border-bottom: 1px solid ${white};
    border-radius: 30px 30px 0px 0px;
    overflow: hidden;
    max-width: 100%;
    padding-bottom: 10px;
    background: #fff;
    .ant-menu-item:not(.ant-menu-item-selected) svg {
      fill: ${props => props.theme.sideMenu.userInfoDropdownItemTextColor};
      &:hover,
      &:focus {
        fill: ${props => props.theme.sideMenu.userInfoDropdownItemTextHoverColor};
      }
    }
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
        margin-bottom: 0 !important;
        padding: 5px 16px;
        height: 50px;
        background: ${props => props.theme.sideMenu.userInfoDropdownItemBgColor};
        &:hover,
        &:focus {
          background: ${props => props.theme.sideMenu.userInfoDropdownItemBgHoverColor};
          a {
            color: ${props => props.theme.sideMenu.userInfoDropdownItemTextHoverColor};
          }
          svg,
          svg path {
            fill: ${props => props.theme.sideMenu.userInfoDropdownItemTextHoverColor};
          }
        }
        a {
          color: ${props => props.theme.sideMenu.userInfoDropdownItemTextColor};
          font-size: ${props => props.theme.sideMenu.userInfoDropdownItemFontSize};
          font-weight: 600;
          display: flex;
          align-items: center;
          &:hover,
          &:focus {
            color: ${props => props.theme.sideMenu.userInfoDropdownItemTextHoverColor};
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
          span {
            display: none;
          }
          svg {
            margin-right: 10px !important;
          }
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

    @media (max-width: ${tabletWidth}) {
      width: 60px;
    }
  }

  img {
    width: 60px;
    height: 60px;
    position: absolute;
    left: 0;
    border-radius: 50%;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);

    @media (max-width: ${tabletWidth}) {
      height: 60px;
      width: 60px;
    }
  }

  .ant-select-selection {
    background: transparent;
    border: 0px;
    color: ${white};
  }

  @media (max-width: ${tabletWidth}) {
    width: 60px;
    padding: 0;
    margin: 0px;
    background: ${props => (props.isVisible ? white : "transparent")};
    border-radius: ${props => (props.isVisible ? "0 0 15px 15px" : "50%")};

    &.active {
      opacity: 0;
      pointer-events: none;
      background: transparent;
    }
  }

  @media (max-width: ${tabletWidth}) {
    width: 60px;
  }
`;

const PseudoDiv = styled.div`
  width: 60px;
  height: 60px;
  position: absolute;
  left: 0;
  border-radius: 50%;
  background: #dddddd;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  font-size: 20px;
  font-weight: bold;
  line-height: 60px;
  text-align: center;
  text-transform: uppercase;
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

  @media (max-width: ${tabletWidth}) {
    width: 60px;
    padding: 0px;
    margin: 0px;
    max-height: 60px;
  }
`;

const Logo = styled(IconHeader)`
  width: 100%;
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
  color: ${mainTextColor};
  position: absolute;
  top: -10px;
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
    color: ${white};
  }
`;

const LabelMenuItem = styled.span`
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
`;
