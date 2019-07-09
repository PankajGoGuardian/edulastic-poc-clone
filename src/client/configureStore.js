import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import { createBrowserHistory } from "history";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createLogger } from "redux-logger";

import reduxReset from "redux-reset";

import rootReducer from "./reducers";
import rootSaga from "./sagas";

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

const middleware = [sagaMiddleware, routerMiddleware(history)];

/* istanbul ignore next */
if (process.env.NODE_ENV === "development") {
  middleware.push(createLogger({ collapsed: true }));
}

let store;

export default () => {
  store = createStore(
    connectRouter(history)(rootReducer),
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

  return { store };
};

export function getStore() {
  return store;
}
