import { put, all, takeEvery } from 'redux-saga/effects'
import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'

const TestData = [
  {
    title: 'Test Title 1',
    markAsRead: false,
    description: 'test description 1',
    seenStatus: false,
    topicType: 'Assignment',
  },
  {
    title: 'Test Title 1',
    markAsRead: false,
    description: 'test description 1',
    seenStatus: true,
    topicType: 'Reports',
  },
  {
    title: 'Test Title 1',
    markAsRead: true,
    description: 'test description 1',
    seenStatus: true,
    topicType: 'Assignment',
  },
]

const RECEIVE_NOTIFICATIONS_REQUEST = '[notifications] receive data request'
const RECEIVE_NOTIFICATIONS_SUCCESS = '[notifications] recieve data success'
const RECEIVE_NOTIFICATIONS_ERROR = '[notifications] recieve data error'

export const receiveNotificationsRequestAction = createAction(
  RECEIVE_NOTIFICATIONS_REQUEST
)
export const receiveNotificationsRequestSuccessAction = createAction(
  RECEIVE_NOTIFICATIONS_SUCCESS
)
export const receiveNotificationsRequestErrorAction = createAction(
  RECEIVE_NOTIFICATIONS_ERROR
)

const initialState = {
  notifications: [],
  loading: false,
  error: null,
}

const stateSelector = (state) => state.notificationsReducer

export const getLoader = createSelector(stateSelector, (state) => state.loading)

export const getError = createSelector(stateSelector, (state) => state.error)

export const getNotificationsList = createSelector(
  stateSelector,
  (state) => state.notifications
)

export const getNotificationsCount = createSelector(
  stateSelector,
  (state) => state.notifications.length || 0
)

export const reducer = createReducer(initialState, {
  [RECEIVE_NOTIFICATIONS_REQUEST]: (state) => {
    state.loading = true
  },
  [RECEIVE_NOTIFICATIONS_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.notifications = payload
  },
  [RECEIVE_NOTIFICATIONS_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
})

function* recieveNotificationsListSaga(notifications) {
  console.log('recieved notifications', notifications)
  try {
    yield put(receiveNotificationsRequestSuccessAction(notifications))
  } catch (err) {
    yield put(
      receiveNotificationsRequestErrorAction({
        error: 'Error while fetching notifications',
      })
    )
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(
      RECEIVE_NOTIFICATIONS_REQUEST,
      recieveNotificationsListSaga
    ),
  ])
}
