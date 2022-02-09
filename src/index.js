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

initializeSegment()

export const initEmbeddedServiceCloudWidget = () => {
  // if (process.env.NODE_ENV !== 'production') {
  //   return
  // }

  // ***************** service cloud embedded chat widget snippet
  const initESW = (gslbBaseURL) => {
    window.embedded_svc.settings.displayHelpButton = true //Or false
    window.embedded_svc.settings.language = '' //For example, enter 'en' or 'en-US'

    //window.embedded_svc.settings.defaultMinimizedText = '...'; //(Defaults to Chat with an Expert)
    //window.embedded_svc.settings.disabledMinimizedText = '...'; //(Defaults to Agent Offline)

    //window.embedded_svc.settings.loadingText = ''; //(Defaults to Loading)
    //window.embedded_svc.settings.storageDomain = 'yourdomain.com'; //(Sets the domain for your deployment so that visitors can navigate subdomains during a chat session)

    // Settings for Chat
    //window.embedded_svc.settings.directToButtonRouting = function(prechatFormData) {
    // Dynamically changes the button ID based on what the visitor enters in the pre-chat form.
    // Returns a valid button ID.
    //};
    //window.embedded_svc.settings.prepopulatedPrechatFields = {}; //Sets the auto-population of pre-chat form fields
    //window.embedded_svc.settings.fallbackRouting = []; //An array of button IDs, user IDs, or userId_buttonId
    //window.embedded_svc.settings.offlineSupportMinimizedText = '...'; //(Defaults to Contact Us)

    window.embedded_svc.settings.enabledFeatures = ['LiveAgent']
    window.embedded_svc.settings.entryFeature = 'LiveAgent'

    window.embedded_svc.init(
      'https://goguardian.my.salesforce.com',
      'https://support.goguardian.com/',
      gslbBaseURL,
      '00D41000000GNzs',
      'Edulastic_Chat_Support',
      {
        baseLiveAgentContentURL:
          'https://c.la3-c1-ia2.salesforceliveagent.com/content',
        deploymentId: '5724N000000CocW',
        buttonId: '5734N0000004Rej',
        baseLiveAgentURL: 'https://d.la3-c1-ia2.salesforceliveagent.com/chat',
        eswLiveAgentDevName: 'Edulastic_Chat_Support',
        isOfflineSupportEnabled: false,
      }
    )
  }

  if (!window.embedded_svc) {
    var s = document.createElement('script')
    s.setAttribute(
      'src',
      'https://goguardian.my.salesforce.com/embeddedservice/5.0/esw.min.js'
    )
    s.onload = function () {
      initESW(null)
    }
    document.body.appendChild(s)
  } else {
    initESW('https://service.force.com')
  }
}

initEmbeddedServiceCloudWidget()

// redux store
const { store } = configureStore({})

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
  serviceWorker.unregister()
} else {
  serviceWorker.register()
}
