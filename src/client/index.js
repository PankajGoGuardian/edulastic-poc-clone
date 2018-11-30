import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import i18n, { I18nextProvider } from '@edulastic/localization';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';

import 'font-awesome/css/font-awesome.css';
import 'antd/dist/antd.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './index.css';
import App from './App';
import configureStore, { history } from './configureStore';

// redux store
const { store, persistor } = configureStore();

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <PersistGate
          loading={null}
          persistor={persistor}
        >
          <App assessmentId="5b964cd2162eb42127b2253e" />
        </PersistGate>
      </ConnectedRouter>
    </Provider>
  </I18nextProvider>,

  document.getElementById('react-app'),
);
