/* eslint-disable no-template-curly-in-string */
import { manageSubscriptionsApi, userApi } from '@edulastic/api'
import { captureSentryException, notification } from '@edulastic/common'
import { takeLatest } from 'redux-saga'
import { all, call, put } from 'redux-saga/effects'
import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'

// selectors
const manageSubscriptionSelector = (state) => state.manageSubscription
export const getSubsLicensesSelector = createSelector(
  manageSubscriptionSelector,
  (state) => state.licenses
)
export const getUpgradeSuccessModalVisible = createSelector(
  manageSubscriptionSelector,
  (state) => state.showUpgradeUsersSuccessModal
)
export const getBulkUsersData = createSelector(
  manageSubscriptionSelector,
  (state) => state.bulkUsersData
)
export const getUsersSelector = createSelector(
  manageSubscriptionSelector,
  (state) => state.users
)
export const getLoadingStateSelector = createSelector(
  manageSubscriptionSelector,
  (state) => state.loading
)

// action types
export const SET_LICENSES_DATA =
  '[manageSubscriptions] set manage subscriptions license data'

const ADD_BULK_USERS_REQUEST = '[users] add bulk users request'
const ADD_BULK_USERS_SUCCESS = '[users] add bulk users success'
const ADD_BULK_USERS_ERROR = '[users] add bulk users error'
const SET_ADD_USERS_CONFIRMATION_MODAL_VISIBLE =
  '[users] set add users confirmation modal visible'
const FETCH_MANAGE_SUBSCRIPTIONS =
  '[manage-subscriptions] fetch licenseKeys and user details'
const FETCH_MANAGE_SUBSCRIPTIONS_SUCCESS =
  '[manage-subscriptions] fetch was successful'
const FETCH_MANAGE_SUBSCRIPTIONS_ERROR =
  '[manage-subscriptions] fetch resulted in error'
const UPGRADE_USERS_SUBSCRIPTIONS_SUCCESS =
  '[manage-subscriptions] upgrade users by selected licenses - success'
const UPGRADE_USERS_SUBSCRIPTIONS_ERROR =
  '[manage-subscriptions] upgrade users by selected licenses - failed'

// action creators
export const addAndUpgradeUsersAction = createAction(ADD_BULK_USERS_REQUEST)
export const addAndUpgradeUsersSuccessAction = createAction(
  ADD_BULK_USERS_SUCCESS
)
export const addAndUpgradeUsersErrorAction = createAction(ADD_BULK_USERS_ERROR)
export const setAddUserConfirmationModalVisibleAction = createAction(
  SET_ADD_USERS_CONFIRMATION_MODAL_VISIBLE
)
export const fetchMultipleSubscriptionsAction = createAction(
  FETCH_MANAGE_SUBSCRIPTIONS
)
export const fetchManageSubscriptionsSuccessAction = createAction(
  FETCH_MANAGE_SUBSCRIPTIONS_SUCCESS
)
export const fetchManageSubscriptionsErrorAction = createAction(
  FETCH_MANAGE_SUBSCRIPTIONS_ERROR
)
export const upgradeUsersSubscriptionsSuccessAction = createAction(
  UPGRADE_USERS_SUBSCRIPTIONS_SUCCESS
)
export const upgradeUsersSubscriptionsErrorAction = createAction(
  UPGRADE_USERS_SUBSCRIPTIONS_ERROR
)

// initial State
const initialState = {
  loading: false,
  data: {
    result: {},
    totalUsers: 0,
  },
  creating: false,
  bulkUsersData: [],
  showUpgradeUsersSuccessModal: false,
  licenses: [],
  users: [],
}

const setLicensesData = (state, { payload }) => {
  state.licenses = payload
}

// main reducer
export const reducer = createReducer(initialState, {
  [SET_LICENSES_DATA]: setLicensesData,
  [ADD_BULK_USERS_REQUEST]: (state) => {
    state.creating = true
    state.showUpgradeUsersSuccessModal = false
  },
  [ADD_BULK_USERS_SUCCESS]: (state, { payload }) => {
    state.bulkUsersData = payload
    state.creating = false
    state.showUpgradeUsersSuccessModal = true
  },
  [ADD_BULK_USERS_ERROR]: (state, { payload }) => {
    state.creating = false
    state.addBulkTeacherError = payload.bulkAddError
    state.showUpgradeUsersSuccessModal = false
  },
  [SET_ADD_USERS_CONFIRMATION_MODAL_VISIBLE]: (state, { payload }) => {
    state.showUpgradeUsersSuccessModal = payload
  },
  [FETCH_MANAGE_SUBSCRIPTIONS]: (state, { payload }) => {
    state.loading = !payload?.fetchInBackground
  },
  [FETCH_MANAGE_SUBSCRIPTIONS_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.licenses = payload.licenses
    state.users = payload.users
  },
  [FETCH_MANAGE_SUBSCRIPTIONS_ERROR]: (state) => {
    state.loading = false
    state.licenses = []
    state.users = []
  },
  [UPGRADE_USERS_SUBSCRIPTIONS_SUCCESS]: (state, { payload }) => {
    state.bulkUsersData = payload
    state.showUpgradeUsersSuccessModal = true
  },
  [UPGRADE_USERS_SUBSCRIPTIONS_ERROR]: (state) => {
    state.showUpgradeUsersSuccessModal = false
  },
})

// sagas
function* addBulkUsersAndUpgradeSaga({ payload }) {
  try {
    const { addUsersPayload, licenses } = payload
    const res = yield call(userApi.adddBulkTeacher, addUsersPayload) || []
    if (!(licenses || []).length) {
      yield put(addAndUpgradeUsersSuccessAction(res))
      return
    }

    const users = res.map((x) => x._id)
    const result = yield call(
      manageSubscriptionsApi.upgradeUsersSubscriptions,
      {
        users,
        licenses,
      }
    ) || {}
    if (Object.keys(result).length) {
      for (const user of res) {
        result[user._id] = {
          ...result[user._id],
          username: user.username,
          status: user.status,
        }
      }
      yield put(upgradeUsersSubscriptionsSuccessAction(Object.values(result)))
      yield put(fetchMultipleSubscriptionsAction({ fetchInBackground: true }))
    }
  } catch (err) {
    captureSentryException(err)
    const errorMessage =
      err?.response?.data?.message || 'Unable to add or upgrade users in bulk.'
    notification({ type: 'error', msg: errorMessage })
    yield put(addAndUpgradeUsersErrorAction({ bulkAddError: errorMessage }))
  }
}

function* fetchManageSubscriptionsSaga() {
  try {
    const result = yield call(manageSubscriptionsApi.fetchLicenses)
    yield put(fetchManageSubscriptionsSuccessAction(result))
  } catch (err) {
    captureSentryException(err)
    notification({
      type: 'error',
      msg: 'Unable to fetch user(s) subscription data.',
    })
    yield put(fetchManageSubscriptionsErrorAction())
  }
}

// watcher saga
export function* watcherSaga() {
  yield all([
    yield takeLatest(ADD_BULK_USERS_REQUEST, addBulkUsersAndUpgradeSaga),
    yield takeLatest(FETCH_MANAGE_SUBSCRIPTIONS, fetchManageSubscriptionsSaga),
  ])
}
