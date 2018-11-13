import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import i18n, { I18nextProvider } from '@edulastic/localization';
import { ConnectedRouter } from 'connected-react-router';

import 'font-awesome/css/font-awesome.css';
import 'antd/dist/antd.css';
import './index.css';
import App from './App';
import configureStore, { history } from './configureStore';

// redux store
const store = configureStore();

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App assessmentId="5b964cd2162eb42127b2253e" />
      </ConnectedRouter>
    </Provider>
  </I18nextProvider>,

  document.getElementById('react-app'),
);
