import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import i18n, { I18nextProvider } from "@edulastic/localization";
import { ConnectedRouter } from "connected-react-router";
// will import all features.. optimize.!
import "core-js/features/array";
import "core-js/features/object";
import "font-awesome/css/font-awesome.css";
import "antd/dist/antd.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "./index.css";
import App from "./App";
import configureStore, { history } from "./configureStore";

// TODO: conditionally include polyfills either using polyfill.app or await :)
/**
 * if (!("scrollBehavior" in document.documentElement.style)) {
    await import("scroll-behavior-polyfill");
 */
import "scroll-behavior-polyfill";

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
