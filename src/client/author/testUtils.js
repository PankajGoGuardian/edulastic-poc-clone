import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'
import { ConnectedRouter } from 'connected-react-router'
import configureStore from '../configureStore'

function reduxWrapper(
  initialState,
  store = configureStore(initialState).store
) {
  return function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>
  }
}

function routerWrapper(history = createMemoryHistory()) {
  return function Wrapper({ children }) {
    return <ConnectedRouter history={history}>{children}</ConnectedRouter>
  }
}

export function reduxRender(
  ui,
  { initialState, store, ...renderOptions } = {}
) {
  return render(ui, {
    wrapper: reduxWrapper(initialState, store),
    ...renderOptions,
  })
}

export function routerRender(ui, { history, ...renderOptions } = {}) {
  return render(ui, { wrapper: routerWrapper(history), ...renderOptions })
}

export function appRender(
  ui,
  { initialState, store, history, ...renderOptions } = {}
) {
  const _reduxWrapper = reduxWrapper(initialState, store)
  const _routerWrapper = routerWrapper(history)
  function wrapper({ children }) {
    return _reduxWrapper({
      children: _routerWrapper({
        children,
      }),
    })
  }
  return render(ui, {
    wrapper,
    ...renderOptions,
  })
}
