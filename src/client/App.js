import React, { Component, useEffect, Suspense } from 'react'
import { capitalize, get, isUndefined, isEmpty } from 'lodash'
import qs from 'qs'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Spin } from 'antd'
import Joyride from 'react-joyride'
import firebase from 'firebase/app'
import { test, signUpState, roleuser } from '@edulastic/constants'
import loadable from '@loadable/component'
import { OfflineNotifier, notification, DragDrop } from '@edulastic/common'
import { TokenStorage } from '@edulastic/api'
import { Banner } from './common/components/Banner'
import { TestAttemptReview } from './student/TestAttemptReview'
import SebQuitConfirm from './student/SebQuitConfirm'
import {
  getUserNameSelector,
  shouldWatchCollectionUpdates,
} from './author/src/selectors/user'
import {
  fetchUserAction,
  isProxyUser as isProxyUserSelector,
  toggleImageBlockNotificationAction,
} from './student/Login/ducks'
import TestDemoPlayer from './author/TestDemoPlayer'
import TestItemDemoPlayer from './author/TestItemDemoPlayer'
import {
  getWordsInURLPathName,
  isImagesBlockedByBrowser,
} from './common/utils/helpers'
import LoggedOutRoute from './common/components/loggedOutRoute'
import PrivateRoute from './common/components/privateRoute'
import V1Redirect from './author/V1Redirect'
import Kid from './kid/app'
import NotificationListener from './HangoutVideoCallNotification'
import BulkActionNotificationListener from './author/AssignmentAdvanced/components/BulkAssignmentActionNotification'
import ClassSyncNotification from './author/Classes/components/ClassSyncNotification'
import AppUpdate from './common/components/AppUpdate'
import { logoutAction } from './author/src/actions/auth'
import RealTimeCollectionWatch from './RealTimeCollectionWatch'
import ImagesBlocked from './common/components/ImagesBlocked'

const { ASSESSMENT, PRACTICE, TESTLET } = test.type

const Loading = () => (
  <div>
    <Spin />
  </div>
)

// route wise splitting
const AssessmentPlayer = loadable(() => import('./assessment/index'), {
  fallback: <Loading />,
})
const TeacherSignup = loadable(
  () => import('./student/Signup/components/TeacherContainer/Container'),
  {
    fallback: <Loading />,
  }
)
const Auth = loadable(() => import('./Auth'), {
  fallback: <Loading />,
})
const Invite = loadable(() => import('./Invite/index'), {
  fallback: <Loading />,
})
const GetStarted = loadable(
  () => import('./student/Signup/components/GetStartedContainer'),
  {
    fallback: <Loading />,
  }
)
const StudentSignup = loadable(
  () => import('./student/Signup/components/StudentContainer'),
  {
    fallback: <Loading />,
  }
)
const AdminSignup = loadable(
  () => import('./student/Signup/components/AdminContainer/Container'),
  {
    fallback: <Loading />,
  }
)
const Dashboard = loadable(() => import('./student/app'), {
  fallback: <Loading />,
})
const Author = loadable(() => import('./author/src/app'), {
  fallback: <Loading />,
})
const Publisher = loadable(() => import('./publisher/app'), {
  fallback: <Loading />,
})
const Admin = loadable(() => import('./admin/app'), {
  fallback: <Loading />,
})
const RedirectToTest = loadable(() => import('./author/RedirectToTest'), {
  fallback: <Loading />,
})
const DistrictRoutes = loadable(() => import('./districtRoutes/index'), {
  fallback: <Loading />,
})
const ResetPassword = loadable(() => import('./resetPassword/index'), {
  fallback: <Loading />,
})
const SetParentPassword = loadable(() => import('./SetParentPassword'), {
  fallback: <Loading />,
})
const CLIAccessBanner = loadable(
  () => import('./author/Dashboard/components/CLIAccessBanner'),
  {
    fallback: <Loading />,
  }
)
const PublicTest = loadable(() => import('./publicTest/container'), {
  fallback: <Loading />,
})
const AssignmentEmbedLink = loadable(
  () => import('./assignmentEmbedLink/container'),
  {
    fallback: <Loading />,
  }
)
const AudioTagPlayer = loadable(() => import('./AudioTagPlayer'), {
  fallback: <Loading />,
})

const query = qs.parse(window.location.search, { ignoreQueryPrefix: true })
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

if (query && query.cliUser && query.token) {
  localStorage.setItem('cliAppRefreshUrl', window.location.href)
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
const getCurrentPath = () => {
  const location = window.location
  return `${location.pathname}${location.search}${location.hash}`
}

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
      role === roleuser.EDULASTIC_ADMIN &&
      !location.pathname.startsWith('/admin')
    ) {
      history.push('/admin')
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
  constructor(props) {
    super(props)
    this.state = {
      showAppUpdate: false,
      canShowCliBanner: true,
    }
  }

  componentDidMount() {
    const {
      fetchUser,
      location,
      isImageBlockNotification,
      toggleImageBlockNotification,
    } = this.props
    const publicPath = location.pathname.split('/').includes('public')
    const embedLink = location.pathname.split('/').includes('embed')
    const ssoPath = location.pathname.split('/').includes('auth')
    const partnerPath = location.pathname.split('/').includes('partnerLogin')
    const isV1Redirect =
      location.pathname.includes('/fwd') ||
      isLocationInTestRedirectRoutes(location)
    const kidPath = location.pathname.includes('/kid')
    if (
      !embedLink &&
      !publicPath &&
      !ssoPath &&
      !partnerPath &&
      !isV1Redirect &&
      !kidPath
    ) {
      fetchUser({ addAccount: query.addAccount, userId: query.userId })
    } else if (
      ((publicPath &&
        (location.pathname.split('/').includes('view-test') ||
          isLocationInTestRedirectRoutes(location))) ||
        embedLink) &&
      TokenStorage.getAccessToken()
    ) {
      fetchUser()
    }
    window.addEventListener('request-client-update', () => {
      this.setState({
        showAppUpdate: true,
      })
    })
    isImagesBlockedByBrowser().then((flag) => {
      if (flag && !isImageBlockNotification) {
        toggleImageBlockNotification(true)
      }
    })
  }

  handleImageNotificationClose = () => {
    const { toggleImageBlockNotification } = this.props
    toggleImageBlockNotification(false)
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
      isImageBlockNotification,
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
    if (!publicPath) {
      const path = getWordsInURLPathName(location.pathname)
      const urlSearch = new URLSearchParams(location.search)

      if (user && user.isAuthenticated) {
        // Clear referrer once userId available
        if (
          user &&
          (user.userId || user.user?._id) &&
          window.localStorage.getItem('originalreferrer')
        ) {
          window.localStorage.removeItem('originalreferrer')
        }
        const role = get(user, ['user', 'role'])
        if (role === 'teacher') {
          if (
            user.signupStatus === signUpState.ACCESS_WITHOUT_SCHOOL ||
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
          } else {
            // redirecting da & sa to assignments after login as their dashboard page is not implemented
            defaultRoute = '/author/assignments'
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
          location.pathname.toLocaleLowerCase().includes('/auth/atlas')
        )
      ) {
        if (location.pathname.toLocaleLowerCase().includes('/home')) {
          localStorage.setItem('thirdPartySignOnRole', roleuser.STUDENT)
        }
        if (!getCurrentPath().includes('/login')) {
          localStorage.setItem('loginRedirectUrl', getCurrentPath())
        }

        if (urlSearch.has('districtRedirect') && urlSearch.has('shortName')) {
          redirectRoute = `/district/${urlSearch.get('shortName')}`
        } else {
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

    const { showAppUpdate, canShowCliBanner } = this.state
    console.log('defaultRoute', defaultRoute)
    console.log('redirectRoute', redirectRoute)
    return (
      <Suspense fallback={<Loading />}>
        {shouldWatch && <RealTimeCollectionWatch />}
        {userRole && (
          <CheckRoutePatternsEffectContainer
            role={userRole}
            location={location}
            history={history}
          />
        )}
        <AppUpdate visible={showAppUpdate} isCliUser={user?.isCliUser} />
        <ImagesBlocked
          visible={isImageBlockNotification}
          onClose={this.handleImageNotificationClose}
        />
        <OfflineNotifier />
        {tutorial && (
          <Joyride continuous showProgress showSkipButton steps={tutorial} />
        )}
        <DragDrop.Provider>
          {isProxyUser && (
            <Banner
              text={`You are currently acting as ${fullName} (${_userRole})`}
              showButton
              buttonText="Stop Acting as User"
              onButtonClick={logout}
            />
          )}
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
                  ? [BulkActionNotificationListener]
                  : roleuser.TEACHER === userRole
                  ? [ClassSyncNotification]
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
              redirectPath={defaultRoute}
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
            <Route path="/public/test/:id" render={() => <TestDemoPlayer />} />
            <Route
              path="/v1/testItem/:id"
              render={() => <TestItemDemoPlayer />}
            />
            <Route exact path="/fwd" render={() => <V1Redirect />} />
            <Route path="/inviteTeacher" render={() => <Invite />} />
            <Route path="/auth" render={() => <Auth />} />
            {testRedirectRoutes.map((route) => {
              console.log('here')
              return (
                <Route path={route} component={RedirectToTest} key={route} />
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
    )
  }
}

App.propTypes = {
  user: PropTypes.object.isRequired,
  tutorial: PropTypes.object,
  location: PropTypes.object.isRequired,
  fetchUser: PropTypes.func.isRequired,
}

App.defaultProps = {
  tutorial: null,
}

const enhance = compose(
  withRouter,
  connect(
    ({ user, tutorial }) => ({
      user,
      tutorial: tutorial.currentTutorial,
      fullName: getUserNameSelector({ user }),
      isProxyUser: isProxyUserSelector({ user }),
      shouldWatch: shouldWatchCollectionUpdates({ user }),
      isImageBlockNotification: user.isImageBlockNotification,
    }),
    {
      fetchUser: fetchUserAction,
      logout: logoutAction,
      toggleImageBlockNotification: toggleImageBlockNotificationAction,
    }
  )
)

export default enhance(App)
