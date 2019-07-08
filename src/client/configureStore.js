import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import { createBrowserHistory } from "history";
import { connectRouter, routerMiddleware } from "connected-react-router";
// import { createLogger } from "redux-logger";

import reduxReset from "redux-reset";

import rootReducer from "./reducers";
import rootSaga from "./sagas";

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

const middleware = [sagaMiddleware, routerMiddleware(history)];

/* istanbul ignore next */
if (process.env.NODE_ENV === "development") {
  // middleware.push(createLogger({ collapsed: true }));
}

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
let store;

export default () => {
  store = createStore(
    connectRouter(history)(persistedReducer),
    composeWithDevTools(applyMiddleware(...middleware), reduxReset())
  );

  sagaMiddleware.run(rootSaga);

  if (process.env.NODE_ENV !== "production") {
    if (module.hot) {
      module.hot.accept("./reducers", reducer => {
        store.replaceReducer(reducer);
      });
    }
  }

  const persistor = persistStore(store);
  return { store, persistor };
};

export function getStore() {
  return store;
}
