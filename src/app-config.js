// Don't put any sensitive information
// https://edupoc.s3.amazonaws.com/edulasticv2-development/JS/thirdpartylib/ev2-scientificcalc/CalcSS3.js
const cdnURI =
  process.env.REACT_APP_CDN_URI ||
  'https://cdnedupoc.snapwiz.net/edulasticv2-development'
const appEnv = process.env.REACT_APP_ENV
const appStage = process.env.REACT_APP_STAGE
// __CLIENT_VERSION__ is injected to envs in poi.config.js
// using it to avoid importing json for just version
const appVersion = process.env.__CLIENT_VERSION__ || 'NA'
const thirdPartyLibPath = `${cdnURI}/JS/thirdpartylib`
const jqueryPath = `${thirdPartyLibPath}/jquery/v1.11.0`
const mathquillPath = `${thirdPartyLibPath}/mathquill/v0.10.1`
const zwibbler2Path = `${thirdPartyLibPath}/zwibbler/v2`
const katexPath = `${thirdPartyLibPath}/katex/v0.11.1`
const ttsChoicesPath = `${cdnURI}/tts`
const desmosPath = `${thirdPartyLibPath}/desmos/v1.2`
const geoGebraPath = `${thirdPartyLibPath}/geogebra/v5.0`
const sentryWhiteListURLRegex = /edulastic\.com|snapwiz\.net/
const eduScientificCalcPath = `${thirdPartyLibPath}/ev2-scientificcalc`
const testletMathJax =
  'https://ws-preview.nextera.questarai.com/libs/NexteraMathJax.2.7.5/MathJax.js?config=MML_HTMLorMML-full.js'

const sentryURI =
  process.env.REACT_APP_SENTRY_DSN || process.env.REACT_APP_SENTRY_URI
const segmentURI =
  process.env.REACT_APP_SEGMENT_URI ||
  `${thirdPartyLibPath}/segmentjs/v4.2.2/analytics.js`
const segmentVersion = process.env.REACT_APP_SEGMENT_VERSION || '4.2.2'
const isSegmentEnabled = process.env.REACT_APP_ENABLE_SEGMENT === 'true'
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
    process.env.REACT_APP_NEWSELA_CLIENT_ID ||
    'Yhp2a64VmxXwRLblLtP64L1WN4JvVRIDG9iVWD3o',
  clientSecretKey:
    process.env.REACT_APP_NEWSELA_CLIENT_SECRET_KEY ||
    'O7iTrqLfiqJMpoWBPnn8fZ5VzmXYULi67q2hmw0LMJ9Tj6FSo2YU0r6dAQQMsIgD7wwskLV1KPE6VweMlrchKlc7urvxBf6kO2eZsOftmYRzj10x8QEufHbMdgWsm8kH',
  authUrl:
    process.env.REACT_APP_NEWSELA_AUTH_URL ||
    'https://edulastic-sso.newsela.com/oauth',
  redirectUrl:
    process.env.REACT_APP_NEWSELA_REDIRECT_URI ||
    'https://edulasticv2-dryrun.snapwiz.net/auth/newsela',
  identityUrl:
    process.env.REACT_APP_NEWSELA_IDENTITY_URL ||
    'https://edulastic-sso.newsela.com/v1/user/me',
  loginUrl:
    process.env.REACT_APP_NEWSELA_LOGIN_URL ||
    'https://edulastic-sso.newsela.com/oauth/authorize',
}

export default {
  sentryIgnoreErrors,
  sentryIgnoreUrls,
  appStage,
  appVersion,
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
  testletMathJax,
  newsela,
}
