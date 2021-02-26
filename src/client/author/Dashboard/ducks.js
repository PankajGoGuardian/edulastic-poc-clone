import { takeEvery, call, put, all, select } from 'redux-saga/effects'
import { dashboardApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import configurableTilesApi from '@edulastic/api/src/configurableTiles'

const RECEIVE_TEACHER_DASHBOARD_REQUEST =
  '[dashboard teacher] receive data request'
const RECEIVE_TEACHER_DASHBOARD_SUCCESS =
  '[dashboard teacher] receive data success'
const RECEIVE_TEACHER_DASHBOARD_ERROR = '[dashboard teacher] receive data error'
const LAUNCH_HANGOUT_OPEN = '[dashboard teacher] launch hangouts open'
const LAUNCH_HANGOUT_CLOSE = '[dashboard teacher] launch hangouts close'

const FETCH_DASHBOARD_TILES = '[dashboard teacher] fetch tiles data'
const SET_DASHBOARD_TILES = '[dashboard teacher] set tiles data'
const SET_TRIAL = '[dashboard teacher] set trial'

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

export const fetchDashboardTiles = createAction(FETCH_DASHBOARD_TILES)
export const setDashboardTiles = createAction(SET_DASHBOARD_TILES)

export const setTrial = createAction(SET_TRIAL)
export const stateSelector = (state) => state.dashboardTeacher

export const getLaunchHangoutStatus = createSelector(
  stateSelector,
  (state) => state.isLaunchHangoutOpen
)
export const getDashboardTilesSelector = createSelector(
  stateSelector,
  (state) => state.configurableTiles
)

const initialState = {
  data: [],
  error: null,
  loading: false,
  isLaunchHangoutOpen: false,
  isAddingTrial: false,
  configurableTiles: JSON.parse(
    localStorage.getItem('author:dashboard:tiles') || '[]'
  ),
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
  [SET_DASHBOARD_TILES]: (state, { payload }) => {
    state.configurableTiles = payload
  },
  [SET_TRIAL]: (state, { payload }) => {
    state.isAddingTrial = payload
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

function* fetchDashboardTilesSaga() {
  try {
    const version = localStorage.getItem('author:dashboard:version')
    const state = yield select(
      (s) => s.user.user?.orgData?.districts?.[0]?.districtState || ''
    )
    const result = yield call(
      configurableTilesApi.fetchTiles,
      +version,
      state.toUpperCase()
    )
    if (!version || version !== result.version) {
      yield put(setDashboardTiles(result.data))
      localStorage.setItem(
        'author:dashboard:tiles',
        JSON.stringify(result.data)
      )
      localStorage.setItem('author:dashboard:version', +result.version)
    }
  } catch (err) {
    console.log(err)
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
    yield takeEvery(FETCH_DASHBOARD_TILES, fetchDashboardTilesSaga),
  ])
}
