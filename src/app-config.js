// Don't put any sensitive information
// https://edupoc.s3.amazonaws.com/edulasticv2-development/JS/thirdpartylib/ev2-scientificcalc/CalcSS3.js
const cdnURI =
  process.env.REACT_APP_CDN_URI ||
  'https://cdnedupoc.snapwiz.net/edulasticv2-development'
const appEnv = process.env.REACT_APP_ENV
const appStage = process.env.REACT_APP_STAGE || 'development'
// __CLIENT_VERSION__ is injected to envs in poi.config.js
// using it to avoid importing json for just version
const appVersion = process.env.__CLIENT_VERSION__ || 'NA'
const thirdPartyLibPath = `${cdnURI}/JS/thirdpartylib`
const jqueryPath = `${thirdPartyLibPath}/jquery/v1.11.0/jquery.min.js`
const mathquillPath = `${thirdPartyLibPath}/mathquill/v0.10.1`
const zwibbler2Path = `${thirdPartyLibPath}/zwibbler/v2`
const katexPath = `${thirdPartyLibPath}/katex/v0.11.1`
const ttsChoicesPath = `${cdnURI}/tts`
const desmosPath = `${thirdPartyLibPath}/desmos/v1.6/calculator.js`
const geoGebraPath = `${thirdPartyLibPath}/geogebra/v5.0/deployggb.js`
const sentryWhiteListURLRegex = /edulastic\.com|snapwiz\.net/
const eduScientificCalcPath = `${thirdPartyLibPath}/ev2-scientificcalc`
const eduScientificCalcJsPath = `${eduScientificCalcPath}/CalcSS3.js`
const eduScientificCalcCssPath = `${eduScientificCalcPath}/CalcSS3.css`

const testletMathJax =
  'https://ws-preview.nextera.questarai.com/libs/NexteraMathJax.2.7.5/MathJax.js?config=MML_HTMLorMML-full.js'

const sentryURI =
  process.env.REACT_APP_SENTRY_DSN || process.env.REACT_APP_SENTRY_URI
const segmentURI =
  process.env.REACT_APP_SEGMENT_URI ||
  `${thirdPartyLibPath}/segmentjs/v4.2.2/analytics.js`
const segmentVersion = process.env.REACT_APP_SEGMENT_VERSION || '4.2.2'
const isSegmentEnabled = process.env.REACT_APP_ENABLE_SEGMENT === 'true'
const isChatWidgetEnabled = process.env.REACT_APP_ENABLE_CHAT_WIDGET === 'true'

const googleClientSdkUrl = 'https://accounts.google.com/gsi/client'
const googleApiSdkUrl = 'https://apis.google.com/js/api.js'
const googleCalendarApiVersion = 'v3'

const segmentHashSecret =
  process.env.REACT_APP_SEGMENT_HASH_SECRET ||
  'ey4OaPLX2BjSsUqj0NK2Sw3QtHjtzojmfRCeUcDH'
const v1RedirectDecryptSalt = process.env.REDIRECT_DECRYPT_SALT || 436792765

export const firebaseConfig = {
  apiKey:
    process.env
      .REACT_APP_FIREBASE_API_KEY /* || "AIzaSyA_2mdY_l-tHgy5LvQigdNmVmqABdx7458" */,
  authDomain:
    process.env
      .REACT_APP_FIREBASE_AUTH_DOMAIN /* || "ev2-dev-88215.firebaseapp.com" */,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID /* || "ev2-dev-88215" */,
}

const sentryIgnoreErrors = [
  // Random plugins/extensions
  'top.GLOBALS',
  // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
  'originalCreateNotification',
  'canvas.contentDocument',
  'MyApp_RemoveAllHighlights',
  'http://tt.epicplay.com',
  "Can't find variable: ZiteReader",
  'jigsaw is not defined',
  'ComboSearch is not defined',
  'http://loading.retry.widdit.com/',
  'atomicFindClose',
  // Facebook borked
  'fb_xd_fragment',
  // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to reduce this. (thanks @acdha)
  // See http://stackoverflow.com/questions/4113268/how-to-stop-javascript-injection-from-vodafone-proxy
  'bmi_SafeAddOnload',
  'EBCallBackMessageReceived',
  // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
  'conduitPage',
  // edulastic FE specific
  'ResizeObserver loop limit exceeded',
  'invalid password',
  'scrollTop',
  'froala',
  'getBoundingClientRect',
  'Non-Error promise rejection',
  'exceeded',
  'quota',
  'Quota',
  'MouseEvent',
  '/login',
  '403',
  '401',
  'TokenExpire',
  'expired',
  "Cannot read property 'hasClass' of null",
  "Cannot set property 'isFullscreen' of undefined",
  "InvalidStateError: Failed to execute 'transaction' on 'IDBDatabase'",
]
const sentryIgnoreUrls = [
  // Facebook flakiness
  /graph\.facebook\.com/i,
  // Facebook blocked
  /connect\.facebook\.net\/en_US\/all\.js/i,
  // Woopra flakiness
  /eatdifferent\.com\.woopra-ns\.com/i,
  /static\.woopra\.com\/js\/woopra\.js/i,
  // Chrome extensions
  /extensions\//i,
  /^chrome:\/\//i,
  // Other plugins
  /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
  /webappstoolbarba\.texthelp\.com\//i,
  /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
  /\.ru/i,
]

const newsela = {
  clientId:
    process.env
      .REACT_APP_NEWSELA_CLIENT_ID /* || 'Yhp2a64VmxXwRLblLtP64L1WN4JvVRIDG9iVWD3o' */,
  clientSecretKey:
    process.env
      .REACT_APP_NEWSELA_CLIENT_SECRET_KEY /* ||
    'O7iTrqLfiqJMpoWBPnn8fZ5VzmXYULi67q2hmw0LMJ9Tj6FSo2YU0r6dAQQMsIgD7wwskLV1KPE6VweMlrchKlc7urvxBf6kO2eZsOftmYRzj10x8QEufHbMdgWsm8kH' */,
  authUrl:
    process.env
      .REACT_APP_NEWSELA_AUTH_URL /* || 'https://edulastic-sso.newsela.com/oauth' */,
  redirectUrl:
    process.env
      .REACT_APP_NEWSELA_REDIRECT_URI /* ||
    'https://edulasticv2-dryrun.snapwiz.net/auth/newsela' */,
  identityUrl:
    process.env
      .REACT_APP_NEWSELA_IDENTITY_URL /* ||
    'https://edulastic-sso.newsela.com/v1/user/me' */,
  loginUrl:
    process.env
      .REACT_APP_NEWSELA_LOGIN_URL /* ||
    'https://edulastic-sso.newsela.com/oauth/authorize' */,
}

const initEmbeddedServiceCloudWidget = (user) => {
  if (!isChatWidgetEnabled) {
    return
  }

  // ***************** service cloud embedded chat widget snippet
  const initESW = (gslbBaseURL) => {
    window.embedded_svc.settings.displayHelpButton = true // Or false
    window.embedded_svc.settings.language = '' // For example, enter 'en' or 'en-US'

    window.embedded_svc.settings.defaultMinimizedText = ' ' // (Defaults to Chat with an Expert)
    window.embedded_svc.settings.disabledMinimizedText = ' ' // (Defaults to Agent Offline)

    window.embedded_svc.settings.loadingText = ' ' // (Defaults to Loading)
    // window.embedded_svc.settings.storageDomain = 'yourdomain.com'; //(Sets the domain for your deployment so that visitors can navigate subdomains during a chat session)

    // Settings for Chat
    // window.embedded_svc.settings.directToButtonRouting = function(prechatFormData) {
    // Dynamically changes the button ID based on what the visitor enters in the pre-chat form.
    // Returns a valid button ID.
    // };
    // Sets the auto-population of pre-chat form fields
    window.embedded_svc.settings.prepopulatedPrechatFields = {
      FirstName: user.firstName,
      LastName: user.lastName,
      Email: user.email,
      Subject: 'General',
    }
    // window.embedded_svc.settings.fallbackRouting = []; //An array of button IDs, user IDs, or userId_buttonId
    // window.embedded_svc.settings.offlineSupportMinimizedText = '...'; //(Defaults to Contact Us)
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
    const s = document.createElement('script')
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

const getSentryReleaseName = () => {
  return `${appVersion}.edu-fe.${appStage}`
}

export default {
  initEmbeddedServiceCloudWidget,
  sentryIgnoreErrors,
  sentryIgnoreUrls,
  appStage,
  getSentryReleaseName,
  appVersion,
  googleClientSdkUrl,
  googleApiSdkUrl,
  googleCalendarApiVersion,
  sentryURI,
  segmentHashSecret,
  isSegmentEnabled,
  segmentVersion,
  segmentURI,
  cdnURI,
  appEnv,
  sentryWhiteListURLRegex,
  geoGebraPath,
  desmosPath,
  katexPath,
  mathquillPath,
  zwibbler2Path,
  jqueryPath,
  ttsChoicesPath,
  thirdPartyLibPath,
  v1RedirectDecryptSalt,
  eduScientificCalcPath,
  eduScientificCalcJsPath,
  eduScientificCalcCssPath,
  testletMathJax,
  newsela,
}
