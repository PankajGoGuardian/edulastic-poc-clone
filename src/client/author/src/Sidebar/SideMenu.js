import { mobileWidthLarge, tabletWidth, white } from '@edulastic/colors'
import {
  EduElse,
  EduIf,
  EduThen,
  OnDarkBgLogo,
  withWindowSizes,
} from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { helpCenterUrl } from '@edulastic/constants/const/common'
import {
  IconAssignment,
  IconBarChart,
  IconClockDashboard,
  IconClose,
  IconCloudUpload,
  IconDataStudio,
  IconDemoAccNav,
  IconExclamationMark,
  IconInterface,
  IconItemLibrary,
  IconManage,
  IconPlaylist,
  IconPlaylist2,
  IconProfileHighlight,
  IconSettings,
  IconSignoutHighlight,
  IconSubscriptionHighlight,
  IconSwitchUser,
  IconTestBank,
  IconUsers,
} from '@edulastic/icons'
import { Icon as AntIcon, Dropdown, Popconfirm, Popover, Tooltip } from 'antd'
import { cloneDeep, every, get, some } from 'lodash'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactOutsideEvent from 'react-outside-event'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'redux'
import styled from 'styled-components'
import { getTokens } from '@edulastic/api/src/utils/Storage'
import { AssessPeardeckLabelOnDarkBgLogo } from '@edulastic/common/src/components/EduLogo'
import SwitchUserModal from '../../../common/components/SwtichUserModal/SwitchUserModal'
import {
  getEmailVerified,
  getUserFeatures,
  getVerificationTS,
  isDefaultDASelector,
  isDemoPlaygroundUser,
  isProxyUser as isProxyUserSelector,
  isSignupUsingUNAndPassSelector,
  setIsUserOnProfilePageAction,
  setIsUserSignedUpUsingUsernameAndPassword,
  toggleAdminAlertModalAction,
  toggleVerifyEmailModalAction,
} from '../../../student/Login/ducks'
import ItemBankTrialUsedModal from '../../Dashboard/components/Showcase/components/Myclasses/components/FeaturedContentBundle/ItemBankTrialUsedModal'
import { getLastPlayListSelector } from '../../Playlist/ducks'
import { slice } from '../../Subscription/ducks'
import { proxyDemoPlaygroundUser, switchUser } from '../../authUtils'
import { logoutAction } from '../actions/auth'
import { toggleSideBarAction } from '../actions/toggleMenu'
import PurchaseFlowModals from '../components/common/PurchaseModals'
import {
  getAccountSwitchDetails,
  getPearTokenSelector,
  getUserOrgId,
  isFreeAdminSelector,
  isOrganizationDistrictSelector,
  isSAWithoutSchoolsSelector,
  isSuperAdminSelector,
} from '../selectors/user'
import {
  CheckCircleIcon,
  CloseIconWrapper,
  DemoPlaygroundButton,
  DemoPlaygroundButtonContainer,
  ExclamationIcon,
  FixedSidebar,
  FooterDropDown,
  HelpIcon,
  HelpText,
  Hr,
  IconContainer,
  IconContainerDiv,
  IconDropdown,
  LabelMenuItem,
  LogoCompact,
  LogoWrapper,
  Menu,
  MenuFooter,
  MenuItem,
  MenuWrapper,
  Overlay,
  PopConfirmWrapper,
  PseudoDiv,
  QuestionButton,
  SideBar,
  ToggleSidemenu,
  UserImg,
  UserInfoButton,
  UserName,
  UserType,
} from './styledComponents'
import { navigationItemLabels, navigationState } from '../constants/navigation'
import { DATA_STUDIO_DISABLED_DISTRICTS } from '../constants/others'
import { isPearDomain } from '../../../../utils/pear'
import { AssessPeardeckLogoCompact } from '../../../admin/Common/StyledComponents'

const dataStudioPattern = [
  /\/author\/reports\/dashboard-report/,
  /\/author\/reports\/multiple-assessment-report-dw/,
  /\/author\/reports\/whole-learner-report\/student/,
  /\/author\/reports\/attendance-summary/,
  /\/author\/reports\/goals-and-interventions/,
  /\/author\/reports\/early-warning-report/,
  /\/author\/reports\/efficacy-report/,
]

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
    disallowedPathPattern: [
      /author\/reports\/data-warehouse-reports/,
      ...dataStudioPattern,
    ],
    path: 'author/reports',
  },
  {
    label: navigationItemLabels.DATA_STUDIO,
    icon: IconDataStudio,
    allowedPathPattern: [
      /author\/reports\/data-warehouse-reports/,
      ...dataStudioPattern,
    ],
    path: 'author/reports/data-warehouse-reports',
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
    const { fetchUserSubscriptionStatus } = this.props
    fetchUserSubscriptionStatus()
  }

  get MenuItems() {
    const {
      lastPlayList,
      features,
      isOrganizationDistrict,
      orgId,
      userRole,
      isSidebarCollapsed,
      isSuperAdmin,
    } = this.props

    const {
      isDataOpsOnlyUser,
      isCurator,
      isPublisherAuthor,
      showCollaborationGroups,
      isInsightsOnlyUser,
    } = features

    let _menuItems = cloneDeep(menuItems)
    if (isInsightsOnlyUser) {
      return menuItems.filter((i) => i.label === 'Insights')
    }

    if (isDataOpsOnlyUser) {
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
    if (isCurator) {
      _menuItems = _menuItems.map((i) =>
        i.label === 'Dashboard' ? { ...i, path: 'publisher/dashboard' } : i
      )
      _menuItems = _menuItems.filter((i) =>
        ['Dashboard', ...libraryItems].includes(i.label)
      )
    }
    if (isPublisherAuthor) {
      _menuItems = _menuItems.filter((i) => libraryItems.includes(i.label))
    }

    // if (isCurator || isPublisherAuthor) {
    //   _menuItems[0].path = "publisher/dashboard";
    //   const [item1, , , item4, item5, item6] = _menuItems;
    //   _menuItems = [item1, item4, item5, item6];
    // }
    // if (isPublisherAuthor) {
    //   const [, ...rest] = _menuItems;
    //   _menuItems = [...rest];
    // }

    if (!features.dataWarehouseReports) {
      const dataStudioMenuItemIdx = _menuItems.findIndex(
        (item) => item.label === navigationItemLabels.DATA_STUDIO
      )
      if (_menuItems[dataStudioMenuItemIdx]) {
        _menuItems[dataStudioMenuItemIdx].allowedPathPattern.push(
          /author\/subscription/
        )
        _menuItems[dataStudioMenuItemIdx].path = 'author/subscription'
      }
    }

    if (
      DATA_STUDIO_DISABLED_DISTRICTS.some((districtId) => districtId === orgId)
    ) {
      _menuItems = _menuItems.filter(
        (item) => item.label !== navigationItemLabels.DATA_STUDIO
      )
    }

    if (userRole === roleuser.EDULASTIC_CURATOR) {
      _menuItems = _menuItems.filter((i) => libraryItems.includes(i.label))
    }
    const conditionalMenuItems = []
    if (userRole === roleuser.TEACHER && showCollaborationGroups) {
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
    const { features } = this.props
    const { premium } = features
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
      if (label === 'My Playlist' && !premium) {
        return this.handleBlockedClick()
      }
      if (path !== undefined) {
        if (path.match(/playlists\/.{24}\/use-this/)) {
          history.push({ pathname: `/${path}`, state: { from: 'myPlaylist' } })
        } else if (path.match(/author\/subscription/)) {
          history.push({
            pathname: `/${path}`,
            state: { view: navigationState.SUBSCRIPTION.view.DATA_STUDIO },
          })
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
    const {
      broken,
      isVisible,
      showModal,
      showPurchaseModal,
      showTrialSubsConfirmation,
      showTrialUsedModal,
    } = this.state
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
      pearToken,
    } = this.props
    const {
      isCurator,
      isPublisherAuthor,
      isDataOpsOnlyUser,
      isInsightsOnlyUser,
      playlist,
      gradebook,
    } = features
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
      const matchedAllowedPathPattern = menuItem.allowedPathPattern?.some(
        (path) => !!history.location.pathname.match(path)
      )

      const matchedDisallowed = menuItem.disallowedPathPattern?.some(
        (path) => !!history.location.pathname.match(path)
      )

      return (
        menuItem &&
        !menuItem.divider &&
        matchedAllowedPathPattern &&
        !matchedDisallowed
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

    const isPublisher = isCurator || isPublisherAuthor

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

    if (isCurator) {
      _userRole = 'Content Editor'
    } else if (isPublisherAuthor) {
      _userRole = 'Author'
    }

    const users = get(switchDetails, 'switchAccounts', [])

    const showSubscriptionOption = every(
      [!isDataOpsOnlyUser, !isPublisher, !isInsightsOnlyUser],
      Boolean
    )

    const showDemoPlayground =
      every(
        [!isDemoPlaygroundUserProxy, !isDataOpsOnlyUser, !isInsightsOnlyUser],
        Boolean
      ) && ['district-admin', 'school-admin', 'teacher'].includes(userRole)

    const tokens = getTokens()

    const isEA = tokens.find((token) =>
      token.includes(roleuser.EDULASTIC_ADMIN)
    )

    const isProxyUserAndNotEA = isProxyUser && !isEA

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
          {/* antd menu not able to identify elements wrapped with edu-if which messes up the styles */}
          {showSubscriptionOption && (
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
          {!isDataOpsOnlyUser && users.length > 1 ? ( // since current user is also in this list
            <Menu.Item
              key="3"
              className="removeSelectedBorder"
              disabled={
                isDemoAccount ||
                (!emailVerified && verificationTS && !isDefaultDA) ||
                isProxyUserAndNotEA
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
          ) : !isDataOpsOnlyUser && userRole !== roleuser.EDULASTIC_CURATOR ? (
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

    const showExclamation =
      !emailVerified &&
      (verificationTS || isSignupUsingUNAndPass) &&
      !isDefaultDA

    return (
      <>
        <PurchaseFlowModals
          fromSideMenu
          showSubscriptionAddonModal={showPurchaseModal}
          setShowSubscriptionAddonModal={this.setShowSubscriptionAddonModal}
          isConfirmationModalVisible={showTrialSubsConfirmation}
          setShowTrialSubsConfirmation={this.setShowTrialSubsConfirmation}
          defaultSelectedProductIds={[]}
          setProductData={() => {}}
        />
        <EduIf condition={showTrialUsedModal}>
          <ItemBankTrialUsedModal
            title="Teacher Premium"
            isVisible={showTrialUsedModal}
            handleCloseModal={this.handleCloseModal}
            handlePurchaseFlow={this.handlePurchaseFlow}
            isCurrentItemBankUsed
          />
        </EduIf>
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
            <LogoWrapper
              className="logoWrapper"
              onMouseEnter={
                isPearDomain && isCollapsed && !isMobile
                  ? () => {
                      this.toggleMenu()
                    }
                  : null
              }
              onMouseLeave={
                isPearDomain && !isCollapsed && !isMobile
                  ? () => {
                      this.toggleMenu()
                    }
                  : null
              }
            >
              <EduIf condition={broken}>
                <AntIcon
                  className="mobileCloseIcon"
                  type="close"
                  theme="outlined"
                  onClick={this.toggleMenu}
                />
              </EduIf>
              {isCollapsed ? (
                !isMobile &&
                (isPearDomain ? <AssessPeardeckLogoCompact /> : <LogoCompact />)
              ) : (
                <>
                  <EduIf condition={isPearDomain && pearToken}>
                    <PSILauncherStyled>
                      <div id="psi_launcher" />
                    </PSILauncherStyled>
                  </EduIf>
                  {isPearDomain ? (
                    <AssessPeardeckLabelOnDarkBgLogo
                      style={{ marginTop: '4px' }}
                      height={isMobile ? '16px' : '36px'}
                    />
                  ) : (
                    <OnDarkBgLogo height={isMobile ? '16px' : '26px'} />
                  )}
                </>
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
                  if (menu.label === 'Playlist' && !playlist) {
                    return null
                  }
                  // to hide Dashboard from side menu if a user is DA or SA.
                  if (
                    menu.label === 'Dashboard' &&
                    ['district-admin', 'school-admin'].includes(userRole) &&
                    !isCurator
                  ) {
                    return null
                  }
                  // hide Gradebook from side menu based on features list
                  if (menu.label === 'Gradebook' && !gradebook) {
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
                <EduIf condition={showDemoPlayground}>
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
                </EduIf>
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
                      <EduIf condition={profileThumbnail}>
                        <EduThen>
                          <UserImg
                            src={profileThumbnail}
                            isCollapsed={isCollapsed}
                          />
                        </EduThen>
                        <EduElse>
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
                                  You can switch between your teacher and
                                  student accounts here.
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
                        </EduElse>
                      </EduIf>
                      <div
                        style={{
                          width: '100px',
                          display: !isCollapsed ? 'block' : 'none',
                        }}
                      >
                        <UserName>{userName || 'Anonymous'}</UserName>
                        <UserType isVisible={isVisible}>{_userRole}</UserType>
                      </div>
                      <EduIf condition={!isCollapsed}>
                        <IconDropdown
                          style={{ fontSize: 15, pointerEvents: 'none' }}
                          className="drop-caret"
                          type={isVisible ? 'caret-up' : 'caret-down'}
                        />
                      </EduIf>
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
                    <EduIf condition={emailVerified}>
                      <Tooltip title="Verified">
                        <CheckCircleIcon />
                      </Tooltip>
                    </EduIf>
                    <EduIf condition={showExclamation}>
                      <Tooltip title="Not Verified">
                        <ExclamationIcon />
                      </Tooltip>
                    </EduIf>
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

const PSILauncherStyled = styled.div`
  margin-left: -3px;
  #psi_launcher {
    transform: scale(1.35);
    &.active,
    &:hover {
      transform: none;
    }
  }
`

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
      pearToken: getPearTokenSelector(state),
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
