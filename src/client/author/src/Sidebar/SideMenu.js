import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import ReactOutsideEvent from 'react-outside-event'
import {
  white,
  tabletWidth,
  themeColor,
  extraDesktopWidth,
  extraDesktopWidthMax,
  greyThemeLighter,
  smallDesktopWidth,
  mobileWidthLarge,
  themeColorBlue,
} from '@edulastic/colors'
import { get, cloneDeep, some } from 'lodash'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Layout,
  Menu as AntMenu,
  Row,
  Dropdown,
  Icon as AntIcon,
  Popover,
  Popconfirm,
  Tooltip,
} from 'antd'
import styled from 'styled-components'
import {
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
  IconSwitchUser,
  IconUsers,
  IconExclamationMark,
  IconCircleCheck,
  IconClose,
  IconDemoAccNav,
  IconCloudUpload
} from '@edulastic/icons'
import { withWindowSizes, OnDarkBgLogo } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { helpCenterUrl } from '@edulastic/constants/const/common'
import { segmentApi } from '@edulastic/api'
import { getLastPlayListSelector } from '../../Playlist/ducks'
import { logoutAction } from '../actions/auth'
import { toggleSideBarAction } from '../actions/toggleMenu'
import {
  getUserFeatures,
  isProxyUser as isProxyUserSelector,
  toggleAdminAlertModalAction,
  toggleVerifyEmailModalAction,
  getEmailVerified,
  getVerificationTS,
  isDefaultDASelector,
  setIsUserSignedUpUsingUsernameAndPassword,
  isSignupUsingUNAndPassSelector,
  isDemoPlaygroundUser,
  setIsUserOnProfilePageAction,
} from '../../../student/Login/ducks'
import {
  isOrganizationDistrictSelector,
  getAccountSwitchDetails,
  isFreeAdminSelector,
  isSAWithoutSchoolsSelector,
  getUserOrgId,
  isSuperAdminSelector,
} from '../selectors/user'
import SwitchUserModal from '../../../common/components/SwtichUserModal/SwitchUserModal'
import { switchUser, proxyDemoPlaygroundUser } from '../../authUtils'
import ItemBankTrialUsedModal from '../../Dashboard/components/Showcase/components/Myclasses/components/FeaturedContentBundle/ItemBankTrialUsedModal'
import PurchaseFlowModals from '../components/common/PurchaseModals'
import { slice } from '../../Subscription/ducks'

const menuItems = [
  {
    label: 'Data Warehouse',
    icon: IconCloudUpload,
    allowedPathPattern: [/author\/data-warehouse/],
    path: 'author/data-warehouse',
  },
  {
    label: 'Dashboard',
    icon: IconClockDashboard,
    allowedPathPattern: [/author\/dashboard/, /publisher\/dashboard/],
    path: 'author/dashboard',
  },
  {
    label: 'Assignments',
    icon: IconAssignment,
    allowedPathPattern: [
      /author\/assignments/,
      /author\/classboard/,
      /author\/expressgrader/,
      /author\/standardsBasedReport/,
    ],
    path: 'author/assignments',
    customSelection: true,
    condtition: 'showCancelButton',
  },
  {
    label: 'Gradebook',
    icon: IconInterface,
    allowedPathPattern: [/author\/gradebook/],
    path: 'author/gradebook',
  },
  {
    label: 'Insights',
    icon: IconBarChart,
    allowedPathPattern: [/author\/reports/],
    path: 'author/reports',
  },
  {
    label: 'library',
    divider: true,
  },
  {
    label: 'Item Bank',
    icon: IconItemLibrary,
    allowedPathPattern: [/author\/items/],
    path: 'author/items',
  },
  {
    label: 'Test',
    icon: IconTestBank,
    allowedPathPattern: [/author\/tests/],
    path: 'author/tests',
  },
  {
    label: 'Playlist',
    icon: IconPlaylist2,
    allowedPathPattern: [/author\/playlists/],
    path: 'author/playlists',
  },
  {
    label: 'user management',
    divider: true,
    allowSuperAdmin: true,
  },
  {
    label: 'Manage Class',
    icon: IconManage,
    allowedPathPattern: [/author\/manageClass/],
    path: 'author/manageClass',
    role: ['teacher'],
  },
  {
    label: 'Manage District',
    icon: IconSettings,
    path: 'author/districtprofile',
    allowedPathPattern: [/districtprofile/],
    role: ['edulastic-admin', 'district-admin'],
    allowSuperAdmin: true,
  },
  {
    label: 'Manage School',
    icon: IconSettings,
    path: 'author/schoolprofile',
    allowedPathPattern: [/schools/],
    role: ['school-admin'],
    allowSuperAdmin: true,
  },
]

const libraryItems = ['library', 'Item Bank', 'Test', 'Playlist']

// Only "My Playlist" and assignment screens are visible in mobile
const allowedPathInMobile = ['assignments', 'playlists/playlist']
export const isDisablePageInMobile = (path) => {
  const isMobileSize = window.innerWidth <= parseInt(mobileWidthLarge, 10)
  const isAllowedPath = some(allowedPathInMobile, (p) => path.includes(p))
  return isMobileSize && !isAllowedPath
}

class SideMenu extends Component {
  constructor(props) {
    super(props)

    const { switchDetails } = this.props

    this.state = {
      showModal: false,
      isVisible: false,
      isSwitchAccountNotification:
        !localStorage.getItem('isMultipleAccountNotificationShown') &&
        !!get(switchDetails, 'otherAccounts', []).length,
      showTrialUsedModal: false,
      showPurchaseModal: false,
      showTrialSubsConfirmation: false,
    }

    this.sideMenuRef = React.createRef()
  }

  componentDidMount() {
    this.props.fetchUserSubscriptionStatus()
  }

  get MenuItems() {
    const {
      lastPlayList,
      features,
      isOrganizationDistrict,
      userRole,
      isSidebarCollapsed,
      isSuperAdmin,
    } = this.props

    let _menuItems = cloneDeep(menuItems)

    if (features.isDataOpsOnlyUser) {
      return menuItems.filter((i) => i.label === 'Data Warehouse')
    }
    _menuItems = _menuItems.filter((i) => i.label !== 'Data Warehouse')

    if (isOrganizationDistrict) {
      _menuItems = _menuItems.map((i) =>
        i.label === 'Manage District' ? { ...i, label: 'Organization' } : i
      )
    }
    // Normal SA and DA
    if (
      !isSuperAdmin &&
      (userRole === roleuser.DISTRICT_ADMIN ||
        userRole === roleuser.SCHOOL_ADMIN)
    ) {
      _menuItems = _menuItems.filter((item) => item.allowSuperAdmin !== true)
    }
    if (features.isCurator) {
      _menuItems = _menuItems.map((i) =>
        i.label === 'Dashboard' ? { ...i, path: 'publisher/dashboard' } : i
      )
      _menuItems = _menuItems.filter((i) =>
        ['Dashboard', ...libraryItems].includes(i.label)
      )
    }
    if (features.isPublisherAuthor) {
      _menuItems = _menuItems.filter((i) => libraryItems.includes(i.label))
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
      _menuItems = _menuItems.filter((i) => libraryItems.includes(i.label))
    }
    const conditionalMenuItems = []
    if (userRole === roleuser.TEACHER && features.showCollaborationGroups) {
      conditionalMenuItems.push({
        label: 'Collaboration Groups',
        icon: () => (
          // TODO: replace this terrible icon with better one
          <IconUsers
            width="30px"
            height="22px"
            style={{
              marginRight: !isSidebarCollapsed && '20px',
              marginTop: '5px',
              marginLeft: '-4px',
            }}
          />
        ),
        path: 'author/collaborations',
        allowedPathPattern: [
          /author\/collaborations/,
          /author\/collaborations\/.{24}/,
        ],
        role: ['teacher'],
      })
    }

    if (!lastPlayList || !lastPlayList.value)
      return [..._menuItems, ...conditionalMenuItems]

    const [item1, ...rest] = _menuItems
    const { _id = '' } = lastPlayList.value || {}
    const myPlayListItem = {
      label: 'My Playlist',
      icon: IconPlaylist,
      allowedPathPattern: [
        /playlists\/playlist\/.{24}\/use-this/,
        /playlists\/insights\/.{24}\/use-this/,
        /playlists\/differentiation\/.{24}\/use-this/,
        /playlists\/assignments\/.{24}\/.{24}/,
        /playlists\/assignments\/.{24}\/.{24}\/.{24}/,
      ],
      path: `author/playlists/playlist/${_id}/use-this`,
    }
    if (item1.divider) {
      return [myPlayListItem, ..._menuItems, ...conditionalMenuItems]
    }
    return [item1, myPlayListItem, ...rest, ...conditionalMenuItems]
  }

  renderIcon = (icon, isSidebarCollapsed) => styled(icon)`
    width: 18px;
    height: 22px;
    fill: rgb(67, 75, 93);
    margin-right: ${() => (isSidebarCollapsed ? '0rem' : '1.5rem')};

    .ant-menu-item-active > & {
      fill: rgb(67, 75, 93);
    }
    .ant-menu-item-selected > & {
      fill: ${white};
    }
  `

  handleBlockedClick = () => {
    this.setState({
      showTrialUsedModal: true,
    })
  }

  handleMenu = (item) => {
    if (item.key) {
      const {
        history,
        isFreeAdmin,
        isSAWithoutSchools,
        toggleAdminAlertModal,
        toggleVerifyEmailModal,
        emailVerified,
        verificationTS,
        isDefaultDA,
      } = this.props
      const { path, label } = this.MenuItems[item.key]
      segmentApi.genericEventTrack('mainMenuClick', { label, path })
      if (
        (['Assignments', 'Insights', 'Manage School'].includes(label) &&
          isSAWithoutSchools) ||
        (label === 'Assignments' && isFreeAdmin)
      ) {
        return toggleAdminAlertModal()
      }
      if (
        ['Assignments', 'Insights'].includes(label) &&
        !emailVerified &&
        verificationTS &&
        !isDefaultDA
      ) {
        const existingVerificationTS = new Date(verificationTS)
        const expiryDate = new Date(
          existingVerificationTS.setDate(existingVerificationTS.getDate() + 14)
        ).getTime()
        if (expiryDate < Date.now()) {
          return toggleVerifyEmailModal(true)
        }
      }
      if (label === 'My Playlist' && !this.props.features.premium) {
        return this.handleBlockedClick()
      }
      if (path !== undefined) {
        if (path.match(/playlists\/.{24}\/use-this/)) {
          history.push({ pathname: `/${path}`, state: { from: 'myPlaylist' } })
        } else {
          history.push(`/${path}`)
        }
      }
    }
  }

  handlePlayGround = (evt) => {
    evt.stopPropagation()
    const elementClasses = evt.currentTarget.getAttribute('class')
    proxyDemoPlaygroundUser(elementClasses.indexOf('automation') > -1)
  }

  toggleMenu = () => {
    const { toggleSideBar } = this.props
    toggleSideBar()
  }

  handleVisibleChange = (flag) => {
    this.setState({ isVisible: flag })
  }

  toggleDropdown = () => {
    this.setState((prevState) => ({ isVisible: !prevState.isVisible }))
  }

  onClickFooterDropDownMenu = ({ key }) => {
    const { logout } = this.props
    if (key === '0') {
      // onClickLogout
      this.toggleMenu()
      logout()
    } else if (key === '1') {
      // onClickLogoutProfile
      this.toggleDropdown()
      this.toggleMenu()
    }
    if (key === '3') {
      this.setState({ showModal: true })
    }
  }

  onOutsideEvent = (event) => {
    const { isSidebarCollapsed } = this.props

    if (event.type === 'mousedown' && !isSidebarCollapsed) {
      this.toggleMenu()
      this.setState({ isVisible: false })
    }
  }

  setShowSubscriptionAddonModal = (value) => {
    this.setState({
      showPurchaseModal: value,
    })
  }

  setShowTrialSubsConfirmation = (value) => {
    this.setState({
      showTrialSubsConfirmation: value,
    })
  }

  handleCloseModal = () => {
    this.setState({
      showTrialUsedModal: false,
    })
  }

  handlePurchaseFlow = () => {
    this.setState({
      showTrialUsedModal: false,
      showPurchaseModal: true,
    })
  }

  handleShowVerifyModal = () => {
    const { toggleVerifyEmailModal, setIsUserOnProfilePage } = this.props
    // set the flag variable
    setIsUserOnProfilePage(true)
    toggleVerifyEmailModal(true)
  }

  getInitials = () => {
    const { firstName, lastName } = this.props
    if (firstName && lastName) return `${firstName[0] + lastName[0]}`
    if (firstName) return `${firstName.substr(0, 2)}`
    if (lastName) return `${lastName.substr(0, 2)}`
  }

  handleCancel = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ isSwitchAccountNotification: false })
    localStorage.setItem('isMultipleAccountNotificationShown', 'true')
  }

  render() {
    const { broken, isVisible, showModal } = this.state
    let { isSwitchAccountNotification } = this.state
    // For Now we are hiding the switch account notification (Ref: EV-25373)
    // TODO: Remove hiding notification when implementation of "showing notification only once"
    isSwitchAccountNotification = false

    const {
      user,
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
      features,
      showUseThisNotification,
      isProxyUser,
      isDemoPlaygroundUserProxy,
      orgId,
      emailVerified,
      verificationTS,
      isDefaultDA,
      setSignedUpUsingUsernameAndPassword,
      isSignupUsingUNAndPassSet,
    } = this.props
    if (userRole === roleuser.STUDENT) {
      return null
    }
    const userName = `${firstName} ${middleName ? `${middleName} ` : ``} ${
      lastName || ``
    }`

    const isCollapsed = isSidebarCollapsed
    const isMobile = windowWidth < parseFloat(tabletWidth)
    const defaultSelectedMenu = this.MenuItems.findIndex((menuItem) => {
      if (
        menuItem.customSelection &&
        menuItem.condtition &&
        locationState?.[menuItem.condtition]
      ) {
        return true
      }
      return (
        menuItem &&
        !menuItem.divider &&
        menuItem.allowedPathPattern.some(
          (path) => !!history.location.pathname.match(path)
        )
      )
    })

    const lmsIds = [
      'googleId',
      'atlasId',
      'cleverId',
      'msoId',
      'canvasId',
      'cliId',
      'newselaId',
    ]
    const isSignupUsingUNAndPass = lmsIds.every((lmsId) => !user[lmsId])
    if (isSignupUsingUNAndPass && !isSignupUsingUNAndPassSet) {
      setSignedUpUsingUsernameAndPassword()
    }

    const isPublisher = features.isCurator || features.isPublisherAuthor

    let _userRole = null
    if (userRole === roleuser.TEACHER) {
      _userRole = 'Teacher'
    } else if (userRole === roleuser.SCHOOL_ADMIN) {
      _userRole = 'School-Admin'
    } else if (userRole === roleuser.DISTRICT_ADMIN) {
      _userRole = 'District-Admin'
    } else if (userRole === roleuser.STUDENT) {
      _userRole = 'Student'
    } else if (userRole === roleuser.EDULASTIC_CURATOR) {
      _userRole = 'Edulastic Curator'
    } else {
      _userRole = 'Unknown'
    }

    if (features.isCurator) {
      _userRole = 'Content Editor'
    } else if (features.isPublisherAuthor) {
      _userRole = 'Author'
    }

    const users = get(switchDetails, 'switchAccounts', [])

    const footerDropdownMenu = (isDemoAccount = false) => (
      <FooterDropDown
        data-cy="footer-dropdown"
        isVisible={isVisible}
        isCollapsed={isCollapsed}
      >
        <Menu
          onClick={this.onClickFooterDropDownMenu}
          style={{ height: 'auto' }}
        >
          <Menu.Item
            key="1"
            className="removeSelectedBorder"
            disabled={isDemoAccount}
            title={
              isDemoAccount
                ? 'This feature is not available in demo account.'
                : ''
            }
          >
            <Link to="/author/profile">
              <IconProfileHighlight />{' '}
              <span>{isCollapsed ? '' : 'My Profile'}</span>
            </Link>
          </Menu.Item>
          {!features.isDataOpsOnlyUser && !isPublisher && (
            <Menu.Item
              key="2"
              className="removeSelectedBorder"
              disabled={isDemoAccount}
            >
              <Link to="/author/subscription">
                <IconSubscriptionHighlight />{' '}
                <span data-cy="subscription">
                  {isCollapsed ? '' : 'Subscription'}
                </span>
              </Link>
            </Menu.Item>
          )}
          {!features.isDataOpsOnlyUser && users.length > 1 ? ( // since current user is also in this list
            <Menu.Item
              key="3"
              className="removeSelectedBorder"
              disabled={
                isDemoAccount ||
                (!emailVerified && verificationTS && !isDefaultDA)
              }
              title={
                !emailVerified && verificationTS && !isDefaultDA
                  ? 'Please verify your email address to access this feature.'
                  : ''
              }
            >
              <a>
                <IconSwitchUser />
                <span data-cy="switch-user">
                  {isCollapsed ? '' : 'Switch Account'}{' '}
                </span>
              </a>
            </Menu.Item>
          ) : !features.isDataOpsOnlyUser &&
            userRole !== roleuser.EDULASTIC_CURATOR ? (
            <Menu.Item
              key="4"
              className="removeSelectedBorder"
              disabled={
                isDemoAccount ||
                (!emailVerified && verificationTS && !isDefaultDA)
              }
              title={
                !emailVerified && verificationTS && !isDefaultDA
                  ? 'Please verify your email address to access this feature.'
                  : ''
              }
            >
              <Link to={`/?addAccount=true&userId=${userId}`} target="_blank">
                <IconSwitchUser />{' '}
                <span>{isCollapsed ? '' : 'Add Account'}</span>
              </Link>
            </Menu.Item>
          ) : null}
          <Menu.Item
            data-cy="signout"
            key="0"
            className="removeSelectedBorder"
            disabled={isDemoAccount}
          >
            <a>
              <IconSignoutHighlight />{' '}
              <span>{isCollapsed ? '' : 'Sign Out'}</span>
            </a>
          </Menu.Item>
        </Menu>
      </FooterDropDown>
    )

    return (
      <>
        <PurchaseFlowModals
          fromSideMenu
          showSubscriptionAddonModal={this.state.showPurchaseModal}
          setShowSubscriptionAddonModal={this.setShowSubscriptionAddonModal}
          isConfirmationModalVisible={this.state.showTrialSubsConfirmation}
          setShowTrialSubsConfirmation={this.setShowTrialSubsConfirmation}
          defaultSelectedProductIds={[]}
          setProductData={() => {}}
        />
        {this.state.showTrialUsedModal && (
          <ItemBankTrialUsedModal
            title="Teacher Premium"
            isVisible={this.state.showTrialUsedModal}
            handleCloseModal={this.handleCloseModal}
            handlePurchaseFlow={this.handlePurchaseFlow}
            isCurrentItemBankUsed
          />
        )}
        <FixedSidebar
          className={`${!isCollapsed ? 'full' : ''} ${className}`}
          onClick={isCollapsed && !isMobile ? this.toggleMenu : null}
          isCollapsed={isCollapsed}
          ref={this.sideMenuRef}
        >
          <SwitchUserModal
            userId={userId}
            switchUser={switchUser}
            orgId={orgId}
            showModal={showModal}
            closeModal={() => this.setState({ showModal: false })}
            otherAccounts={users}
            personId={get(switchDetails, 'personId')}
            userRole={userRole}
          />
          <SideBar
            collapsed={isCollapsed}
            collapsible
            breakpoint="md"
            onBreakpoint={(brokenStatus) =>
              this.setState({ broken: brokenStatus })
            }
            width="220"
            collapsedWidth={broken ? '0' : '70'}
            className="sideBarwrapper"
          >
            <ToggleSidemenu
              onClick={(e) => {
                e.stopPropagation()
                this.toggleMenu()
              }}
            >
              <AntIcon type={isCollapsed ? 'right' : 'left'} />
            </ToggleSidemenu>
            <LogoWrapper className="logoWrapper">
              {broken && (
                <AntIcon
                  className="mobileCloseIcon"
                  type="close"
                  theme="outlined"
                  onClick={this.toggleMenu}
                />
              )}
              {isCollapsed ? (
                !isMobile && <LogoCompact />
              ) : (
                <OnDarkBgLogo height={isMobile ? '16px' : '26px'} />
              )}
            </LogoWrapper>
            <MenuWrapper
              onMouseEnter={
                isCollapsed && !isMobile
                  ? () => {
                      this.toggleMenu()
                    }
                  : null
              }
              onMouseLeave={
                !isCollapsed && !isMobile
                  ? () => {
                      this.toggleMenu()
                    }
                  : null
              }
            >
              {locationState?.fadeSidebar && <Overlay />}
              <Menu
                selectedKeys={[defaultSelectedMenu.toString()]}
                mode="inline"
                onClick={(item) => this.handleMenu(item)}
                isBannerShown={isProxyUser || isDemoPlaygroundUserProxy}
              >
                {this.MenuItems.map((menu, index) => {
                  if (menu.divider) {
                    return (
                      <MenuItem
                        divider
                        visible
                        data-cy={menu.label}
                        key={index.toString()}
                      >
                        {!isCollapsed ? <span>{menu.label}</span> : <Hr />}
                      </MenuItem>
                    )
                  }
                  /**
                   * show playlist based on `features` list
                   */
                  if (menu.label === 'Playlist' && !features.playlist) {
                    return null
                  }
                  // to hide Dashboard from side menu if a user is DA or SA.
                  if (
                    menu.label === 'Dashboard' &&
                    ['district-admin', 'school-admin'].includes(userRole) &&
                    !features.isCurator
                  ) {
                    return null
                  }
                  // hide Gradebook from side menu based on features list
                  if (menu.label === 'Gradebook' && !features.gradebook) {
                    return null
                  }
                  const MenuIcon = this.renderIcon(
                    menu.icon,
                    isCollapsed,
                    menu.stroke
                  )
                  const isItemVisible =
                    !menu.role || (menu.role && menu.role.includes(userRole))

                  let disableMenu = isDisablePageInMobile(menu?.path)
                  if (
                    (menu.label === 'Manage School' ||
                      menu.label === 'Manage District') &&
                    isDemoPlaygroundUserProxy
                  ) {
                    disableMenu = true
                  }
                  // hide My Playlist if user is not premium
                  // if (menu.label === 'My Playlist' && !features.premium) {
                  //   toggle = this.handleBlockedClick;
                  // }
                  if (
                    menu.label === 'My Playlist' &&
                    isCollapsed &&
                    showUseThisNotification
                  ) {
                    const content = (
                      <span>
                        &quot;In Use&ldquo; Play lists are available in the
                        &quot;My Playlists&ldquo; area.
                      </span>
                    )
                    return (
                      <MenuItem
                        data-cy={menu.label}
                        key={index.toString()}
                        onClick={this.toggleMenu}
                        visible={isItemVisible}
                        title={isCollapsed ? menu.label : ''}
                      >
                        <Popover
                          visible
                          placement="right"
                          content={content}
                          overlayClassName="antd-notify-custom-popover"
                        >
                          <MenuIcon />
                        </Popover>
                        <LabelMenuItem isCollapsed={isCollapsed}>
                          {menu.label}
                        </LabelMenuItem>
                      </MenuItem>
                    )
                  }
                  let title = isCollapsed ? menu.label : ''
                  if (disableMenu && isDemoPlaygroundUserProxy) {
                    title = 'This feature is not available in demo account.'
                  }
                  return (
                    <MenuItem
                      data-cy={menu.label}
                      key={index.toString()}
                      onClick={this.toggleMenu}
                      visible={isItemVisible}
                      title={title}
                      disabled={disableMenu}
                    >
                      <MenuIcon />
                      <LabelMenuItem isCollapsed={isCollapsed}>
                        {menu.label}
                      </LabelMenuItem>
                    </MenuItem>
                  )
                })}
              </Menu>
              <MenuFooter>
                {!isDemoPlaygroundUserProxy &&
                  !features.isDataOpsOnlyUser &&
                  ['district-admin', 'school-admin', 'teacher'].indexOf(
                    userRole
                  ) > -1 && (
                    <DemoPlaygroundButtonContainer isCollapsed={isCollapsed}>
                      <DemoPlaygroundButton
                        data-cy="demo-palyground-item"
                        onClick={this.handlePlayGround}
                        title={isCollapsed ? 'Demo Playground' : ''}
                      >
                        <IconContainer className={isCollapsed ? 'active' : ''}>
                          <IconDemoAccNav />
                        </IconContainer>
                        <LabelMenuItem isCollapsed={isCollapsed}>
                          Demo Playground
                        </LabelMenuItem>
                      </DemoPlaygroundButton>
                    </DemoPlaygroundButtonContainer>
                  )}
                <QuestionButton isCollapsed={isCollapsed}>
                  <a
                    href={helpCenterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: isCollapsed && 'center',
                    }}
                  >
                    <IconContainer className={isCollapsed ? 'active' : ''}>
                      <HelpIcon />
                    </IconContainer>
                    <HelpText isCollapsed={isCollapsed}>Help Center</HelpText>
                  </a>
                </QuestionButton>
                <UserInfoButton
                  isVisible={isVisible}
                  isCollapsed={isCollapsed}
                  className={`userinfoBtn ${isCollapsed ? 'active' : ''}`}
                >
                  <Dropdown
                    onClick={this.toggleDropdown}
                    overlayStyle={{
                      position: 'fixed',
                      minWidth: isCollapsed ? '70px' : '220px',
                      maxWidth: isCollapsed ? '70px' : '0px',
                    }}
                    className="footerDropdown"
                    overlay={footerDropdownMenu(isDemoPlaygroundUserProxy)}
                    trigger={['click']}
                    placement="topCenter"
                    isVisible={isVisible}
                    onVisibleChange={this.handleVisibleChange}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    <div>
                      {profileThumbnail ? (
                        <UserImg
                          src={profileThumbnail}
                          isCollapsed={isCollapsed}
                        />
                      ) : (
                        <PopConfirmWrapper isCollapsed={isCollapsed}>
                          <Popconfirm
                            icon={<IconExclamationMark />}
                            placement="bottomRight"
                            cancelText={
                              <CloseIconWrapper>
                                <IconClose />
                              </CloseIconWrapper>
                            }
                            onCancel={this.handleCancel}
                            title={
                              <p>
                                You can switch between your teacher and student
                                accounts here.
                              </p>
                            }
                            trigger="click"
                            getPopupContainer={(el) => el.parentNode}
                            visible={isSwitchAccountNotification}
                          >
                            <PseudoDiv isCollapsed={isCollapsed}>
                              {this.getInitials()}
                            </PseudoDiv>
                          </Popconfirm>
                        </PopConfirmWrapper>
                      )}
                      <div
                        style={{
                          width: '100px',
                          display: !isCollapsed ? 'block' : 'none',
                        }}
                      >
                        <UserName>{userName || 'Anonymous'}</UserName>
                        <UserType isVisible={isVisible}>{_userRole}</UserType>
                      </div>

                      {!isCollapsed && (
                        <IconDropdown
                          style={{ fontSize: 15, pointerEvents: 'none' }}
                          className="drop-caret"
                          type={isVisible ? 'caret-up' : 'caret-down'}
                        />
                      )}
                    </div>
                  </Dropdown>
                  <IconContainerDiv
                    isCollapsed={isCollapsed}
                    onClick={() =>
                      !emailVerified &&
                      (verificationTS || isSignupUsingUNAndPass) &&
                      !isDefaultDA
                        ? this.handleShowVerifyModal()
                        : null
                    }
                  >
                    {emailVerified ? (
                      <Tooltip title="Verified">
                        <CheckCircleIcon />
                      </Tooltip>
                    ) : null}
                    {!emailVerified &&
                    (verificationTS || isSignupUsingUNAndPass) &&
                    !isDefaultDA ? (
                      <Tooltip title="Not Verified">
                        <ExclamationIcon />
                      </Tooltip>
                    ) : null}
                  </IconContainerDiv>
                </UserInfoButton>
              </MenuFooter>
            </MenuWrapper>
          </SideBar>
        </FixedSidebar>
      </>
    )
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
  features: PropTypes.object,
  className: PropTypes.string,
  lastPlayList: PropTypes.object,
}

SideMenu.defaultProps = {
  className: '',
  lastPlayList: {},
  features: {},
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  connect(
    (state) => ({
      isSidebarCollapsed: state.authorUi.isSidebarCollapsed,
      firstName: get(state.user, 'user.firstName', ''),
      middleName: get(state.user, 'user.middleName', ''),
      lastName: get(state.user, 'user.lastName', ''),
      userRole: get(state.user, 'user.role', ''),
      userId: get(state.user, 'user._id', ''),
      user: get(state.user, 'user', null),
      emailVerified: getEmailVerified(state),
      verificationTS: getVerificationTS(state),
      isDefaultDA: isDefaultDASelector(state),
      isSignupUsingUNAndPassSet: isSignupUsingUNAndPassSelector(state),
      isOrganizationDistrict: isOrganizationDistrictSelector(state),
      lastPlayList: getLastPlayListSelector(state),
      orgId: getUserOrgId(state),
      features: getUserFeatures(state),
      profileThumbnail: get(state.user, 'user.thumbnail'),
      switchDetails: getAccountSwitchDetails(state),
      isProxyUser: isProxyUserSelector(state),
      locationState: get(state, 'router.location.state'),
      showUseThisNotification: get(
        state,
        'curriculumSequence.showUseThisNotification',
        false
      ),
      isFreeAdmin: isFreeAdminSelector(state),
      isSAWithoutSchools: isSAWithoutSchoolsSelector(state),
      isDemoPlaygroundUserProxy: isDemoPlaygroundUser(state),
      isSuperAdmin: isSuperAdminSelector(state),
    }),
    {
      toggleSideBar: toggleSideBarAction,
      logout: logoutAction,
      toggleAdminAlertModal: toggleAdminAlertModalAction,
      toggleVerifyEmailModal: toggleVerifyEmailModalAction,
      setSignedUpUsingUsernameAndPassword: setIsUserSignedUpUsingUsernameAndPassword,
      setIsUserOnProfilePage: setIsUserOnProfilePageAction,
      fetchUserSubscriptionStatus: slice?.actions?.fetchUserSubscriptionStatus,
    }
  )
)

export const SideMenuComp = SideMenu
export default enhance(ReactOutsideEvent(SideMenu, ['mousedown']))

const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  background-color: black;
  opacity: 0.2;
  z-index: 1000;
`

const FixedSidebar = styled.div`
  position: fixed;
  left: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 1002;
  cursor: ${(props) => (props.isCollapsed ? 'pointer' : 'initial')};

  @media (max-width: ${tabletWidth}) {
    z-index: 1000;
    max-width: 220px;
    display: block !important;
    .scrollbar-container {
      padding-top: 25px;
    }
  }
`
const SideBar = styled(Layout.Sider)`
  height: 100%;
  width: 220px;
  max-width: 220px;
  min-width: 220px;
  background-color: #2f4151;
  z-index: 22;
  padding-bottom: 0;

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
  @media (max-width: ${mobileWidthLarge}) {
    &.ant-layout-sider-collapsed {
      min-width: 0px !important;
      max-width: 0px !important;
    }

    .mobileCloseIcon {
      margin-right: 24px;
      svg {
        width: 20px !important;
        height: 20px !important;
        fill: #c2c6cb;
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
`

const LogoWrapper = styled(Row)`
  height: ${({ theme }) => theme.HeaderHeight.xl}px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 25px;

  @media (max-width: ${extraDesktopWidthMax}) {
    height: ${({ theme }) => theme.HeaderHeight.md}px;
  }
  @media (max-width: ${smallDesktopWidth}) {
    height: ${({ theme }) => theme.HeaderHeight.sd}px;
  }
  @media (max-width: ${mobileWidthLarge}) {
    height: ${({ theme }) => theme.HeaderHeight.xs}px;
  }
`

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

  @media (max-width: ${mobileWidthLarge}) {
    display: none;
  }
`

const MenuWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  flex-direction: column;
  padding: 0;
  position: relative;
  overflow: hidden;
  min-height: ${({ theme }) => `calc(100% - ${theme.HeaderHeight.xl}px)`};

  @media (max-height: 720px) {
    padding: 2px 0px 0px;
  }

  @media (max-width: ${extraDesktopWidthMax}) {
    min-height: ${({ theme }) => `calc(100% - ${theme.HeaderHeight.md}px)`};
  }
  @media (max-width: ${smallDesktopWidth}) {
    min-height: ${({ theme }) => `calc(100% - ${theme.HeaderHeight.sd}px)`};
  }
  @media (max-width: ${mobileWidthLarge}) {
    min-height: ${({ theme }) => `calc(100% - ${theme.HeaderHeight.xs}px)`};
  }
`

const Menu = styled(AntMenu)`
  background: transparent;
  overflow: auto;
  height: ${({ isBannerShown }) =>
    isBannerShown ? 'calc(100vh - 270px)' : 'calc(100vh - 235px)'};
  &:not(.ant-menu-horizontal) {
    .ant-menu-item-selected {
      color: ${white};
      background-color: transparent;

      svg {
        fill: ${(props) => props.theme.sideMenu.menuSelectedItemLinkColor};
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
    margin: 0 0 8px;
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
    margin: 0 0 8px;
    padding: 0px 10px !important;
    height: 38px;
    width: 100%;
  }
  @media (max-height: 780px) {
    &.ant-menu-inline-collapsed > .ant-menu-item,
    &.ant-menu-inline .ant-menu-item {
      margin: 0px 0px 6px;
    }
  }
  @media (max-height: 730px) {
    &.ant-menu-inline-collapsed > .ant-menu-item,
    &.ant-menu-inline .ant-menu-item {
      height: 34px;
      margin: 0px 0px 4px;
    }
  }
  @media (max-height: 680px) {
    &.ant-menu-inline-collapsed > .ant-menu-item,
    &.ant-menu-inline .ant-menu-item {
      height: 32px;
      &:before {
        left: 15px;
        right: 15px;
      }
      &[data-cy='library'],
      &[data-cy='user management'] {
        height: 20px;
        font-size: 12px;
      }
    }
  }
  @media (min-width: ${extraDesktopWidth}) {
    &.ant-menu-inline-collapsed > .ant-menu-item,
    &.ant-menu-inline .ant-menu-item {
      margin: 0 0 10px;
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
  .ant-menu-item:not(.ant-menu-item-selected) {
    svg {
      position: relative;
      z-index: 5;
      fill: ${(props) => props.theme.sideMenu.menuItemLinkColor};
    }
    &:hover {
      svg {
        fill: ${(props) => props.theme.sideMenu.menuItemLinkHoverColor};
      }
      color: ${(props) => props.theme.sideMenu.menuItemLinkHoverColor};
    }
  }

  @media (max-height: 780px) {
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
  @media (max-height: 720px) {
    height: ${({ isBannerShown }) =>
      isBannerShown ? 'calc(100vh - 250px)' : 'calc(100vh - 225px)'};
  }
  @media (max-height: 650px) {
    height: ${({ isBannerShown }) =>
      isBannerShown ? 'calc(100vh - 205px)' : 'calc(100vh - 185px)'};
  }
  @media (max-height: 600px) {
    height: ${({ isBannerShown }) =>
      isBannerShown ? 'calc(100vh - 165px)' : 'calc(100vh - 135px)'};
  }
`

const MenuItem = styled(AntMenu.Item)`
  font-family: Open Sans;
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: 0.3px;
  text-align: left;
  color: ${(props) =>
    props.divider
      ? props.theme.sideMenu.sidebarDividerColor
      : props.theme.sideMenu.menuItemLinkColor};
  display: ${(props) => (props.visible ? 'flex' : 'none !important')};
  align-items: center;
  margin-top: 16px;
  text-transform: ${({ divider }) => divider && 'uppercase'};
  &.ant-menu-item-disabled,
  &.ant-menu-submenu-disabled {
    color: rgba(121, 143, 163, 0.3) !important;
    & svg {
      fill: rgba(121, 143, 163, 0.3) !important;
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
    .ant-menu-item:not(.ant-menu-item-selected) svg {
      fill: ${(props) => props.theme.sideMenu.userInfoDropdownItemTextColor};
      &:hover,
      &:focus {
        fill: ${(props) =>
          props.theme.sideMenu.userInfoDropdownItemTextHoverColor};
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
          padding-left: 10px;
          &:focus,
          &:hover {
            svg,
            svg path {
              fill: ${(props) =>
                props.theme.sideMenu.userInfoDropdownItemTextHoverColor};
            }
          }
          &:focus {
            color: ${(props) =>
              props.theme.sideMenu.userInfoDropdownItemTextHoverColor};
            a {
              color: ${(props) =>
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
        span:hover {
          color: ${white};
        }
      }
    }
  }
`

const MenuFooter = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
`

const HelpText = styled.span`
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: ${({ isCollapsed }) => (isCollapsed ? 'none' : 'block')};
`

const QuestionButton = styled.div`
  margin: 0 0 6px;
  display: flex;
  position: relative;
  overflow: hidden;
  align-items: center;
  padding: ${({ isCollapsed }) => (isCollapsed ? '4px 0px' : '5px 25px')};
  justify-content: ${({ isCollapsed }) =>
    isCollapsed ? 'center' : 'flex-start'};
  font-size: ${(props) => props.theme.sideMenu.helpButtonFontSize};
  color: ${(props) => props.theme.sideMenu.helpButtonTextColor};
  cursor: pointer;

  svg {
    fill: ${(props) => props.theme.sideMenu.helpIconColor};
  }
  span {
    font-weight: 600;
  }
  &:hover {
    color: ${(props) => props.theme.sideMenu.helpButtonTextHoverColor};
    svg {
      fill: ${(props) => props.theme.sideMenu.helpIconHoverColor};
    }
  }

  @media (max-height: 720px) {
    margin: 4px 0px;
  }
  @media (max-height: 650px) {
    display: none;
  }
`

const UserImg = styled.div`
  width: ${({ isCollapsed }) => (isCollapsed ? '45px' : '50px')};
  height: ${({ isCollapsed }) => (isCollapsed ? '45px' : '50px')};
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
    width: ${({ isCollapsed }) => (isCollapsed ? '45px' : '50px')};
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
    @media (max-width: ${mobileWidthLarge}) {
      bottom: 75px !important;
    }
    @media (max-height: 720px) {
      bottom: 70px !important;
    }
  }

  .footerDropdown {
    width: 100%;
    height: ${({ isCollapsed }) => (isCollapsed ? '70px' : '80px')};
    padding: ${({ isCollapsed }) => (isCollapsed ? '10px 0px' : '15px 0px')};
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
    @media (max-height: 720px) {
      height: ${({ isCollapsed }) => (isCollapsed ? '60px' : '70px')};
      padding: ${({ isCollapsed }) => (isCollapsed ? '7px 0px' : '10px 0px')};
    }
  }
  .ant-select-selection {
    background: transparent;
    border: 0px;
    color: ${white};
  }

  @media (max-width: ${mobileWidthLarge}) {
    &.active {
      opacity: 0;
      pointer-events: none;
      background: transparent;
    }
  }
`

const PseudoDiv = styled.div`
  width: ${({ isCollapsed }) => (isCollapsed ? '45px' : '50px')};
  height: ${({ isCollapsed }) => (isCollapsed ? '45px' : '50px')};
  line-height: ${({ isCollapsed }) => (isCollapsed ? '45px' : '50px')};
  border-radius: 50%;
  background: #dddddd;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  margin: ${({ isCollapsed }) => (isCollapsed ? '0px auto' : '0px 15px')};
`

const LogoCompact = styled(IconLogoCompact)`
  width: 22px;
  height: 25px;
  fill: #0eb08d;
  &:hover {
    fill: #0eb08d;
  }
`

const IconContainer = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
  position: ${({ isCollapsed }) => (isCollapsed ? 'absolute' : 'relative')};

  &.active {
    margin-right: 0;
    box-shadow: none;
  }
`

const HelpIcon = styled(IconQuestion)`
  fill: #1fe3a1;
  width: auto;
  height: 22px;
`
const IconContainerDiv = styled.div`
  position: absolute;
  top: ${({ isCollapsed }) => (isCollapsed ? '5px' : '8px')};
  left: ${({ isCollapsed }) => (isCollapsed ? '30px' : '50px')};
`
const CheckCircleIcon = styled(IconCircleCheck)`
  width: auto;
  height: 16px;
  margin-left: -10px;
`
const ExclamationIcon = styled(IconExclamationMark)`
  width: auto;
  height: 16px;
`

const IconDropdown = styled(AntIcon)`
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
  color: ${(props) => props.theme.sideMenu.dropdownIconColor};
`

const LabelMenuItem = styled.span`
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: ${({ isCollapsed }) => (isCollapsed ? 'none' : 'block')};
`

const Hr = styled.div`
  border: ${({ theme }) => `1px solid ${theme.sideMenu.sidebarDividerColor}`};
  opacity: 0.2;
  width: 80%;
`
const PopConfirmWrapper = styled.div`
  .ant-popover.ant-popover-placement-bottomRight {
    position: fixed;
    top: auto !important;
    bottom: 30px;
    left: ${({ isCollapsed }) => (isCollapsed ? '80px' : '230px')} !important;
  }

  .ant-popover-buttons {
    .ant-btn {
      background: none !important;
      border: none !important;
      position: absolute;
      right: 2px;
      top: 2px;
    }
    .ant-btn-primary {
      display: none;
    }
  }

  .ant-popover-arrow {
    display: block !important;
    position: fixed;
    top: auto !important;
    bottom: 40px;
    left: ${({ isCollapsed }) => (isCollapsed ? '77px' : '227px')} !important;
    width: 15px;
    height: 15px;
    transform: rotate(-45deg);
  }

  .ant-popover-message {
    padding: 4px 0px;

    svg {
      float: left;
      margin-top: 6px;
      transform: scale(1.4);

      path:first-child {
        fill: ${themeColorBlue};
      }
    }
  }

  .ant-popover-message-title {
    color: white;
    width: 315px;
    padding-left: 30px;
    font-weight: 600;
    font-size: 16px;
  }

  .ant-popover-inner {
    background: #2f4151;
  }

  .ant-popover-placement-bottom > .ant-popover-content > .ant-popover-arrow,
  .ant-popover-placement-bottomLeft > .ant-popover-content > .ant-popover-arrow,
  .ant-popover-placement-bottomRight
    > .ant-popover-content
    > .ant-popover-arrow {
    border-top-color: #2f4151;
    border-left-color: #2f4151;
  }
`
const CloseIconWrapper = styled.div`
  margin-top: -6px;
  float: right;

  &:hover {
    cursor: pointer;
  }

  svg {
    float: left;
    margin-top: 6px;
    transform: scale(0.6) !important;

    path:first-child {
      fill: ${white} !important;
    }
  }
`

const DemoPlaygroundButtonContainer = styled.div`
  margin: 0 0 6px;
  display: flex;
  position: relative;
  overflow: hidden;
  align-items: center;
  padding: ${({ isCollapsed }) => (isCollapsed ? '5px 0px' : '5px 25px')};
  justify-content: ${({ isCollapsed }) =>
    isCollapsed ? 'center' : 'flex-start'};
  font-size: ${(props) => props.theme.sideMenu.helpButtonFontSize};
  cursor: pointer;
  span {
    font-weight: 600;
  }
  @media (max-height: 720px) {
    margin: 5px 0px;
  }
  @media (max-height: 600px) {
    display: none;
  }
`

const DemoPlaygroundButton = styled.div`
  display: inline-flex;
  color: #7c93a7;
  &:hover {
    svg path {
      fill: ${themeColor};
    }
    span {
      color: ${themeColor};
    }
  }
`
