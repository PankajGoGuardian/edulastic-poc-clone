import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import { createBrowserHistory } from "history";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createLogger } from "redux-logger";
import * as Sentry from "@sentry/browser";
import reduxReset from "redux-reset";
import { getUserConfirmation } from "./common/utils/helpers";

import rootReducer from "./reducers";
import rootSaga from "./sagas";

export const history = createBrowserHistory({ getUserConfirmation });

const sagaMiddleware = createSagaMiddleware({
  onError(error) {
    // treat the errors of the sagas here
    Sentry.captureException(error);
  }
});

const middleware = [sagaMiddleware, routerMiddleware(history)];

/* istanbul ignore next */
if (process.env.NODE_ENV === "development") {
  middleware.push(createLogger({ collapsed: true }));
}

let store;

export default () => {
  store = createStore(
    connectRouter(history)(rootReducer),
    /**
     * to enable trace
     * composeWithDevTools({ trace: true, traceLimit: 15 })(applyMiddleware(...middleware), reduxReset())
     */

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
/**
 * simplest way to make store accessible outside react components.
 * Particularly to one of the packages.
 * Since store is anyway global, we can export it to window.
 */
window.getStore = getStore;
