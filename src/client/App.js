import React, { Component, lazy, Suspense, useEffect } from 'react'
import { capitalize, get, isEmpty, isUndefined } from 'lodash'
import qs from 'qs'
import { ThemeProvider } from 'styled-components'
import queryString from 'query-string'
import loadable from '@loadable/component'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Spin } from 'antd'
import Joyride from 'react-joyride'
import * as firebase from 'firebase/app'
import { roleuser, signUpState, test } from '@edulastic/constants'
import { DragDrop, notification, OfflineNotifier } from '@edulastic/common'
import { TokenStorage } from '@edulastic/api'
import { themes } from './theme'
import { Banner } from './common/components/Banner'
import { TestAttemptReview } from './student/TestAttemptReview'
import SebQuitConfirm from './student/SebQuitConfirm'
import {
  getUserNameSelector,
  getUserOrgId,
  shouldWatchCollectionUpdates,
} from './author/src/selectors/user'
import {
  fetchUserAction,
  isProxyUser as isProxyUserSelector,
  isDemoPlaygroundUser,
} from './student/Login/ducks'
import TestDemoPlayer from './author/TestDemoPlayer'
import TestItemDemoPlayer from './author/TestItemDemoPlayer'
import { getWordsInURLPathName } from './common/utils/helpers'
import LoggedOutRoute from './common/components/loggedOutRoute'
import PrivateRoute from './common/components/privateRoute'
import V1Redirect from './author/V1Redirect'
import Kid from './kid/app'
import NotificationListener from './HangoutVideoCallNotification'
import BulkActionNotificationListener from './author/AssignmentAdvanced/components/BulkAssignmentActionNotification'
import ClassSyncNotification from './author/Classes/components/ClassSyncNotification'
import ReportsNotificationListener from './author/Reports/components/ReportsNotificationListener'
import BubbleScanNotificationsListener from './scanScore/BubbleScanNotificationsListener'
import AppUpdate from './common/components/AppUpdate'
import { logoutAction } from './author/src/actions/auth'
import RealTimeCollectionWatch from './RealTimeCollectionWatch'
import SsoAuth from '../ssoAuth'
import FreeAdminAlertModal from './common/components/FreeAdminAlertModal'
import StudentSessionExpiredModal from './common/components/StudentSessionExpiredModal'
import CalendlyScheduleModal from './author/Subscription/components/SubscriptionMain/CalendlyScheduleModal'
import {
  getRequestOrSubmitSuccessVisibility,
  getRequestQuoteVisibility,
  slice as subscriptionSlice,
} from './author/Subscription/ducks'
import AdminNotificationListener from './admin/Components/AdminNotification'

const { ASSESSMENT, PRACTICE, TESTLET } = test.type
// route wise splitting
const AssessmentPlayer = lazy(() =>
  import(
    /* webpackChunkName: "assessmentPlayer" */
    './assessment/index'
  )
)
const TeacherSignup = lazy(() =>
  import(
    /* webpackChunkName: "teacherSignup" */ './student/Signup/components/TeacherContainer/Container'
  )
)
const Auth = lazy(() => import(/* webpackChunkName: "auth" */ './Auth'))
const Invite = lazy(() =>
  import(/* webpackChunkName: "auth" */ './Invite/index')
)
const GetStarted = lazy(() =>
  import(
    /* webpackChunkName: "getStarted" */ './student/Signup/components/GetStartedContainer'
  )
)
const StudentSignup = lazy(() =>
  import(
    /* webpackChunkName: "studentSignup" */ './student/Signup/components/StudentContainer'
  )
)
const AdminSignup = lazy(() =>
  import(
    /* webpackChunkName: "adminSignup" */ './student/Signup/components/AdminContainer/Container'
  )
)
const Dashboard = lazy(() =>
  import(/* webpackChunkName: "student" */ './student/app')
)
const Author = lazy(() =>
  import(/* webpackChunkName: "author" */ './author/src/app')
)
const Publisher = lazy(() =>
  import(/* webpackChunkName: "author" */ './publisher/app')
)
const Admin = lazy(() =>
  import(/* webpackChunkName: "admloadablein" */ './admin/app')
)
const ScanScore = lazy(() =>
  import(/* webpackChunkName: "scanScore" */ './scanScore/app')
)
const RedirectToTest = lazy(() =>
  import(/* webpackChunkName: "RedirecToTest" */ './author/RedirectToTest')
)
const DistrictRoutes = lazy(() => import('./districtRoutes/index'))
const ResetPassword = lazy(() => import('./resetPassword/index'))
const SetParentPassword = lazy(() => import('./SetParentPassword'))
const CLIAccessBanner = lazy(() =>
  import('./author/Dashboard/components/CLIAccessBanner')
)
const PublicTest = lazy(() => import('./publicTest/container'))

const AssignmentEmbedLink = lazy(() =>
  import('./assignmentEmbedLink/container')
)
const AudioTagPlayer = lazy(() => import('./AudioTagPlayer'))

const RequestQuoteModal = loadable(() =>
  import('./author/Subscription/components/RequestQuoteModal')
)

const InvoiceSuccessModal = loadable(() =>
  import('./author/Subscription/components/InvoiceSuccessModal')
)

const Loading = () => (
  <div>
    <Spin />
  </div>
)

const query = queryString.parse(window.location.search)
if (query.token && query.userId && query.role) {
  TokenStorage.storeAccessToken(query.token, query.userId, query.role)
  TokenStorage.selectAccessToken(query.userId, query.role)
  if (query.firebaseToken) {
    firebase.auth().signInWithCustomToken(query.firebaseToken)
  }
} else if (query.userId && query.role) {
  TokenStorage.selectAccessToken(query.userId, query.role)
}

if (query?.itemBank?.toUpperCase() === 'CANVAS') {
  sessionStorage.setItem('signupFlow', 'canvas')
}

// Capture forwarded referrer from edulastic.com
if (
  query &&
  query.referrer &&
  !window.localStorage.getItem('originalreferrer')
) {
  window.localStorage.setItem('originalreferrer', query.referrer)
}

/**
 *  In case of redirection from canvas we might get errorDescription as query param which
 *  we have to display as error message and remove it from the url.
 */
const { search, pathname } = window.location
if (search) {
  const { errorDescription, ...rest } = qs.parse(search, {
    ignoreQueryPrefix: true,
  })
  if (errorDescription) {
    let errorMessage =
      errorDescription === 'assignment_is_marked_as_absent'
        ? 'You have been marked ABSENT. Please contact your teacher.'
        : errorDescription.split('_').join(' ')
    errorMessage = `${errorMessage[0].toUpperCase()}${errorMessage.substr(
      1,
      errorMessage.length
    )}`
    sessionStorage.setItem('errorMessage', errorMessage)
    if (!pathname.split('/').includes('login')) {
      if (isEmpty(rest)) {
        window.location.href = window.location.href.split('?')[0]
      } else {
        window.location.href = `${
          window.location.href.split('?')[0]
        }?${qs.stringify(rest)}`
      }
    }
  }
}

const testRedirectRoutes = [
  '/demo/assessmentPreview',
  '/d/ap',
  '/d/cp',
  '#renderResource/close/',
  '/#assessmentQuestions/close/',
]

function isLocationInTestRedirectRoutes(loc) {
  return testRedirectRoutes.find(
    (x) =>
      loc.pathname.includes(x) ||
      `${loc.pathname}${loc.search}${loc.hash}`.includes(x)
  )
}

function CheckRoutePatternsEffectContainer({ role, location, history }) {
  useEffect(() => {
    if (
      role === 'student' &&
      location.pathname.startsWith('/author') &&
      !location.pathname.startsWith('/author/tests/tab')
    ) {
      history.push(
        location.pathname.replace('author', 'home') || '/home/assignments'
      )
    } else if (
      role !== 'student' &&
      role !== 'parent' &&
      location.pathname.startsWith('/home')
    ) {
      history.push(
        location.pathname.replace('home', 'author') || '/author/assignments'
      )
    }
  }, [])
  return null
}

class App extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    tutorial: PropTypes.object,
    location: PropTypes.object.isRequired,
    fetchUser: PropTypes.func.isRequired,
  }

  static defaultProps = {
    tutorial: null,
  }

  state = {
    showAppUpdate: false,
    canShowCliBanner: true,
    showSelectStates: false,
  }

  componentDidMount() {
    const { fetchUser, location } = this.props
    const publicPath = location.pathname.split('/').includes('public')
    const ssoPath = location.pathname.split('/').includes('auth')
    const partnerPath = location.pathname.split('/').includes('partnerLogin')
    const isV1Redirect =
      location.pathname.includes('/fwd') ||
      isLocationInTestRedirectRoutes(location)
    const kidPath = location.pathname.includes('/kid')
    if (!publicPath && !ssoPath && !partnerPath && !isV1Redirect && !kidPath) {
      fetchUser({ addAccount: query.addAccount, userId: query.userId })
    } else if (
      publicPath &&
      (location.pathname.split('/').includes('view-test') ||
        isLocationInTestRedirectRoutes(location)) &&
      TokenStorage.getAccessToken()
    ) {
      fetchUser()
    }
    window.addEventListener('request-client-update', () => {
      this.setState({
        showAppUpdate: true,
      })
    })
  }

  setShowSelectStates = (value) => {
    this.setState({ showSelectStates: value })
  }

  closeRequestQuoteModal = () => {
    const { setRequestQuoteModal } = this.props
    setRequestQuoteModal(false)
  }

  closeRequestOrSubmitSuccessModal = () => {
    const { toggleRequestOrSubmitSuccessModal } = this.props
    toggleRequestOrSubmitSuccessModal(false)
  }

  render() {
    const cliBannerVisible = sessionStorage.cliBannerVisible || false
    /**
     * NOTE:  this logic would be called multiple times, even after redirect
     */
    const {
      user,
      tutorial,
      location,
      history,
      fullName,
      logout,
      isProxyUser,
      shouldWatch,
      isDemoAccountProxy = false,
      isRequestQuoteModalVisible,
      setRequestQuoteModal,
      isRequestOrSubmitSuccessModalVisible,
      districtId,
    } = this.props
    if (
      location.hash.includes('#renderResource/close/') ||
      location.hash.includes('#assessmentQuestions/close/')
    ) {
      const v1Id = location.hash.split('/')[2]
      history.push(`/d/ap?eAId=${v1Id}`)
      return <Loading />
    }

    const publicPath =
      location.pathname.split('/').includes('public') ||
      location.pathname.includes('/fwd') ||
      isLocationInTestRedirectRoutes(location) ||
      location.pathname.includes('/kid')

    if (
      !publicPath &&
      user.authenticating &&
      TokenStorage.getAccessToken() &&
      !location.pathname.includes('/auth/') &&
      !sessionStorage.getItem('addAccountDetails')
    ) {
      return <Loading />
    }

    const features = user?.user?.features || {}
    let defaultRoute = ''
    let redirectRoute = ''
    const isPremium = get(user, ['user', 'features', 'premium'])
    if (!publicPath) {
      const path = getWordsInURLPathName(location.pathname)
      const urlSearch = new URLSearchParams(location.search)
      if (user && user.isAuthenticated) {
        // copy old assignments filter if user is not demo playground user
        if (!isDemoAccountProxy) {
          const oldAssignmentFilter =
            sessionStorage.getItem('filters[Assignments]') ||
            sessionStorage.getItem(`assignments_filter_${user.user._id}`)
          if (!isEmpty(oldAssignmentFilter)) {
            sessionStorage.setItem(
              `assignments_filter_${user.user._id}_${districtId}`,
              oldAssignmentFilter
            )
            // remove old filter key from session storage
            sessionStorage.removeItem('filters[Assignments]')
            sessionStorage.removeItem(`assignments_filter_${user.user._id}`)
          }
        }
        // Clear referrer once userId available
        if (
          user &&
          (user.userId || user.user?._id) &&
          window.localStorage.getItem('originalreferrer')
        ) {
          window.localStorage.removeItem('originalreferrer')
        }
        const role = get(user, ['user', 'role'])
        const thirdPartyOAuth = localStorage.getItem('thirdPartyOAuth')
        const thirdPartyOAuthRedirectUrl = localStorage.getItem(
          'thirdPartyOAuthRedirectUrl'
        )
        if (thirdPartyOAuth === 'wordpress' && thirdPartyOAuthRedirectUrl) {
          const contentId = localStorage.getItem('wpCId')
          const action = localStorage.getItem('wpAction')
          // redirect user to redirect url with first name and last name and role
          return (
            <SsoAuth
              user={user}
              location={location}
              redirectUrl={thirdPartyOAuthRedirectUrl}
              contentId={contentId}
              action={action}
            />
          )
        }
        if (location.pathname.toLocaleLowerCase().includes('/sso-auth')) {
          const { redirectUrl = '', cId = '', action = '' } = qs.parse(
            location.search,
            {
              ignoreQueryPrefix: true,
            }
          )
          if (redirectUrl) {
            return (
              <SsoAuth
                user={user}
                location={location}
                redirectUrl={redirectUrl}
                contentId={cId}
                action={action}
              />
            )
          }
        }
        localStorage.removeItem('thirdPartyOAuth')
        localStorage.removeItem('thirdPartyOAuthRedirectUrl')
        localStorage.removeItem('wpCId')
        localStorage.removeItem('wpAction')
        if (role === 'teacher') {
          if (user?.user?.isPlayground) {
            defaultRoute = '/author/assignments'
          } else if (
            user.signupStatus === signUpState.ACCESS_WITHOUT_SCHOOL ||
            user.signupStatus === signUpState.DONE ||
            isUndefined(user.signupStatus)
          ) {
            if (features.isPublisherAuthor) {
              defaultRoute = 'author/items'
            } else {
              defaultRoute = '/author/dashboard'
            }
          } else if (
            path[0] &&
            path[0].toLocaleLowerCase() === 'district' &&
            path[1]
          ) {
            redirectRoute = `/district/${path[1]}/signup`
          } else {
            redirectRoute = '/Signup'
          }
        } else if (role === 'edulastic-admin') {
          defaultRoute = '/admin'
        } else if (role === 'student' || role === 'parent') {
          defaultRoute = '/home/assignments'
        } else if (role === 'district-admin' || role === 'school-admin') {
          if (features.isCurator) {
            defaultRoute = '/publisher/dashboard'
          } else if (isPremium) {
            // redirecting da & sa to assignments after login as their dashboard page is not implemented
            defaultRoute = '/author/assignments'
          } else {
            defaultRoute = '/author/reports'
          }
        } else if (role === 'edulastic-curator') {
          defaultRoute = '/author/tests'
        } else if (
          user.user &&
          (user.user.googleId || user.user.msoId || user.user.cleverId)
        ) {
          defaultRoute = '/auth'
        }
        // TODO: handle the rest of the role routes (district-admin,school-admin)
      } else if (location.pathname.toLocaleLowerCase().includes('/sso-auth')) {
        const { redirectUrl = '', cId = '', action = '' } = qs.parse(
          location.search,
          {
            ignoreQueryPrefix: true,
          }
        )
        localStorage.setItem('thirdPartyOAuth', 'wordpress')
        localStorage.setItem('thirdPartyOAuthRedirectUrl', redirectUrl)
        localStorage.setItem('wpCId', cId)
        localStorage.setItem('wpAction', action)
      } else if (
        !(
          location.pathname.toLocaleLowerCase().includes('/getstarted') ||
          location.pathname.toLocaleLowerCase().includes('/signup') ||
          location.pathname.toLocaleLowerCase().includes('/studentsignup') ||
          location.pathname.toLocaleLowerCase().includes('/adminsignup') ||
          (path[0] &&
            ['district', 'school', 'districtlogin'].includes(
              path[0].toLocaleLowerCase()
            )) ||
          location.pathname.toLocaleLowerCase().includes('/partnerlogin/') ||
          location.pathname.toLocaleLowerCase().includes('/fwd') ||
          location.pathname.toLocaleLowerCase().includes('/resetpassword') ||
          location.pathname.toLocaleLowerCase().includes('/inviteteacher') ||
          // third-party auth
          location.pathname.toLocaleLowerCase().includes('/auth/mso') ||
          location.pathname.toLocaleLowerCase().includes('/auth/clever') ||
          location.pathname.toLocaleLowerCase().includes('/auth/google') ||
          location.pathname.toLocaleLowerCase().includes('/auth/atlas') ||
          location.pathname.toLocaleLowerCase().includes('/auth/newsela')
        )
      ) {
        if (
          location.pathname.toLocaleLowerCase().includes('/home') &&
          !location.pathname.toLocaleLowerCase().includes('/home/group')
        ) {
          localStorage.setItem('thirdPartySignOnRole', roleuser.STUDENT)
        }

        if (urlSearch.has('districtRedirect') && urlSearch.has('shortName')) {
          redirectRoute = `/district/${urlSearch.get('shortName')}`
        } else if (!user.authenticating) {
          redirectRoute = '/login'
        }
      }
    }

    /**
     * If error message is stored in the session storage, than we will display it
     * and remove it from the session storage.
     */
    if (sessionStorage.getItem('errorMessage')) {
      notification({ msg: sessionStorage.getItem('errorMessage') })
      sessionStorage.removeItem('errorMessage')
    }

    const userRole = user?.user?.role || ''

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
      _userRole = capitalize(userRole)
    }

    if (features.isCurator) {
      _userRole = 'Content Approver'
    } else if (features.isPublisherAuthor) {
      _userRole = 'Content Author'
    }
    // signup routes hidden till org reference is not done
    const { showAppUpdate, canShowCliBanner, showSelectStates } = this.state
    // changing banner if demo playgoud account
    const bannerText = isDemoAccountProxy
      ? 'This is a demo account. Feel free to explore all the features. Any data modification will be reset at the end of day.'
      : `You are currently acting as ${fullName} (${_userRole})`
    const bannerButtonText = isDemoAccountProxy
      ? 'Close demo account'
      : 'Stop Acting as User'
    return (
      <div>
        {!isPremium && roleuser.DA_SA_ROLE_ARRAY.includes(userRole) && (
          <FreeAdminAlertModal
            history={history}
            setRequestQuoteModal={setRequestQuoteModal}
            setShowSelectStates={this.setShowSelectStates}
          />
        )}
        {isRequestQuoteModalVisible && (
          <RequestQuoteModal
            visible={isRequestQuoteModalVisible}
            onCancel={this.closeRequestQuoteModal}
          />
        )}
        {isRequestOrSubmitSuccessModalVisible && (
          <InvoiceSuccessModal
            visible={isRequestOrSubmitSuccessModalVisible}
            onCancel={this.closeRequestOrSubmitSuccessModal}
          />
        )}
        <CalendlyScheduleModal
          visible={showSelectStates}
          setShowSelectStates={this.setShowSelectStates}
        />
        {shouldWatch && <RealTimeCollectionWatch />}
        {userRole && (
          <CheckRoutePatternsEffectContainer
            role={userRole}
            location={location}
            history={history}
          />
        )}
        <StudentSessionExpiredModal />
        <AppUpdate visible={showAppUpdate} />
        <OfflineNotifier />
        {tutorial && (
          <Joyride continuous showProgress showSkipButton steps={tutorial} />
        )}
        <Suspense fallback={<Loading />}>
          <DragDrop.Provider>
            {(isProxyUser || isDemoAccountProxy) && (
              <Banner
                text={bannerText}
                showButton
                buttonText={bannerButtonText}
                onButtonClick={logout}
              />
            )}
            <ThemeProvider theme={themes.default}>
              <Switch>
                {location.pathname.toLocaleLowerCase() !==
                  redirectRoute.toLocaleLowerCase() && redirectRoute !== '' ? (
                  <Redirect exact to={redirectRoute} />
                ) : null}
                <PrivateRoute
                  path="/author"
                  component={Author}
                  redirectPath={redirectRoute}
                  notifications={
                    roleuser.DA_SA_ROLE_ARRAY.includes(userRole)
                      ? [
                          BulkActionNotificationListener,
                          ReportsNotificationListener,
                        ]
                      : roleuser.TEACHER === userRole
                      ? [ClassSyncNotification, ReportsNotificationListener]
                      : null
                  }
                />
                <PrivateRoute
                  path="/publisher"
                  component={Publisher}
                  redirectPath={redirectRoute}
                />
                <PrivateRoute
                  path="/home"
                  component={Dashboard}
                  notifications={[NotificationListener]}
                  redirectPath={redirectRoute}
                />
                <PrivateRoute
                  path="/admin"
                  component={Admin}
                  redirectPath={redirectRoute}
                  notifications={
                    roleuser.EDULASTIC_ADMIN
                      ? [AdminNotificationListener]
                      : null
                  }
                />
                <PrivateRoute
                  path={['/uploadAnswerSheets']}
                  component={ScanScore}
                  redirectPath={redirectRoute}
                  notifications={[BubbleScanNotificationsListener]}
                />
                <Route exact path="/kid" component={Kid} />
                <LoggedOutRoute
                  exact
                  path="/resetPassword/"
                  component={ResetPassword}
                  redirectPath={defaultRoute}
                />
                <Route
                  exact
                  path="/public/parentInvitation/:code"
                  render={() => <SetParentPassword parentInvitation />}
                />
                <LoggedOutRoute
                  path="/district/:orgShortName"
                  component={DistrictRoutes}
                  redirectPath={defaultRoute}
                  orgType="district"
                />
                <LoggedOutRoute
                  path="/districtLogin/:orgShortName"
                  component={DistrictRoutes}
                  redirectPath={defaultRoute}
                  orgType="districtLogin"
                />
                <LoggedOutRoute
                  path="/school/:orgShortName"
                  component={DistrictRoutes}
                  redirectPath={defaultRoute}
                  orgType="school"
                />
                <LoggedOutRoute
                  path="/Signup"
                  component={TeacherSignup}
                  redirectPath={defaultRoute}
                />
                <LoggedOutRoute
                  exact
                  path="/partnerLogin/:partner/Signup"
                  component={TeacherSignup}
                  redirectPath={defaultRoute}
                />
                <LoggedOutRoute
                  path="/login"
                  component={Auth}
                  redirectPath={defaultRoute}
                />
                <LoggedOutRoute
                  exact
                  path="/partnerLogin/:partner"
                  component={Auth}
                  redirectPath={defaultRoute}
                />
                <LoggedOutRoute
                  path="/GetStarted"
                  component={GetStarted}
                  redirectPath={defaultRoute}
                />
                <LoggedOutRoute
                  exact
                  path="/partnerLogin/:partner/GetStarted"
                  component={GetStarted}
                  redirectPath={defaultRoute}
                />
                <LoggedOutRoute
                  path="/AdminSignup"
                  component={AdminSignup}
                  redirectPath={defaultRoute}
                />
                <LoggedOutRoute
                  exact
                  path="/partnerLogin/:partner/AdminSignup"
                  component={AdminSignup}
                  redirectPath={defaultRoute}
                />
                <LoggedOutRoute
                  path="/StudentSignup"
                  component={StudentSignup}
                  redirectPath={defaultRoute}
                />
                <LoggedOutRoute
                  exact
                  path="/partnerLogin/:partner/StudentSignup"
                  component={StudentSignup}
                  redirectPath={defaultRoute}
                />
                <PrivateRoute
                  path="/student/:assessmentType/:id/class/:groupId/uta/:utaId/test-summary"
                  component={TestAttemptReview}
                />
                <Route
                  path={`/student/${ASSESSMENT}/:id/class/:groupId/uta/:utaId`}
                  render={() => <AssessmentPlayer defaultAP />}
                />
                <Route
                  path={`/student/${TESTLET}/:id/class/:groupId/uta/:utaId`}
                  render={() => <AssessmentPlayer defaultAP />}
                />
                <Route
                  path={`/student/${ASSESSMENT}/:id`}
                  render={() => <AssessmentPlayer defaultAP />}
                />
                <PrivateRoute
                  path="/student/test-summary"
                  component={TestAttemptReview}
                />
                <Route
                  path="/student/seb-quit-confirm"
                  component={SebQuitConfirm}
                />
                <Route
                  path={`/student/${PRACTICE}/:id/class/:groupId/uta/:utaId`}
                  render={() => <AssessmentPlayer defaultAP={false} />}
                />
                <Route
                  path={`/student/${PRACTICE}/:id`}
                  render={() => <AssessmentPlayer defaultAP={false} />}
                />
                <Route
                  path="/public/test/:id"
                  render={() => <TestDemoPlayer />}
                />
                <Route
                  path="/v1/testItem/:id"
                  render={() => <TestItemDemoPlayer />}
                />
                <Route exact path="/fwd" render={() => <V1Redirect />} />
                <Route path="/inviteTeacher" render={() => <Invite />} />
                <Route path="/auth" render={() => <Auth />} />
                {testRedirectRoutes.map((route) => {
                  return (
                    <Route
                      path={route}
                      component={RedirectToTest}
                      key={route}
                    />
                  )
                })}
                <Route
                  path="/public/view-test/:testId"
                  render={(props) => <PublicTest {...props} />}
                />
                <PrivateRoute
                  path="/assignments/embed/:testId"
                  redirectPath={redirectRoute}
                  component={AssignmentEmbedLink}
                />
                <Route
                  path="/audio-test"
                  render={() => <AudioTagPlayer user={user?.user} />}
                />
                <Redirect exact to={defaultRoute} />
              </Switch>
            </ThemeProvider>
          </DragDrop.Provider>
          {cliBannerVisible &&
            canShowCliBanner &&
            !sessionStorage.cliBannerShown && (
              <CLIAccessBanner
                visible={cliBannerVisible && canShowCliBanner}
                location={location}
                onClose={() => {
                  this.setState({ canShowCliBanner: false })
                  sessionStorage.cliBannerShown = true
                }}
              />
            )}
        </Suspense>
      </div>
    )
  }
}

const enhance = compose(
  withRouter,
  connect(
    ({ user, tutorial, subscription }) => ({
      user,
      tutorial: tutorial.currentTutorial,
      fullName: getUserNameSelector({ user }),
      isProxyUser: isProxyUserSelector({ user }),
      shouldWatch: shouldWatchCollectionUpdates({ user }),
      isDemoAccountProxy: isDemoPlaygroundUser({ user }),
      isRequestQuoteModalVisible: getRequestQuoteVisibility({ subscription }),
      isRequestOrSubmitSuccessModalVisible: getRequestOrSubmitSuccessVisibility(
        { subscription }
      ),
      districtId: getUserOrgId({ user }),
    }),
    {
      fetchUser: fetchUserAction,
      logout: logoutAction,
      setRequestQuoteModal: subscriptionSlice.actions.setRequestQuoteModal,
      toggleRequestOrSubmitSuccessModal:
        subscriptionSlice.actions.toggleRequestOrSubmitSuccessModal,
    }
  )
)

export default enhance(App)
