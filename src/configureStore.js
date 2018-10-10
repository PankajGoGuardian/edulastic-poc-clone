import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import rootReducer from './reducers';
import rootSaga from './sagas';

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

export default () => {
  const store = createStore(
    connectRouter(history)(rootReducer),
    composeWithDevTools(applyMiddleware(routerMiddleware(history), sagaMiddleware)),
  );

  sagaMiddleware.run(rootSaga);
  return store;
};
