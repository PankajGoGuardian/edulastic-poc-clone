// Don't put any sensitive information
const cdnURI = process.env.POI_APP_CDN_URI || "https://cdnedupoc.snapwiz.net/edulasticv2-development";
const appEnv = process.env.POI_APP_ENV;
const thirdPartyLibPath = `${cdnURI}/JS/thirdpartylib`;
const jqueryPath = `${thirdPartyLibPath}/jquery/v1.11.0`;
const mathquillPath = `${thirdPartyLibPath}/mathquill/v0.10.1`;
const katexPath = `${thirdPartyLibPath}/katex/v0.11.1`;
const ttsChoicesPath = `${cdnURI}/tts`;
const desmosPath = `${thirdPartyLibPath}/desmos/v1.2`;
const geoGebraPath = `${thirdPartyLibPath}/geogebra/v5.0`;
const sentryWhiteListURLRegex = appEnv === "production" ? /edulastic\.com/ : /snapwiz\.net/;

const segmentURI = process.env.POI_APP_SEGMENT_URI || `${thirdPartyLibPath}/segmentjs/v4.2.2/analytics.js`;
const segmentVersion = process.env.POI_APP_SEGMENT_VERSION || "4.2.2";
const isSegmentEnabled = process.env.POI_APP_ENABLE_SEGMENT === "true";
const segmentHashSecret = process.env.POI_APP_SEGMENT_HASH_SECRET || "ey4OaPLX2BjSsUqj0NK2Sw3QtHjtzojmfRCeUcDH";

export const firebaseConfig = {
  apiKey: process.env.POI_APP_FIREBASE_API_KEY /*|| "AIzaSyA_2mdY_l-tHgy5LvQigdNmVmqABdx7458" */,
  authDomain: process.env.POI_APP_FIREBASE_AUTH_DOMAIN /*|| "ev2-dev-88215.firebaseapp.com"*/,
  projectId: process.env.POI_APP_FIREBASE_PROJECT_ID /*|| "ev2-dev-88215"*/
};
export default {
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
  jqueryPath,
  ttsChoicesPath,
  thirdPartyLibPath
};
