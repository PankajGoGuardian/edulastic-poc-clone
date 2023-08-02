import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import * as Sentry from '@sentry/browser'
import reduxReset from 'redux-reset'

import { getUserConfirmation } from './common/utils/helpers'

import rootReducer from './reducers'
import rootSaga from './sagas'

export const history = createBrowserHistory({ getUserConfirmation })

const sagaMiddleware = createSagaMiddleware({
  onError(error) {
    // treat the errors of the sagas here
    Sentry.captureException(error)
  },
})

const middleware = [sagaMiddleware, routerMiddleware(history)]

// /* istanbul ignore next */
// if (process.env.NODE_ENV === 'development') {
//   // enable redux-freeze
//   const reduxFreeze = require('redux-freeze') // eslint-disable-line global-require
//   middleware.push(reduxFreeze)
// }

let store

const composeEnhancers =
  // process.env.NODE_ENV === 'development' &&
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        trace: true,
        traceLimit: 30,
      })
    : compose

export default (initialState = {}, reducer = rootReducer, saga = rootSaga) => {
  store = createStore(
    connectRouter(history)(reducer),
    initialState,
    /**
     * to enable trace
     * composeWithDevTools({ trace: true, traceLimit: 15 })
     * (applyMiddleware(...middleware), reduxReset())
     */

    composeEnhancers(applyMiddleware(...middleware), reduxReset())
  )

  sagaMiddleware.run(saga)

  return { store }
}

export function getStore() {
  return store
}
/**
 * simplest way to make store accessible outside react components.
 * Particularly to one of the packages.
 * Since store is anyway global, we can export it to window.
 */
window.getStore = getStore
