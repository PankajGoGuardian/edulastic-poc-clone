import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'font-awesome/css/font-awesome.css';
import './normalize.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './configureStore';

// redux store
const store = configureStore();

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App assessmentId="5b964cd2162eb42127b2253e" />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root'),
);

registerServiceWorker();
