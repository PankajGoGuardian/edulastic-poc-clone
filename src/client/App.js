import React, { useState, useEffect, Suspense } from 'react'
import { capitalize, get, isUndefined, isEmpty } from 'lodash'
import qs from 'qs'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import Spin from "antd/es/Spin";
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
} from './student/Login/ducks'
import TestDemoPlayer from './author/TestDemoPlayer'
import TestItemDemoPlayer from './author/TestItemDemoPlayer'
import { getWordsInURLPathName } from './common/utils/helpers'
import PrivateRoute from './common/components/privateRoute'
import V1Redirect from './author/V1Redirect'
import Kid from './kid/app'
import NotificationListener from './HangoutVideoCallNotification'
import BulkActionNotificationListener from './author/AssignmentAdvanced/components/BulkAssignmentActionNotification'
import ClassSyncNotification from './author/Classes/components/ClassSyncNotification'
import AppUpdate from './common/components/AppUpdate'
import { logoutAction } from './author/src/actions/auth'
import RealTimeCollectionWatch from './RealTimeCollectionWatch'

const { ASSESSMENT, PRACTICE, TESTLET } = test.type

const Loading = () => (
  <div>
    <Spin />
  </div>
)

const fallback = () => <Loading />

// route wise splitting
const AssessmentPlayer = loadable(() => import('./assessment/index'), {
  fallback,
})
const Auth = loadable(() => import('./Auth'), {
  fallback,
})
const Invite = loadable(() => import('./Invite/index'), {
  fallback,
})

const Dashboard = loadable(() => import('./student/app'), {
  fallback,
})
const Author = loadable(() => import('./author/src/app'), {
  fallback,
})
const Publisher = loadable(() => import('./publisher/app'), {
  fallback,
})
const Admin = loadable(() => import('./admin/app'), {
  fallback,
})
const RedirectToTest = loadable(() => import('./author/RedirectToTest'), {
  fallback,
})
const SetParentPassword = loadable(() => import('./SetParentPassword'), {
  fallback,
})
const CLIAccessBanner = loadable(
  () => import('./author/Dashboard/components/CLIAccessBanner'),
  fallback
)
const PublicTest = loadable(() => import('./publicTest/container'), {
  fallback,
})
const AssignmentEmbedLink = loadable(
  () => import('./assignmentEmbedLink/container'),
  {
    fallback,
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

const loggedOutRoutes = new RegExp(
  '(/login)|(/resetPassword)|(/districtLogin)|(/district)|(/school)|(/Signup)|(/partnerLogin)|(/GetStarted)|(/AdminSignup)|(/StudentSignup)',
  'ig'
)

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
      role === roleuser.STUDENT &&
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
      role !== roleuser.STUDENT &&
      role !== roleuser.PARENT &&
      location.pathname.startsWith('/home')
    ) {
      history.push(
        location.pathname.replace('home', 'author') || '/author/assignments'
      )
    }
  }, [])
  return null
}

const pathIncludes = (str) =>
  window.location.pathname.toLocaleLowerCase().includes(str)

const App = ({
  user,
  tutorial,
  location,
  history,
  fullName,
  logout,
  isProxyUser,
  shouldWatch,
  fetchUser,
}) => {
  const [showAppUpdate, setShowAppUpdate] = useState(false)
  const [canShowCliBanner, setCanShowCliBanner] = useState(false)

  const currentPath = location.pathname
  const urlPathSplit = currentPath.split('/')
  const publicPath = urlPathSplit.includes('public')
  const embedLink = location.pathname.split('/').includes('embed')
  const ssoPath = urlPathSplit.includes('auth')
  const partnerPath = urlPathSplit.includes('partnerLogin')
  const kidPath = currentPath.includes('/kid')
  const isV1Redirect =
    currentPath.includes('/fwd') || isLocationInTestRedirectRoutes(location)

  useEffect(() => {
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

    window.addEventListener('request-client-update', () =>
      setShowAppUpdate(true)
    )
  }, [])

  const cliBannerVisible = sessionStorage.cliBannerVisible || false

  if (
    location.hash.includes('#renderResource/close/') ||
    location.hash.includes('#assessmentQuestions/close/')
  ) {
    const v1Id = location.hash.split('/')[2]
    history.push(`/d/ap?eAId=${v1Id}`)
    return <Loading />
  }

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
  if (!publicPath && !embedLink) {
    const path = getWordsInURLPathName(location.pathname)
    const urlSearch = new URLSearchParams(location.search)

    if (
      user &&
      !user.isAuthenticated &&
      (currentPath === '/' || currentPath.match(loggedOutRoutes))
    ) {
      window.location.replace('/')
    } else if (user && user.isAuthenticated) {
      // Clear referrer once userId available
        if (
          user &&
          (user.userId || user.user?._id) &&
          window.localStorage.getItem('originalreferrer')
        ) {
          window.localStorage.removeItem('originalreferrer')
        }
      const role = get(user, ['user', 'role'])
      if (role === roleuser.TEACHER) {
        if (
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
        pathIncludes('/getstarted') ||
        pathIncludes('/signup') ||
        pathIncludes('/studentsignup') ||
        pathIncludes('/adminsignup') ||
        (path[0] &&
          ['district', 'school', 'districtlogin'].includes(
            path[0].toLocaleLowerCase()
          )) ||
        pathIncludes('/partnerlogin/') ||
        pathIncludes('/fwd') ||
        pathIncludes('/resetpassword') ||
        pathIncludes('/inviteteacher') ||
        // third-party auth
        pathIncludes('/auth/mso') ||
        pathIncludes('/auth/clever') ||
        pathIncludes('/auth/google') ||
        pathIncludes('/auth/atlas')
      )
    ) {
      if (pathIncludes('/home')) {
        localStorage.setItem('thirdPartySignOnRole', roleuser.STUDENT)
      }

      if (!pathIncludes('/login')) {
        localStorage.setItem('loginRedirectUrl', getCurrentPath())
      }

      if (urlSearch.has('districtRedirect') && urlSearch.has('shortName')) {
        redirectRoute = `/district/${urlSearch.get('shortName')}`
      } else {
        window.location.replace('/')
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

  switch (userRole) {
    case roleuser.TEACHER:
      _userRole = 'Teacher'
      break
    case roleuser.SCHOOL_ADMIN:
      _userRole = 'School-Admin'
      break
    case roleuser.DISTRICT_ADMIN:
      _userRole = 'District-Admin'
      break
    case roleuser.STUDENT:
      _userRole = 'Student'
      break
    case roleuser.EDULASTIC_CURATOR:
      _userRole = 'Edulastic Curator'
      break
    default:
      _userRole = capitalize(userRole)
      break
  }

  if (features.isCurator) {
    _userRole = 'Content Approver'
  } else if (features.isPublisherAuthor) {
    _userRole = 'Content Author'
  }

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
          {currentPath.toLocaleLowerCase() !==
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
          <Route
            exact
            path="/public/parentInvitation/:code"
            render={() => <SetParentPassword parentInvitation />}
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
          <Route path="/student/seb-quit-confirm" component={SebQuitConfirm} />
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
          {testRedirectRoutes.map((route) => (
            <Route path={route} component={RedirectToTest} key={route} />
          ))}
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
      {cliBannerVisible && canShowCliBanner && !sessionStorage.cliBannerShown && (
        <CLIAccessBanner
          visible={cliBannerVisible && canShowCliBanner}
          location={location}
          onClose={() => {
            setCanShowCliBanner(false)
            sessionStorage.cliBannerShown = true
          }}
        />
      )}
    </Suspense>
  )
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
    }),
    {
      fetchUser: fetchUserAction,
      logout: logoutAction,
    }
  )
)

export default enhance(App)
