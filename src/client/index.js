import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import i18n, { I18nextProvider } from "@edulastic/localization";
import { ConnectedRouter } from "connected-react-router";
import smoothscroll from "smoothscroll-polyfill";
import keyboardEventKeyPolyfill from 'keyboardevent-key-polyfill';
// will import all features.. optimize.!
import "core-js/features/array";
import "core-js/features/object";
import "font-awesome/css/font-awesome.css";
import "antd/dist/antd.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import {init as SentryInit } from "@sentry/browser";
import "./index.css";
import { updateSentryScope } from "@edulastic/api/src/utils/Storage";
import App from "./App";
import configureStore, { history } from "./configureStore";
import AppConfig from "../../app-config";
import { isMobileDevice, isIOS } from "./platform";

if (AppConfig.sentryURI) {
  SentryInit(
    {
      whitelistUrls: [AppConfig.sentryWhiteListURLRegex],
      dsn: AppConfig.sentryURI,
      release: AppConfig.appVersion,
      environment: AppConfig.appStage,
      maxValueLength: 600 // defaults to 250 chars, we will need more info recorded.
    }
  );
  updateSentryScope();
}

if (window.location?.search?.includes("showCLIBanner=1") && !sessionStorage?.cliBannerShown) {
  sessionStorage.cliBannerVisible = true;
}

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

window.isMobileDevice = isMobileDevice();
window.isIOS = isIOS();

keyboardEventKeyPolyfill.polyfill();
smoothscroll.polyfill();

if (AppConfig.isSegmentEnabled) {
  !(function() {
    const analytics = (window.analytics = window.analytics || []);
    if (!analytics.initialize)
      if (analytics.invoked) window.console && console.error && console.error("Segment snippet included twice.");
      else {
        analytics.invoked = !0;
        analytics.methods = [
          "trackSubmit",
          "trackClick",
          "trackLink",
          "trackForm",
          "pageview",
          "identify",
          "reset",
          "group",
          "track",
          "ready",
          "alias",
          "debug",
          "page",
          "once",
          "off",
          "on"
        ];
        analytics.factory = function(t) {
          return function() {
            const e = Array.prototype.slice.call(arguments);
            e.unshift(t);
            analytics.push(e);
            return analytics;
          };
        };
        for (let t = 0; t < analytics.methods.length; t++) {
          const e = analytics.methods[t];
          analytics[e] = analytics.factory(e);
        }
        analytics.load = function(t, e) {
          const n = document.createElement("script");
          n.type = "text/javascript";
          n.async = !0;
          // download the file from by passing the key https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js
          // and upload it to s3
          n.src = AppConfig.segmentURI;
          const a = document.getElementsByTagName("script")[0];
          a.parentNode.insertBefore(n, a);
          analytics._loadOptions = e;
        };
        analytics.SNIPPET_VERSION = AppConfig.segmentVersion;
        analytics.load();
      }
  })();
}

// redux store
const { store } = configureStore();

const RootComp = () => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </I18nextProvider>
);
ReactDOM.render(<RootComp />, document.getElementById("react-app"));
// hmr
if (module.hot) {
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default; // eslint-disable-line global-require
    ReactDOM.render(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <NextApp />
          </ConnectedRouter>
        </Provider>
      </I18nextProvider>,
      document.getElementById("react-app")
    );
  });
}

if (window.Cypress) {
  window.store = store;
}
