/* eslint-disable no-template-curly-in-string */
import { all } from 'redux-saga/effects'
import { createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'

// selectors
const manageSubscriptionSelector = (state) => state.subscription
export const getSubscriptionDataSelector = createSelector(
  manageSubscriptionSelector,
  (state) => state.subscriptionData
)
export const getSubscriptionSelector = createSelector(
  getSubscriptionDataSelector,
  (state) => state.subscription
)
export const getSuccessSelector = createSelector(
  getSubscriptionDataSelector,
  (state) => state.success
)

// action types

// action creators

// initial State
const initialState = {}

// main reducer
export const reducer = createReducer(initialState, {})

// watcher saga
export function* watcherSaga() {
  yield all([])
}
