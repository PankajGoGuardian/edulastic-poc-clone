import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import i18n, { I18nextProvider } from "@edulastic/localization";
import { ConnectedRouter } from "connected-react-router";

import "font-awesome/css/font-awesome.css";
import "antd/dist/antd.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "./index.css";
import App from "./App";
import configureStore, { history } from "./configureStore";

// redux store
const { store } = configureStore();

const RootComp = () => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App assessmentId="5b964cd2162eb42127b2253e" />
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
