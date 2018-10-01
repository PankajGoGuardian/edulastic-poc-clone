import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import i18n, { I18nextProvider } from '@edulastic/localization';

import 'font-awesome/css/font-awesome.css';
import './index.css';
import App from './App';
import configureStore from './configureStore';

// redux store
const store = configureStore();

ReactDOM.render(
  <BrowserRouter>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <App assessmentId="5b964cd2162eb42127b2253e" />
      </Provider>
    </I18nextProvider>
  </BrowserRouter>,

  document.getElementById('root'),
);
