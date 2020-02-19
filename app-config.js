// Don't put any sensitive information
const cdnURI =
  process.env.POI_APP_CDN_URI || "https://cdnedupoc.snapwiz.net/edulasticv2-development";
const appEnv = process.env.POI_APP_ENV;
const thirdPartyLibPath = `${cdnURI}/JS/thirdpartylib`;
const jqueryPath = `${thirdPartyLibPath}/jquery/v1.11.0`;
const mathquillPath = `${thirdPartyLibPath}/mathquill/v0.10.1`;
const katexPath = `${thirdPartyLibPath}/katex/v0.11.1`;
const ttsChoicesPath = `${cdnURI}/tts`;
const desmosPath = `${thirdPartyLibPath}/desmos/v1.2`;
const geoGebraPath = `${thirdPartyLibPath}/geogebra/v5.0`;
const sentryWhiteListURLRegex = appEnv === "production" ? /edulastic\.com/ : /snapwiz\.net/;

export default {
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
