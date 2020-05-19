import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import ReactOutsideEvent from "react-outside-event";
import {
  white,
  tabletWidth,
  themeColor,
  extraDesktopWidth,
  mediumDesktopExactWidth,
  extraDesktopWidthMax,
  greyThemeLighter
} from "@edulastic/colors";
import { get, cloneDeep } from "lodash";
import { withRouter, Link } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { connect } from "react-redux";
import { Layout, Menu as AntMenu, Row, Col, Dropdown, Icon as AntIcon, message } from "antd";
import styled, { css } from "styled-components";
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
  IconPlaylist2,
  IconSettings,
  IconSubscriptionHighlight,
  IconProfileHighlight,
  IconSignoutHighlight,
  IconInterface,
  IconSwitchUser
} from "@edulastic/icons";
import { withWindowSizes } from "@edulastic/common";
import { roleuser } from "@edulastic/constants";
import { getLastPlayListSelector } from "../../Playlist/ducks";
import { logoutAction } from "../actions/auth";
import { toggleSideBarAction } from "../actions/toggleMenu";
import { getUserFeatures } from "../../../student/Login/ducks";
import { isOrganizationDistrictSelector, getAccountSwitchDetails } from "../selectors/user";
import SwitchUserModal from "../../../common/components/SwtichUserModal/SwitchUserModal";
import { switchUser } from "../../authUtils";

const menuItems = [
  {
    label: "Dashboard",
    icon: IconClockDashboard,
    allowedPathPattern: [/author\/dashboard/, /publisher\/dashboard/],
    path: "author/dashboard"
  },
  {
    label: "Assignments",
    icon: IconAssignment,
    allowedPathPattern: [
      /author\/assignments/,
      /author\/classboard/,
      /author\/expressgrader/,
      /author\/standardsBasedReport/
    ],
    path: "author/assignments",
    customSelection: true,
    condtition: "showCancelButton"
  },
  {
    label: "Gradebook",
    icon: IconInterface,
    allowedPathPattern: [/author\/gradebook/],
    path: "author/gradebook"
  },
  {
    label: "Skill Report",
    icon: IconBarChart,
    allowedPathPattern: [/author\/reports/],
    path: "author/reports"
  },
  {
    label: "library",
    divider: true
  },
  {
    label: "Item Bank",
    icon: IconItemLibrary,
    allowedPathPattern: [/author\/items/],
    path: "author/items"
  },
  {
    label: "Test Library",
    icon: IconTestBank,
    allowedPathPattern: [/author\/tests/],
    path: "author/tests"
  },
  {
    label: "PlayList Library",
    icon: IconPlaylist2,
    allowedPathPattern: [/author\/playlists/],
    path: "author/playlists"
  },
  {
    label: "user management",
    divider: true
  },
  {
    label: "Manage Class",
    icon: IconManage,
    allowedPathPattern: [/author\/manageClass/],
    path: "author/manageClass",
    role: ["teacher"]
  },
  {
    label: "Manage District",
    icon: IconSettings,
    path: "author/districtprofile",
    allowedPathPattern: [/districtprofile/],
    role: ["edulastic-admin", "district-admin"]
  },
  {
    label: "Manage School",
    icon: IconSettings,
    path: "author/schoolprofile",
    allowedPathPattern: [/schools/],
    role: ["school-admin"]
  }
];

const libraryItems = ["library", "Item Bank", "Test Library", "PlayList Library"];

class SideMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      isVisible: false
    };

    this.sideMenuRef = React.createRef();
  }

  get MenuItems() {
    const { lastPlayList, features, isOrganizationDistrict, userRole } = this.props;

    let _menuItems = cloneDeep(menuItems);
    if (isOrganizationDistrict) {
      _menuItems = _menuItems.map(i => (i.label === "Manage District" ? { ...i, label: "Organization" } : i));
    }
    if (features.isCurator) {
      _menuItems = _menuItems.map(i => (i.label === "Dashboard" ? { ...i, path: "publisher/dashboard" } : i));
      _menuItems = _menuItems.filter(i => ["Dashboard", ...libraryItems].includes(i.label));
    }
    if (features.isPublisherAuthor) {
      _menuItems = _menuItems.filter(i => libraryItems.includes(i.label));
    }

    // if (features.isCurator || features.isPublisherAuthor) {
    //   _menuItems[0].path = "publisher/dashboard";
    //   const [item1, , , item4, item5, item6] = _menuItems;
    //   _menuItems = [item1, item4, item5, item6];
    // }
    // if (features.isPublisherAuthor) {
    //   const [, ...rest] = _menuItems;
    //   _menuItems = [...rest];
    // }

    if (userRole === roleuser.EDULASTIC_CURATOR) {
      _menuItems = _menuItems.filter(i => libraryItems.includes(i.label));
    }

    if (!lastPlayList || !lastPlayList.value) return _menuItems;

    const [item1, ...rest] = _menuItems;
    const { _id = "" } = lastPlayList.value || {};
    const myPlayListItem = {
      label: "My Playlist",
      icon: IconPlaylist,
      allowedPathPattern: [
        /playlists\/playlist\/.{24}\/use-this/,
        /playlists\/insights\/.{24}\/use-this/,
        /playlists\/differentiation\/.{24}\/use-this/,
        /playlists\/assignments\/.{24}\/.{24}/,
        /playlists\/assignments\/.{24}\/.{24}\/.{24}/
      ],
      path: `author/playlists/playlist/${_id}/use-this`
    };
    if (item1.divider) {
      return [myPlayListItem, ..._menuItems];
    }
    return [item1, myPlayListItem, ...rest];
  }

  renderIcon = (icon, isSidebarCollapsed) => styled(icon)`
    width: 18px;
    height: 22px;
    fill: rgb(67, 75, 93);
    margin-right: ${() => (isSidebarCollapsed ? "0rem" : "1.5rem")};

    .ant-menu-item-active > & {
      fill: rgb(67, 75, 93);
    }
    .ant-menu-item-selected > & {
      fill: ${white};
    }
  `;

  handleMenu = item => {
    if (item.key) {
      const { history } = this.props;
      const { path } = this.MenuItems[item.key];
      if (path !== undefined) {
        if (path.match(/playlists\/.{24}\/use-this/)) {
          history.push({ pathname: `/${path}`, state: { from: "myPlaylist" } });
        } else {
          history.push(`/${path}`);
        }
      }
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
      document
        .querySelector(".intercom-launcher-frame")
        ?.contentWindow?.document?.querySelector(".intercom-launcher-active")
        ?.click();
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

  componentDidMount() {
    const { userRole, history } = this.props;
    if (userRole === roleuser.STUDENT) {
      message.warn("Redirecting to the student dashboard");
      history.push("/");
    }
  }

  render() {
    const { broken, isVisible, showModal } = this.state;
    const {
      userId,
      switchDetails,
      windowWidth,
      history,
      isSidebarCollapsed,
      firstName,
      middleName,
      lastName,
      userRole,
      className,
      profileThumbnail,
      locationState,
      features
    } = this.props;
    const userName = `${firstName} ${middleName ? `${middleName} ` : ``} ${lastName || ``}`;

    const isCollapsed = isSidebarCollapsed;
    const isMobile = windowWidth <= parseFloat(tabletWidth);
    const defaultSelectedMenu = this.MenuItems.findIndex(menuItem => {
      if (menuItem.customSelection && menuItem.condtition && locationState?.[menuItem.condtition]) {
        return true;
      }
      return (
        menuItem &&
        !menuItem.divider &&
        menuItem.allowedPathPattern.some(path => !!history.location.pathname.match(path))
      );
    });

    const isPublisher = features.isCurator || features.isPublisherAuthor;

    let _userRole = null;
    if (userRole === roleuser.TEACHER) {
      _userRole = "Teacher";
    } else if (userRole === roleuser.SCHOOL_ADMIN) {
      _userRole = "School-Admin";
    } else if (userRole === roleuser.DISTRICT_ADMIN) {
      _userRole = "District-Admin";
    } else if (userRole === roleuser.STUDENT) {
      _userRole = "Student";
    } else if (userRole === roleuser.EDULASTIC_CURATOR) {
      _userRole = "Edulastic Curator";
    } else {
      _userRole = "Unknown";
    }

    if (features.isCurator) {
      _userRole = "Content Editor";
    } else if (features.isPublisherAuthor) {
      _userRole = "Author";
    }

    const footerDropdownMenu = (
      <FooterDropDown data-cy="footer-dropdown" isVisible={isVisible} isCollapsed={isCollapsed}>
        <Menu onClick={this.onClickFooterDropDownMenu}>
          <Menu.Item key="1" className="removeSelectedBorder">
            <Link to="/author/profile">
              <IconProfileHighlight /> {isCollapsed ? "" : "My Profile"}
            </Link>
          </Menu.Item>
          {!isPublisher && (
            <Menu.Item key="1" className="removeSelectedBorder">
              <Link to="/author/subscription">
                <IconSubscriptionHighlight /> {isCollapsed ? "" : "Subscription"}
              </Link>
            </Menu.Item>
          )}
          <Menu.Item key="2" className="removeSelectedBorder">
            {get(switchDetails, "otherAccounts", []).length ? (
              <a>
                <IconSwitchUser /> {isCollapsed ? "" : "Switch Account"}
              </a>
            ) : (
              <Link to={`/?addAccount=true&userId=${userId}`} target="_blank">
                <IconSwitchUser /> {isCollapsed ? "" : "Add Account"}
              </Link>
            )}
          </Menu.Item>
          <Menu.Item data-cy="signout" key="0" className="removeSelectedBorder">
            <a>
              <IconSignoutHighlight /> {isCollapsed ? "" : "Sign Out"}
            </a>
          </Menu.Item>
        </Menu>
      </FooterDropDown>
    );

    return (
      <FixedSidebar
        className={`${!isCollapsed ? "full" : ""} ${className}`}
        onClick={isCollapsed && !isMobile ? this.toggleMenu : null}
        isCollapsed={isCollapsed}
        ref={this.sideMenuRef}
      >
        <SwitchUserModal
          userId={userId}
          switchUser={switchUser}
          showModal={showModal}
          closeModal={() => this.setState({ showModal: false })}
          otherAccounts={get(switchDetails, "otherAccounts", [])}
          personId={get(switchDetails, "personId")}
        />
        <SideBar
          collapsed={isCollapsed}
          collapsible
          breakpoint="md"
          onBreakpoint={brokenStatus => this.setState({ broken: brokenStatus })}
          width="220"
          collapsedWidth={broken ? "0" : "70"}
          className="sideBarwrapper"
        >
          <ToggleSidemenu
            onClick={e => {
              e.stopPropagation();
              this.toggleMenu();
            }}
          >
            <AntIcon type={isCollapsed ? "right" : "left"} />
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
                  {isCollapsed ? <LogoCompact /> : <Logo />}
                </Col>
              </LogoWrapper>
            )}
            <MenuWrapper>
              {locationState?.fadeSidebar && <Overlay />}
              <Menu
                selectedKeys={[defaultSelectedMenu.toString()]}
                mode="inline"
                onClick={item => this.handleMenu(item)}
              >
                {this.MenuItems.map((menu, index) => {
                  if (menu.divider) {
                    return <Divider isCollapsed={isCollapsed}>{!isCollapsed && <span>{menu.label}</span>}</Divider>;
                  }
                  /**
                   * show playlist based on `features` list
                   */
                  if (menu.label === "PlayList Library" && !features.playlist) {
                    return null;
                  }
                  // to hide Dashboard from side menu if a user is DA or SA.
                  if (
                    menu.label === "Dashboard" &&
                    ["district-admin", "school-admin"].includes(userRole) &&
                    !features.isCurator
                  ) {
                    return null;
                  }
                  // hide Gradebook from side menu based on features list
                  if (menu.label === "Gradebook" && !features.gradebook) {
                    return null;
                  }
                  const MenuIcon = this.renderIcon(menu.icon, isCollapsed, menu.stroke);
                  const isItemVisible = !menu.role || (menu.role && menu.role.includes(userRole));
                  return (
                    <MenuItem
                      data-cy={menu.label}
                      key={index.toString()}
                      onClick={this.toggleMenu}
                      visible={isItemVisible}
                      title={isCollapsed ? menu.label : ""}
                    >
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
                      minWidth: isCollapsed ? "50px" : "220px",
                      maxWidth: isCollapsed ? "50px" : "0px"
                    }}
                    className="footerDropdown"
                    overlay={footerDropdownMenu}
                    trigger={["click"]}
                    placement="topCenter"
                    isVisible={isVisible}
                    onVisibleChange={this.handleVisibleChange}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    <div>
                      {profileThumbnail ? (
                        <UserImg src={profileThumbnail} isCollapsed={isCollapsed} />
                      ) : (
                        <PseudoDiv isCollapsed={isCollapsed}>{this.getInitials()}</PseudoDiv>
                      )}
                      <div style={{ width: "100px" }}>
                        {!isCollapsed && !isMobile && <UserName>{userName || "Anonymous"}</UserName>}
                        {!isCollapsed && !isMobile && <UserType isVisible={isVisible}>{_userRole}</UserType>}
                      </div>

                      {!isCollapsed && !isMobile && (
                        <IconDropdown
                          style={{ fontSize: 15, pointerEvents: "none" }}
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
  middleName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  isSidebarCollapsed: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  className: PropTypes.string,
  lastPlayList: PropTypes.object
};

SideMenu.defaultProps = {
  className: "",
  lastPlayList: {}
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
      userId: get(state.user, "user._id", ""),
      isOrganizationDistrict: isOrganizationDistrictSelector(state),
      lastPlayList: getLastPlayListSelector(state),
      features: getUserFeatures(state),
      profileThumbnail: get(state.user, "user.thumbnail"),
      switchDetails: getAccountSwitchDetails(state),
      locationState: get(state, "router.location.state")
    }),
    { toggleSideBar: toggleSideBarAction, logout: logoutAction }
  )
);

export default enhance(ReactOutsideEvent(SideMenu, ["mousedown"]));

const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  background-color: black;
  opacity: 0.2;
  z-index: 1000;
`;

const FixedSidebar = styled.div`
  position: fixed;
  left: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 1002;
  cursor: ${props => (props.isCollapsed ? "pointer" : "initial")};

  @media (max-width: ${tabletWidth}) {
    z-index: 1000;
    max-width: 220px;
    display: block !important;
    .scrollbar-container {
      padding-top: 25px;
    }
  }
`;
const SideBar = styled(Layout.Sider)`
  height: 100%;
  width: 220px;
  max-width: 220px;
  min-width: 220px;
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
    padding: 0px;
    margin: 0 auto;
    justify-content: center;
    margin-bottom: 15px;
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
  @media print {
    display: none;
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
  flex-wrap: wrap;
  justify-content: space-between;
  flex-direction: column;
  padding: 8px 0px 0px;
  min-height: ${({ theme }) => `calc(100% - ${theme.HeaderHeight.xs}px)`};
  position: relative;
  overflow-x: hidden;
  @media (min-width: ${mediumDesktopExactWidth}) {
    min-height: ${({ theme }) => `calc(100% - ${theme.HeaderHeight.md}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    min-height: ${({ theme }) => `calc(100% - ${theme.HeaderHeight.xl}px)`};
  }
`;

const Menu = styled(AntMenu)`
  background: transparent;
  &:not(.ant-menu-horizontal) {
    .ant-menu-item-selected {
      color: ${white};
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
`;

const UserType = styled.div`
  font-size: 12px;
  color: ${props => (props.isVisible ? white : props.theme.sideMenu.userInfoRoleTextColor)};
  width: 96%;
`;

const FooterDropDown = styled.div`
  position: relative;
  opacity: ${props => (props.isVisible ? "1" : "0")};
  transition: 0.2s;
  -webkit-transition: 0.2s;
  ul {
    overflow: hidden;
    max-width: 100%;
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
        margin-bottom: 0 !important;
        padding: 5px 16px;
        height: 50px;
        background: ${props => props.theme.sideMenu.userInfoDropdownItemBgColor};
        /* &:hover,
        &:focus {
          background: ${props => props.theme.sideMenu.userInfoDropdownItemBgHoverColor};
        } */
        a {
          color: ${props => props.theme.sideMenu.userInfoDropdownItemTextColor};
          font-size: ${props => props.theme.sideMenu.userInfoDropdownItemFontSize};
          font-weight: 600;
          display: flex;
          align-items: center;
          &:hover,
          &:focus {
            color: ${props => props.theme.sideMenu.userInfoDropdownItemTextHoverColor};
            a {
              color: ${props => props.theme.sideMenu.userInfoDropdownItemTextHoverColor};
            }
            svg,
            svg path {
              fill: ${props => props.theme.sideMenu.userInfoDropdownItemTextHoverColor};
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
  height: 24px;
  font-size: ${props => props.theme.sideMenu.helpButtonFontSize};
  color: ${props => props.theme.sideMenu.helpButtonTextColor};
  margin: ${({ isCollapsed }) => (isCollapsed ? "0px 0px 26px 0px" : "0px 16px 26px 26px")};
  display: flex;
  align-items: center;
  justify-content: ${({ isCollapsed }) => (isCollapsed ? "center" : "")};
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
    color: ${props => props.theme.sideMenu.helpButtonTextHoverColor};
    svg {
      fill: ${props => props.theme.sideMenu.helpIconHoverColor};
    }
  }
  @media (max-width: ${tabletWidth}) {
    width: 50px;
    margin: 0 auto 0 18px;

    &.active {
      opacity: 0;
      pointer-events: none;
    }
  }
`;

const collapsedUserImagStyle = css`
  position: absolute;
  left: 0px;
  margin: 0;
`;

const UserImg = styled.div`
  width: 50px;
  height: 50px;
  background: url(${props => props.src});
  background-position: center center;
  background-size: cover;
  border-radius: 50%;
  margin: 10px 10px 15px 20px;
  ${({ isCollapsed }) => isCollapsed && collapsedUserImagStyle}
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
  }

  .ant-dropdown {
    left: 0px !important;
    top: unset !important;
    bottom: 80px !important;
  }

  .footerDropdown {
    width: 100%;
    height: 80px;
    background-color: ${({ theme, isCollapsed, isVisible }) =>
      isCollapsed ? "" : isVisible ? theme.sideMenu.userInfoButtonBgHoverColor : theme.sideMenu.userInfoButtonBgColor};
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
    width: 50px;
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
      width: 50px;
      margin: 0;
    }
  }
`;

const PseudoDiv = styled.div`
  width: 50px;
  height: 50px;
  margin: 10px 10px 15px 20px;
  border-radius: 50%;
  background: #dddddd;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  font-size: 22px;
  font-weight: bold;
  line-height: 50px;
  text-align: center;
  text-transform: uppercase;
  ${({ isCollapsed }) => isCollapsed && collapsedUserImagStyle}
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
  margin-right: 28px;
  position: ${({ isCollapsed }) => (isCollapsed ? "absolute" : "relative")};

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
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
  color: ${props => props.theme.sideMenu.dropdownIconColor};
`;

const LabelMenuItem = styled.span`
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Divider = styled.div`
  text-transform: uppercase;
  max-width: 100%;
  font-weight: 600;
  letter-spacing: 0.1px;
  margin: ${({ isCollapsed }) => (isCollapsed ? "30px 14px" : "32px 0px 16px 24px")};
  color: ${({ theme }) => theme.sideMenu.sidebarDividerColor};
  font-size: ${({ theme }) => theme.sideMenu.userInfoNameFontSize};
  ${({ isCollapsed, theme }) =>
    isCollapsed &&
    `
    border: 1px solid ${theme.sideMenu.sidebarDividerColor}; 
    opacity: 0.2; 
  `}
`;
