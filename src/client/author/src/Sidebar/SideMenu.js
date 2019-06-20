import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import ReactOutsideEvent from "react-outside-event";
import { get } from "lodash";
import { withRouter } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
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
  IconItemLibrary,
  IconTestBank,
  IconPlaylist,
  IconSettings
} from "@edulastic/icons";
import { dashBorderColor, fadedBlack, redHeart, tabletWidth } from "@edulastic/colors";
import { withWindowSizes } from "@edulastic/common";
import { getLastPlayListSelector } from "../../Playlist/ducks";
import { logoutAction } from "../actions/auth";
import { toggleSideBarAction } from "../actions/toggleMenu";
import Profile from "../assets/Profile.png";
const menuItems = [
  {
    label: "Dashboard",
    icon: IconClockDashboard,
    path: "author/dashboard"
  },
  {
    label: "Assignments",
    icon: IconAssignment,
    path: "author/assignments"
  },
  {
    label: "PlayList Library",
    icon: IconPlaylist,
    path: "author/playlists"
  },

  {
    label: "Test Library",
    icon: IconTestBank,
    path: "author/tests"
  },
  {
    label: "Item Bank",
    icon: IconItemLibrary,
    path: "author/items"
  },
  {
    label: "Reports",
    icon: IconBarChart,
    path: "author/reports"
  },
  {
    label: "Manage Class",
    icon: IconManage,
    path: "author/manageClass",
    role: ["teacher"]
  },
  {
    label: "Manage District",
    icon: IconSettings,
    path: "author/districtprofile",
    role: ["edulastic-admin", "district-admin", "school-admin"]
  }
];
class SideMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false
    };
  }
  get MenuItems() {
    const { lastPlayList, isSidebarCollapsed } = this.props;
    if (!lastPlayList || !lastPlayList.value) return menuItems;
    const [item1, item2, ...rest] = menuItems;
    const { title = "Eureka Math", _id = "" } = lastPlayList.value || {};
    const [fT = "", lT = ""] = title.split(" ");
    const PlayListTextIcon = () => (
      <TextIcon isSidebarCollapsed={isSidebarCollapsed}>
        {`${fT[0] ? fT[0] : ""}${lT[0] ? lT[0] : ""}`} <i className="fa fa-heart" />
      </TextIcon>
    );
    return [
      item1,
      item2,
      {
        label: title,
        icon: PlayListTextIcon,
        path: `author/playlists/${_id}/use-this`
      },
      ...rest
    ];
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
    if (this.MenuItems[item.key].path !== undefined) {
      history.push(`/${this.MenuItems[item.key].path}`);
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

  onOutsideEvent = event => {
    const { isSidebarCollapsed } = this.props;

    if (event.type === "mousedown" && !isSidebarCollapsed) {
      this.toggleMenu();
      this.setState({ isVisible: false });
    }
  };

  render() {
    const { broken, isVisible } = this.state;
    const { windowWidth, history, isSidebarCollapsed, firstName, middleName, lastName, logout, userRole } = this.props;
    const userName = firstName + " " + (middleName ? middleName + " " : "") + (lastName ? lastName : "");

    const isCollapsed = isSidebarCollapsed;
    const isMobile = windowWidth < 770;
    const defaultSelectedMenu = this.MenuItems.findIndex(menuItem =>
      history.location.pathname.includes(`/${menuItem.path}`)
    );

    const footerDropdownMenu = (
      <FooterDropDown isVisible={isVisible} isCollapsed={isCollapsed}>
        <Menu>
          <Menu.Item key="0" className="removeSelectedBorder">
            <a onClick={logout}>
              <LogoutIcon type="logout" /> {isCollapsed ? "" : "SIGN OUT"}
            </a>
          </Menu.Item>
          <Menu.Item key="1" className="removeSelectedBorder">
            <a onClick={event => event.preventDefault()}>
              <IconDropdown type="user" /> {isCollapsed ? "" : "MY PROFILE"}
            </a>
          </Menu.Item>
        </Menu>
      </FooterDropDown>
    );

    return (
      <FixedSidebar
        className={`${!isCollapsed ? "full" : ""} ${this.props.className}`}
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
          className="sideBarwrapper"
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
                    {!isCollapsed && (
                      <AntIcon className="trigger" type={isCollapsed ? "right" : "left"} onClick={this.toggleMenu} />
                    )}
                  </Col>
                )}
              </LogoWrapper>
            )}
            {!isMobile && <LogoDash />}
            <MenuWrapper>
              <Menu
                selectedKeys={[defaultSelectedMenu.toString()]}
                mode="inline"
                onClick={item => this.handleMenu(item)}
              >
                {this.MenuItems.map((menu, index) => {
                  const MenuIcon = this.renderIcon(menu.icon, isCollapsed);
                  const isItemVisible = !menu.role || (menu.role && menu.role.includes(userRole));
                  return (
                    <MenuItem key={index.toString()} onClick={this.toggleMenu} visible={isItemVisible}>
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
                        {!isCollapsed && !isMobile && <UserName>{userName || "Zack Oliver"}</UserName>}
                        {!isCollapsed && !isMobile && <UserType>Teacher</UserType>}
                      </div>
                      {!isCollapsed && !isMobile && (
                        <IconDropdown
                          style={{ fontSize: 20, pointerEvents: "none" }}
                          className="drop-caret"
                          type={isVisible ? "caret-up" : "caret-down"}
                        />
                      )}
                    </div>
                  </Dropdown>
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
  toggleSideBar: PropTypes.func.isRequired,
  firstName: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  isSidebarCollapsed: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired
};

const enhance = compose(
  withRouter,
  withWindowSizes,
  connect(
    state => ({
      isSidebarCollapsed: state.authorUi.isSidebarCollapsed,
      firstName: get(state.user, "user.firstName", ""),
      middleName: get(state.user, "user.middleName", ""),
      lastName: get(state.user, "user.lastName", ""),
      userRole: get(state.user, "user.role", ""),
      lastPlayList: getLastPlayListSelector(state)
    }),
    { toggleSideBar: toggleSideBarAction, logout: logoutAction }
  )
);

export default enhance(ReactOutsideEvent(SideMenu, ["mousedown"]));

const TextIcon = styled.div`
  border-radius: 50%;
  margin-right: 1em;
  width: 33px;
  height: 33px;
  background: ${dashBorderColor};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${fadedBlack};
  color: ${fadedBlack};
  position: relative;
  margin-right: ${props => (props.isSidebarCollapsed ? 0 : "1em")};
  .fa-heart {
    position: absolute;
    bottom: 0px;
    color: ${redHeart};
    right: 0px;
    &:before {
      font-size: 10px;
    }
  }
`;

const FixedSidebar = styled.div`
  position: fixed;
  left: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 1002;
  cursor: ${props => (props.isCollapsed ? "pointer" : "initial")};
  .scrollbar-container {
    max-height: 100vh;
    > * {
      pointer-events: ${props => (props.isCollapsed ? "none" : "all")};
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
  @media print {
    display: none;
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
  flex-wrap: wrap;
  justify-content: space-between;
  flex-direction: column;
  padding: 6px 0px 10px;
  min-height: calc(100% - 100px);

  @media (max-width: ${tabletWidth}) {
    min-height: 100%;
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
        path {
          stroke: ${props => props.theme.sideMenu.menuSelectedItemLinkColor};
        }
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
  display: ${props => (props.visible ? "flex" : "none !important")};
  align-items: center;
  margin-top: 16px;
`;

const UserName = styled.div`
  font-size: ${props => props.theme.sideMenu.userInfoNameFontSize};
  color: ${props => props.theme.sideMenu.userInfoNameTextColor};
  text-transform: capitalize;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 80px;
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
    background-color: ${props => props.theme.sideMenu.userInfoButtonBgColor};
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
      color: ${props => props.theme.sideMenu.dropdownIconColor};
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
