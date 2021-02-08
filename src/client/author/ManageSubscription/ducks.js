/* eslint-disable no-template-curly-in-string */
import { all } from 'redux-saga/effects'
import { createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'

// selectors
const manageSubscriptionSelector = (state) => state.manageSubscription
export const getSubsLicenses = createSelector(
  manageSubscriptionSelector,
  (state) => state.licenses
)

// action types
export const SET_LICENSES_DATA =
  '[manageClass] set manage subscriptions license data'

// action creators

// initial State
const initialState = {
  licenses: [
    {
      validEndDate: 'Jun 6, 2021',
      count: 20,
      used: 5,
      product: {
        name: 'Teacher Premium Licenses',
        id: '',
        linkedProductId: '',
        type: 'PREMIUM',
      },
    },
    {
      validEndDate: 'Jun 6, 2021',
      count: 20,
      used: 5,
      product: {
        name: 'SparkMath Licenses',
        id: '',
        linkedProductId: '',
        type: 'ITEM_BANK',
      },
    },
  ],
}

const setLicensesData = (state, { payload }) => {
  state.licenses = payload
}

// main reducer
export const reducer = createReducer(initialState, {
  [SET_LICENSES_DATA]: setLicensesData,
})

// watcher saga
export function* watcherSaga() {
  yield all([])
}
