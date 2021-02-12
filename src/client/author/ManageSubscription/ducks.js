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
export const getConfirmationModalVisible = createSelector(
  manageSubscriptionSelector,
  (state) => state.showAddUserConfirmationModal
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
  '[mannge-subscriptions] fetch licenseKeys and user details'
const FETCH_MANAGE_SUBSCRIPTIONS_SUCCESS =
  '[mannge-subscriptions] fetch was successful'
const FETCH_MANAGE_SUBSCRIPTIONS_ERROR =
  '[mannge-subscriptions] fetch resulted in error'

// action creators
export const addBulkUsersAdminAction = createAction(ADD_BULK_USERS_REQUEST)
export const addBulkUsersAdminSuccessAction = createAction(
  ADD_BULK_USERS_SUCCESS
)
export const addBulkUsersAdminErrorAction = createAction(ADD_BULK_USERS_ERROR)
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

// initial State
const initialState = {
  loading: false,
  data: {
    result: {},
    totalUsers: 0,
  },
  creating: false,
  bulkUsersData: [],
  showAddUserConfirmationModal: false,
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
    state.showAddUserConfirmationModal = false
  },
  [ADD_BULK_USERS_SUCCESS]: (state, { payload: { res, _bulkTeachers } }) => {
    state.bulkUsersData = res
    state.data.result = { ..._bulkTeachers, ...state.data.result }
    state.data.totalUsers += Object.keys(_bulkTeachers).length
    state.creating = false
    state.showAddUserConfirmationModal = true
  },
  [ADD_BULK_USERS_ERROR]: (state, { payload }) => {
    state.creating = false
    state.addBulkTeacherError = payload.bulkAddError
    state.showAddUserConfirmationModal = false
  },
  [SET_ADD_USERS_CONFIRMATION_MODAL_VISIBLE]: (state, { payload }) => {
    state.showAddUserConfirmationModal = payload
  },
  [FETCH_MANAGE_SUBSCRIPTIONS]: (state) => {
    state.loading = true
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
})

// sagas
function* addBulkUsersAdminSaga({ payload }) {
  try {
    const res = yield call(userApi.adddBulkTeacher, payload.addReq)
    const _bulkTeachers = {}
    res
      .filter((_t) => _t.status == 'SUCCESS')
      .forEach((_o) => {
        const { _id } = _o
        _bulkTeachers[_id] = {
          _id,
          _source: {
            ..._o,
            status: 1,
          },
        }
      })
    yield put(addBulkUsersAdminSuccessAction({ res, _bulkTeachers }))
  } catch (err) {
    captureSentryException(err)
    const errorMessage = 'Unable to add users in bulk.'
    notification({ type: 'error', msg: errorMessage })
    yield put(addBulkUsersAdminErrorAction({ bulkAddError: errorMessage }))
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
    yield takeLatest(ADD_BULK_USERS_REQUEST, addBulkUsersAdminSaga),
    yield takeLatest(FETCH_MANAGE_SUBSCRIPTIONS, fetchManageSubscriptionsSaga),
  ])
}
