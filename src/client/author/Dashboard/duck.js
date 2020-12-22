import { takeEvery, call, put, all } from 'redux-saga/effects'
import { dashboardApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'

const RECEIVE_TEACHER_DASHBOARD_REQUEST =
  '[dashboard teacher] receive data request'
const RECEIVE_TEACHER_DASHBOARD_SUCCESS =
  '[dashboard teacher] receive data success'
const RECEIVE_TEACHER_DASHBOARD_ERROR = '[dashboard teacher] receive data error'
const LAUNCH_HANGOUT_OPEN = '[dashboard teacher] launch hangouts open'
const LAUNCH_HANGOUT_CLOSE = '[dashboard teacher] launch hangouts close'

export const receiveTeacherDashboardAction = createAction(
  RECEIVE_TEACHER_DASHBOARD_REQUEST
)
export const receiveTeacherDashboardSuccessAction = createAction(
  RECEIVE_TEACHER_DASHBOARD_SUCCESS
)
export const receiveTeacherDashboardErrorAction = createAction(
  RECEIVE_TEACHER_DASHBOARD_ERROR
)
export const launchHangoutOpen = createAction(LAUNCH_HANGOUT_OPEN)
export const launchHangoutClose = createAction(LAUNCH_HANGOUT_CLOSE)

export const stateSelector = (state) => state.dashboardTeacher

export const getLaunchHangoutStatus = createSelector(
  stateSelector,
  (state) => state.isLaunchHangoutOpen
)

const initialState = {
  data: [],
  error: null,
  loading: false,
  isLaunchHangoutOpen: false,
}

export const reducer = createReducer(initialState, {
  [RECEIVE_TEACHER_DASHBOARD_REQUEST]: (state) => {
    state.loading = true
  },
  [RECEIVE_TEACHER_DASHBOARD_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.data = payload
  },
  [RECEIVE_TEACHER_DASHBOARD_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [LAUNCH_HANGOUT_OPEN]: (state) => {
    state.isLaunchHangoutOpen = true
  },
  [LAUNCH_HANGOUT_CLOSE]: (state) => {
    state.isLaunchHangoutOpen = false
  },
})

function* receiveTeacherDashboardSaga() {
  try {
    const { classDetails } = yield call(dashboardApi.getTeacherDashboardDetails)
    yield put(receiveTeacherDashboardSuccessAction(classDetails))
  } catch (err) {
    const errorMessage = 'Unable to fetch dashboard details.'
    notification({ type: 'error', msg: errorMessage })
    yield put(receiveTeacherDashboardErrorAction({ error: errorMessage }))
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(
      RECEIVE_TEACHER_DASHBOARD_REQUEST,
      receiveTeacherDashboardSaga
    ),
  ])
}
