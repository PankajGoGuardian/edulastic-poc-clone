import { takeEvery, call, put, all, select } from 'redux-saga/effects'
import { rosterApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'

const RECEIVE_ROSTER_LOG_REQUEST = '[Roster Log] receive data request'
const RECEIVE_ROSTER_LOG_SUCCESS = '[Roster Log] receive data success'

export const receiveRosterLogAction = createAction(RECEIVE_ROSTER_LOG_REQUEST)
export const receiveRosterLogSucessAction = createAction(
  RECEIVE_ROSTER_LOG_SUCCESS
)
const initialState = {
  rosterLog: {},
  rosterStats: {},
  loading: false,
}
export const reducer = createReducer(initialState, {
  [RECEIVE_ROSTER_LOG_REQUEST]: (state) => {
    state.loading = true
  },
  [RECEIVE_ROSTER_LOG_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.rosterImportLog = payload?.rosterImportLog
  },
})

function* receiveRosterLogSaga() {
  try {
    const rosterStatsData = yield call(rosterApi.fetchRosterLogs)
    yield put(receiveRosterLogSucessAction(rosterStatsData))
  } catch (err) {
    const errorMessage = 'Unable to retrieve roster log for the user.'
    notification({ type: 'error', msg: errorMessage })
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_ROSTER_LOG_REQUEST, receiveRosterLogSaga)])
}
