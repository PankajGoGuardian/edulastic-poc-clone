import React from 'react'
import Helmet from 'react-helmet'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import i18n, { I18nextProvider } from '@edulastic/localization'
import { ConnectedRouter } from 'connected-react-router'
import smoothscroll from 'smoothscroll-polyfill'
import keyboardEventKeyPolyfill from 'keyboardevent-key-polyfill'
// will import all features.. optimize.!
import 'core-js/features/array'
import 'core-js/features/object'
import 'font-awesome/css/font-awesome.css'
import 'antd/dist/antd.css'
import 'react-perfect-scrollbar/dist/css/styles.css'
import { init as SentryInit } from '@sentry/browser'
// import { Integrations } from '@sentry/tracing'
import './client/index.css'
import {
  updateSentryScope,
  removeAllTokens,
} from '@edulastic/api/src/utils/Storage'
import App from './client/App'
import configureStore, { history } from './client/configureStore'
import AppConfig from './app-config'
import { isMobileDevice, isIOS } from './client/platform'
import * as serviceWorker from './service-worker-registration'
import { initializeSegment } from './client/common/utils/main'
import { storeErrorDescriptionInSessionStorage } from './client/common/utils/helpers'

document.addEventListener('DOMContentLoaded', function () {
  const codeInUrl =
    window.location.search.includes('code=') ||
    window.location.pathname.includes('newsela')
  if (codeInUrl) {
    removeAllTokens()
  }
})

if (AppConfig.sentryURI) {
  SentryInit({
    allowUrls: [AppConfig.sentryWhiteListURLRegex],
    sampleRate: 0.5,
    maxBreadcrumbs: 30,
    dsn: AppConfig.sentryURI,
    release: AppConfig.getSentryReleaseName(),
    environment: AppConfig.appStage,
    maxValueLength: 600, // defaults to 250 chars, we will need more info recorded.
    ignoreErrors: AppConfig.sentryIgnoreErrors,
    denyUrls: AppConfig.sentryIgnoreUrls,
    // integrations: [new Integrations.BrowserTracing()],
    // tracesSampleRate: 0.1, // we sample only 10% of the data from clients.
  })
  updateSentryScope()
}

if (
  window.location?.search?.includes('showCLIBanner=1') &&
  !sessionStorage?.cliBannerShown
) {
  sessionStorage.cliBannerVisible = true
}

/**
 *  In case of redirection from canvas we might get errorDescription as query param which
 *  we have to display as error message and remove it from the url.
 */
storeErrorDescriptionInSessionStorage()

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach
}

window.isMobileDevice = isMobileDevice()
window.isIOS = isIOS()

keyboardEventKeyPolyfill.polyfill()
smoothscroll.polyfill()

initializeSegment()

// redux store
const { store } = configureStore({})

const RootComp = () => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <>
          <Helmet>
            <link rel="canonical" href="https://assessment.peardeck.com/" />
          </Helmet>
          <App />
        </>
      </ConnectedRouter>
    </Provider>
  </I18nextProvider>
)
ReactDOM.render(<RootComp />, document.getElementById('react-app'))

if (window.Cypress) {
  window.store = store
  serviceWorker.unregister()
} else {
  serviceWorker.register()
}
