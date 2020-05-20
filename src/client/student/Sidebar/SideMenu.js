/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import ReactOutsideEvent from "react-outside-event";
import PerfectScrollbar from "react-perfect-scrollbar";
import { withNamespaces } from "@edulastic/localization";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { get, pick } from "lodash";
import styled, { withTheme } from "styled-components";
import { Layout, Menu as AntMenu, Row, Col, Icon as AntIcon, Dropdown } from "antd";
import {
  IconHeader,
  IconLogoCompact,
  IconClockDashboard,
  IconBarChart,
  IconReport,
  IconManage,
  IconQuestion,
  IconProfileHighlight,
  IconSignoutHighlight,
  IconPlaylist,
  IconSwitchUser
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
  mediumDesktopExactWidth,
  greyThemeLighter
} from "@edulastic/colors";
import { toggleSideBarAction } from "./ducks";
import SwitchUserModal from "../../common/components/SwtichUserModal/SwitchUserModal";
import { switchUser } from "../../author/authUtils";
import { logoutAction, isProxyUser as isProxyUserSelector } from "../Login/ducks";

const menuItems = [
  {
    label: "Assignments",
    icon: IconClockDashboard,
    path: "home/assignments"
  },
  {
    label: "Playlist",
    icon: IconPlaylist,
    path: "home/playlist"
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

const getIndex = (page, items, isReports = false) => {
  let index;
  if (isReports) {
    /*
     *  change the return value to the index of "home/grades" route in the menuItems
     */
    return 2;
  }
  items.forEach((item, i) => {
    if (item.path && item.path.includes(page)) {
      index = i;
    }
  });
  return index || 0;
};

class SideMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      isVisible: false
    };

    this.sideMenuRef = React.createRef();
  }

  renderIcon = (icon, isSidebarCollapsed) => styled(icon)`
    width: 18px;
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
    if (key === "2") {
      this.setState({ showModal: true });
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
    const { broken, isVisible, showModal } = this.state;
    const {
      userId,
      switchDetails,
      windowWidth,
      currentPath,
      firstName,
      middleName,
      lastName,
      isSidebarCollapsed,
      t,
      profileThumbnail,
      role,
      features,
      isProxyUser
    } = this.props;
    const userName = `${firstName} ${middleName ? `${middleName} ` : ``} ${lastName || ``}`;
    const page = currentPath.split("/").filter(item => !!item)[1];
    const isReports = currentPath.split("/").includes("testActivityReport");
    const menuIndex = getIndex(page, menuItems, isReports);
    const isMobile = windowWidth <= parseFloat(tabletWidth);
    const footerDropdownMenu = (
      <FooterDropDown
        data-cy="footer-dropdown"
        isVisible={isVisible}
        className="footerDropWrap"
        isSidebarCollapsed={isSidebarCollapsed}
      >
        <Menu isSidebarCollapsed={isSidebarCollapsed} onClick={this.onClickFooterDropDownMenu}>
          <Menu.Item key="1" className="removeSelectedBorder">
            <Link to="/home/profile">
              <IconProfileHighlight />
              <span>{isSidebarCollapsed ? "" : t("common.myProfileText")}</span>
            </Link>
          </Menu.Item>
          {get(switchDetails, "otherAccounts", []).length ? (
            <Menu.Item key="2" className="removeSelectedBorder">
              <a>
                <IconSwitchUser /> {isSidebarCollapsed ? "" : "Switch Accounts"}
              </a>
            </Menu.Item>
          ) : (
            <Menu.Item key="3" className="removeSelectedBorder">
              <Link to={`/?addAccount=true&userId=${userId}`} target="_blank">
                <IconSwitchUser /> {isSidebarCollapsed ? "" : "Add Accounts"}
              </Link>
            </Menu.Item>
          )}
          <Menu.Item data-cy="signout" key="0" className="removeSelectedBorder">
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
        <SwitchUserModal
          userId={userId}
          switchUser={switchUser}
          showModal={showModal}
          closeModal={() => this.setState({ showModal: false })}
          otherAccounts={get(switchDetails, "otherAccounts", [])}
          personId={get(switchDetails, "personId")}
        />
        <FixedSidebar
          className={`${!isSidebarCollapsed ? "full" : ""}`}
          onClick={isSidebarCollapsed && !isMobile ? this.toggleMenu : null}
          isSidebarCollapsed={isSidebarCollapsed}
          ref={this.sideMenuRef}
          isProxyUser={isProxyUser}
        >
          <SideBar
            collapsed={isSidebarCollapsed}
            collapsible
            breakpoint="md"
            onBreakpoint={brokenStatus => this.setState({ broken: brokenStatus })}
            width="220"
            collapsedWidth={broken ? "0" : "70"}
            className="sideBarwrapper"
            data-cy="side-wrapper"
          >
            <ToggleSidemenu
              onClick={e => {
                e.stopPropagation();
                this.toggleMenu();
              }}
            >
              <AntIcon type={isSidebarCollapsed ? "right" : "left"} />
            </ToggleSidemenu>
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
                  <Col span={24} style={{ textAlign: isSidebarCollapsed ? "center" : "left" }}>
                    {isSidebarCollapsed ? <LogoCompact /> : <Logo />}
                  </Col>
                </LogoWrapper>
              )}

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
                    if (menu?.label === "Playlist" && !features?.playlist) {
                      return null;
                    }
                    return (
                      <MenuItem
                        key={index.toString()}
                        data-cy={menu.label}
                        onClick={this.toggleMenu}
                        title={isSidebarCollapsed ? menu.label : ""}
                      >
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
                        minWidth: isSidebarCollapsed ? "50px" : "178px",
                        maxWidth: isSidebarCollapsed ? "50px" : "0px"
                      }}
                      className="footerDropdown"
                      overlay={footerDropdownMenu}
                      trigger={["click"]}
                      placement="topCenter"
                      isVisible={isVisible}
                      isSidebarCollapsed={isSidebarCollapsed}
                      onVisibleChange={this.handleVisibleChange}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      <div>
                        {profileThumbnail ? (
                          <UserImg src={profileThumbnail} alt="Profile" />
                        ) : (
                          <PseudoDiv>{this.getInitials()}</PseudoDiv>
                        )}
                        <div style={{ paddingLeft: 11, width: "100px" }}>
                          {!isSidebarCollapsed && (
                            <UserName>{userName.replace(/\s/g, "").length ? userName : "Anonymous"}</UserName>
                          )}
                          {!isSidebarCollapsed && (
                            <UserType>{role === "parent" ? "parent" : t("common.userRoleStudent")}</UserType>
                          )}
                        </div>

                        {!isSidebarCollapsed && !isMobile && (
                          <IconDropdown
                            style={{ fontSize: 15, pointerEvents: "none" }}
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
      userId: get(user, "user._id", ""),
      isSidebarCollapsed: ui.isSidebarCollapsed,
      zoomLevel: ui.zoomLevel,
      profileThumbnail: get(user, "user.thumbnail"),
      role: user?.user?.role,
      switchDetails: pick(user?.user, ["personId", "otherAccounts"]),
      features: user?.user?.features,
      isProxyUser: isProxyUserSelector({ user })
    }),
    {
      logout: logoutAction,
      toggleSideBar: toggleSideBarAction
    }
  )
);

export default enhance(withTheme(ReactOutsideEvent(SideMenu, ["mousedown"])));

const FixedSidebar = styled.div`
  position: fixed;
  left: 0px;
  top: ${props => (props.isProxyUser ? props.theme.BannerHeight : 0)}px;
  bottom: 0px;
  z-index: 1000;
  cursor: ${props => (props.isSidebarCollapsed ? "pointer" : "initial")};

  @media (max-width: ${tabletWidth}) {
    z-index: 1000;
    max-width: 220px;
    display: block !important;
  }
`;

const SideBar = styled(Layout.Sider)`
  height: 100%;
  width: 220px;
  background-color: #2f4151;
  z-index: 22;
  padding-bottom: 0;

  &.ant-layout-sider-collapsed .footerBottom {
    padding: 8px 8px 0px;
    width: 70px;
  }
  &.ant-layout-sider-collapsed .questionBtn {
    width: 50px;
    height: 50px;
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
    &.ant-layout-sider-collapsed {
      min-width: 0px !important;
      max-width: 0px !important;
    }

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
        fill: #7c93a7;
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
`;

const LogoWrapper = styled(Row)`
  height: ${({ theme }) => theme.HeaderHeight.xs}px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${({ theme }) => theme.HeaderHeight.md}px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${({ theme }) => theme.HeaderHeight.xl}px;
  }
`;

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
`;

const MenuWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 8px 0px;
  min-height: ${({ theme }) => `calc(100% - ${theme.HeaderHeight.xs}px)`};
  position: relative;
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
    margin: 8px 0px;
    height: 38px;
    padding: 5px 25px !important;
    max-width: 100%;

    @media (max-width: ${tabletWidth}) {
      height: 50px;
    }
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
  .ant-menu-item {
    position: relative;
    background: transparent;

    &:before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 14px;
      right: 14px;
      border-radius: 4px;
      background: ${props => props.theme.sideMenu.menuSelectedItemBgColor};
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
      fill: ${props => props.theme.sideMenu.menuItemLinkColor};
    }
    &:hover {
      svg {
        fill: ${props => props.theme.sideMenu.menuItemLinkHoverColor};
      }
      color: ${props => props.theme.sideMenu.menuItemLinkHoverColor};
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
  height: 50px;
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
    width: 50px;
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
      width: 50px;
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

const UserImg = styled.div`
  width: 52px;
  height: 52px;
  background: url(${props => props.src});
  background-position: center center;
  background-size: cover;
  border-radius: 50%;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  position: absolute;
  left: 0;
  margin-bottom: -1px;
  margin-left: -1px;
`;

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

    @media (max-width: ${tabletWidth}) {
      width: 50px;
    }
  }

  .ant-dropdown {
    left: 21px !important;
  }

  .ant-select-selection {
    background: transparent;
    border: 0px;
    color: ${white};
  }

  @media (max-width: ${tabletWidth}) {
    width: 50px;
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
    width: 50px;
  }
`;

const PseudoDiv = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  left: 0;
  border-radius: 50%;
  background: #dddddd;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  font-size: 20px;
  font-weight: bold;
  line-height: 50px;
  text-align: center;
  text-transform: uppercase;
`;

const DropdownBtn = styled(Dropdown)`
  width: auto;
  height: 50px;
  border-radius: ${props => (props.isVisible ? "0px 0px 30px 30px" : "65px")};
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);
  background-color: ${props => props.theme.sideMenu.userInfoButtonBgColor};
  display: flex;
  align-items: center;
  padding: ${props => (props.isSidebarCollapsed ? 0 : "0px 25px 0px 50px")};
  margin: ${props => (props.isSidebarCollapsed ? 0 : "0 21px")};
  position: relative;
  font-weight: 600;
  transition: 0.2s;
  -webkit-transition: 0.2s;
  .drop-caret {
    position: absolute;
    right: 10px;
    top: 18px;
    color: ${props => props.theme.sideMenu.dropdownIconColor};
  }
  @media (max-width: ${tabletWidth}) {
    &.footerDropdown {
      padding: 0;
      border-radius: 50%;
      width: 50px;
      margin: 0;
    }
  }

  @media (max-width: ${tabletWidth}) {
    width: 50px;
    padding: 0px;
    margin: 0px;
    max-height: 50px;
  }
`;

const Logo = styled(IconHeader)`
  width: auto;
  height: 25px;
  path.b {
    fill: ${white};
  }
`;

const LogoCompact = styled(IconLogoCompact)`
  width: 22px;
  height: 25px;
  fill: #0eb08d;
  &:hover {
    fill: #0eb08d;
  }
`;

const IconContainer = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
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
