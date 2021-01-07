import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import i18n, { I18nextProvider } from '@edulastic/localization'
import { ConnectedRouter } from 'connected-react-router'
import Spin from 'antd/es/spin'

import 'font-awesome/css/font-awesome.css'
import 'antd/dist/antd.css'

import { init as SentryInit } from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import './client/index.css'
import { updateSentryScope } from '@edulastic/api/src/utils/Storage'
import AppStudent from './client/AppStudent'
import configureStore, { history } from './client/configureStoreStudents'
import AppConfig from './app-config'
import { studentReducers } from './client/studentReducers'
import { studentsSagas } from './client/studentSagas'
import { fetchUserAction } from './client/student/Login/ducks'
import { isMobileDevice, isIOS } from './client/platform'

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

localStorage.removeItem('authState')

window.isMobileDevice = isMobileDevice()
window.isIOS = isIOS()

// login - redux store
const { store } = configureStore({}, studentReducers, studentsSagas)
store.dispatch(fetchUserAction())

const RootComp = () => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Suspense fallback={<Spin />}>
          <AppStudent />
        </Suspense>
      </ConnectedRouter>
    </Provider>
  </I18nextProvider>
)

ReactDOM.render(<RootComp />, document.getElementById('app-students'))
