import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import i18n, { I18nextProvider } from '@edulastic/localization'
import { Spin } from 'antd'
import { ConnectedRouter } from 'connected-react-router'
import loadable from '@loadable/component'

import 'font-awesome/css/font-awesome.css'
import 'antd/dist/antd.css'

import { init as SentryInit } from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import './client/index.css'
import { updateSentryScope } from '@edulastic/api/src/utils/Storage'
import configureStore, { history } from './client/configureStore'
import AppConfig from './app-config'
import { loginReducer } from './client/reducers'
import { loginSaga } from './client/sagas'

const Loading = () => (
  <div>
    <Spin />
  </div>
)

const fallbackComponent = {
  fallback: <Loading />,
}

const LoggedOutRoute = loadable(
  () => import('./client/common/components/loggedOutRoute'),
  fallbackComponent
)

const Auth = loadable(() => import('./client/Auth'), fallbackComponent)

const GetStarted = loadable(
  () => import('./client/student/Signup/components/GetStartedContainer'),
  fallbackComponent
)

const DistrictRoutes = loadable(
  () => import('./client/districtRoutes/index'),
  fallbackComponent
)
const ResetPassword = loadable(
  () => import('./client/resetPassword/index'),
  fallbackComponent
)

const TeacherSignup = loadable(
  () => import('./client/student/Signup/components/TeacherContainer/Container'),
  fallbackComponent
)

const StudentSignup = loadable(
  () => import('./client/student/Signup/components/StudentContainer'),
  fallbackComponent
)

const AdminSignup = loadable(
  () => import('./client/student/Signup/components/AdminContainer/Container'),
  fallbackComponent
)

if (AppConfig.sentryURI) {
  SentryInit({
    whitelistUrls: [AppConfig.sentryWhiteListURLRegex],
    dsn: AppConfig.sentryURI,
    release: AppConfig.appVersion,
    environment: AppConfig.appStage || 'development',
    maxValueLength: 600, // defaults to 250 chars, we will need more info recorded.
    ignoreErrors: AppConfig.sentryIgnoreErrors,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.1, // we sample only 10% of the data from clients.
  })
  updateSentryScope()
}

// login - redux store
const { store } = configureStore({}, loginReducer, loginSaga)

const defaultRoute = '/login'

const RootComp = () => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Suspense fallback={<Spin />}>
          <Switch>
            <LoggedOutRoute exact path="/login" component={Auth} />
            <LoggedOutRoute
              exact
              path="/resetPassword/"
              component={ResetPassword}
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
          </Switch>
        </Suspense>
      </ConnectedRouter>
    </Provider>
  </I18nextProvider>
)

ReactDOM.render(<RootComp />, document.getElementById('app-login'))
