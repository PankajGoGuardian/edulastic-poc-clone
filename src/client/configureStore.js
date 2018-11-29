import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import rootReducer from './reducers';
import rootSaga from './sagas';

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

const middleware = [
  sagaMiddleware,
  routerMiddleware(history),
];

/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  const { createLogger } = require('redux-logger');
  middleware.push(createLogger({ collapsed: true }));
}

export default () => {
  const store = createStore(
    connectRouter(history)(rootReducer),
    composeWithDevTools(applyMiddleware(...middleware)),
  );

  sagaMiddleware.run(rootSaga);
  return store;
};
