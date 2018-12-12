import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createLogger } from 'redux-logger';

import rootReducer from './reducers';
import rootSaga from './sagas';

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'items',
    'itemDetail',
    'question',
    'reports',
    'studentTest',
    'test',
    'tests',
    'testItem',
    'testItems',
    'user'
  ]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [
  sagaMiddleware,
  routerMiddleware(history)
];

/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  middleware.push(createLogger({ collapsed: true }));
}

export default () => {
  const store = createStore(
    connectRouter(history)(persistedReducer),
    composeWithDevTools(applyMiddleware(...middleware)),
  );

  const persistor = persistStore(store);

  if (module.hot) {
    module.hot.accept('reducers', () => {
      // eslint-disable-next-line
      store.replaceReducer(require('reducers').default);
    });
  }

  sagaMiddleware.run(rootSaga);
  return { store, persistor };
};
