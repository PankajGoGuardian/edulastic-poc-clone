import React from 'react'
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
import { updateSentryScope } from '@edulastic/api/src/utils/Storage'
import App from './client/App'
import configureStore, { history } from './client/configureStore'
import AppConfig from './app-config'
import { isMobileDevice, isIOS } from './client/platform'
import * as serviceWorker from './serviceWorker'

if (AppConfig.sentryURI) {
  SentryInit({
    allowUrls: [AppConfig.sentryWhiteListURLRegex],
    sampleRate: 0.5,
    maxBreadcrumbs: 30,
    dsn: AppConfig.sentryURI,
    release: AppConfig.appVersion,
    environment: AppConfig.appStage || 'development',
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

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach
}

window.isMobileDevice = isMobileDevice()
window.isIOS = isIOS()

keyboardEventKeyPolyfill.polyfill()
smoothscroll.polyfill()

if (AppConfig.isSegmentEnabled) {
  !(() => {
    window.analytics = window.analytics || []
    const { analytics } = window
    if (!analytics.initialize)
      if (analytics.invoked)
        window.console &&
          console.error &&
          console.error('Segment snippet included twice.')
      else {
        analytics.invoked = !0
        analytics.methods = [
          'trackSubmit',
          'trackClick',
          'trackLink',
          'trackForm',
          'pageview',
          'identify',
          'reset',
          'group',
          'track',
          'ready',
          'alias',
          'debug',
          'page',
          'once',
          'off',
          'on',
        ]
        analytics.factory = function (t) {
          return function (...args) {
            const e = Array.prototype.slice.call(args)
            e.unshift(t)
            analytics.push(e)
            return analytics
          }
        }
        for (let t = 0; t < analytics.methods.length; t++) {
          const e = analytics.methods[t]
          analytics[e] = analytics.factory(e)
        }
        analytics.load = function (t, e) {
          const n = document.createElement('script')
          n.type = 'text/javascript'
          n.async = !0
          // download the file from by passing the key https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js
          // and upload it to s3
          n.src = AppConfig.segmentURI
          const a = document.getElementsByTagName('script')[0]
          a.parentNode.insertBefore(n, a)
          analytics._loadOptions = e
        }
        analytics.SNIPPET_VERSION = AppConfig.segmentVersion
        analytics.load()
      }
  })()
}

// redux store
const { store } = configureStore()

const RootComp = () => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </I18nextProvider>
)
ReactDOM.render(<RootComp />, document.getElementById('react-app'))

if (window.Cypress) {
  window.store = store
}

serviceWorker.unregister()
