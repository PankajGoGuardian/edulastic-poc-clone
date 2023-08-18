import React, { Component, Suspense, lazy, useEffect } from 'react'
import { isEmpty } from 'lodash'
import qs from 'qs'
import queryString from 'query-string'
import PropTypes from 'prop-types'
import { Switch, Redirect, withRouter, Route } from 'react-router-dom'
import {
  test,
  signUpState,
  roleuser,
  testTypes as testTypesConstants,
} from '@edulastic/constants'
import { connect } from 'react-redux'
import { DndProvider } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'
import HTML5Backend from 'react-dnd-html5-backend'
import { compose } from 'redux'
import Spin from 'antd/es/spin'
import Joyride from 'react-joyride'
import PrivateRoute from './common/components/privateRoute'
import notification from '@edulastic/common/src/components/Notification'
import OfflineNotifier from '@edulastic/common/src/components/OfflineNotifier'
import { isMobileDevice } from '@edulastic/common/src/helpers'
import * as TokenStorage from '@edulastic/api/src/utils/Storage'
import * as firebase from 'firebase/app'
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
import NotificationListener from './HangoutVideoCallNotification'
import AppUpdate from './common/components/AppUpdate'
import StudentSessionExpiredModal from './common/components/StudentSessionExpiredModal'
import { logoutAction } from './author/src/actions/auth'
import RealTimeCollectionWatch from './RealTimeCollectionWatch'
import UserTokenExpiredModal from './common/components/UserTokenExpiredModal'

const Dashboard = lazy(() =>
  import(/* webpackChunkName: "student" */ './student/app')
)

const {
  ASSESSMENT,
  PRACTICE,
  TESTLET,
} = testTypesConstants.TEST_TYPES_VALUES_MAP
// route wise splitting
const AssessmentPlayer = lazy(() =>
  import(/* webpackChunkName: "assessmentPlayer" */ './assessment/index')
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

const getCurrentPath = () => {
  const location = window.location
  return `${location.pathname}${location.search}${location.hash}`
}

const dndBackend = isMobileDevice() ? TouchBackend : HTML5Backend

function CheckRoutePatternsEffectContainer({ role, location, history }) {
  useEffect(() => {
    if (
      (role === 'student' || role == 'parent') &&
      location.pathname.startsWith('/author')
    ) {
      //   history.push(
      //     location.pathname.replace('author', 'home') || '/home/assignments'
      //   )
    } else if (
      role !== 'student' &&
      role !== 'parent' &&
      location.pathname.startsWith('/home')
    ) {
      window.location.href =
        location.pathname.replace('home', 'author') || '/author/assignments'
    }
  }, [location.pathname, role])
  return null
}

const redirectRoute = '/home/assignments'

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
  }

  componentDidMount() {
    const { fetchUser, location } = this.props
    fetchUser({ addAccount: query.addAccount, userId: query.userId })
    window.addEventListener('request-client-update', () => {
      this.setState({
        showAppUpdate: true,
      })
    })
  }

  render() {
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
    } = this.props

    const publicPath = false

    if (
      !publicPath &&
      user.authenticating &&
      TokenStorage.getAccessToken() &&
      !location.pathname.includes('/auth/') &&
      !sessionStorage.getItem('addAccountDetails')
    ) {
      return <Loading />
    }
    const userRole = user?.user?.role || ''

    const { showAppUpdate, canShowCliBanner } = this.state

    return (
      <div>
        {shouldWatch && <RealTimeCollectionWatch />}
        {userRole && (
          <CheckRoutePatternsEffectContainer
            role={userRole}
            location={location}
            history={history}
          />
        )}
        <AppUpdate visible={showAppUpdate} />
        <StudentSessionExpiredModal />
        <UserTokenExpiredModal />
        <OfflineNotifier />
        {tutorial && (
          <Joyride continuous showProgress showSkipButton steps={tutorial} />
        )}
        <Suspense fallback={<Loading />}>
          <DndProvider
            backend={dndBackend}
            options={{
              enableTouchEvents: true,
              enableMouseEvents: true,
            }}
          >
            <Switch>
              {/* {location.pathname.toLocaleLowerCase() !==
                redirectRoute.toLocaleLowerCase() && redirectRoute !== '' ? (
                <Redirect exact to={redirectRoute} />
              ) : null} */}
              <PrivateRoute
                path="/home"
                component={Dashboard}
                notifications={[NotificationListener]}
                redirectPath={redirectRoute}
              />
              {/* New route is created to handle the section submit review page. It
              renders the same component as the final submit review page. */}
              <PrivateRoute
                path="/student/:assessmentType/:id/class/:groupId/uta/:utaId/test-summary"
                component={TestAttemptReview}
              />
              <PrivateRoute
                path="/student/:assessmentType/:id/class/:groupId/uta/:utaId/section/:sectionId/test-summary"
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
            </Switch>
          </DndProvider>
        </Suspense>
      </div>
    )
  } //render
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
