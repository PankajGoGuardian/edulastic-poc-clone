import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { takeLatest, call, put, all } from 'redux-saga/effects'
import { groupApi } from '@edulastic/api'
import { captureSentryException, notification } from '@edulastic/common'
import { keyBy } from 'lodash'

const RECEIVE_GROUPLIST_REQUEST = '[group] receive list request'
const RECEIVE_GROUPLIST_SUCCESS = '[group] receive list success'
const RECEIVE_GROUPLIST_ERROR = '[group] receive list error'

/** Actions */
export const receiveGroupListAction = createAction(RECEIVE_GROUPLIST_REQUEST)
export const receiveGroupListSuccessAction = createAction(
  RECEIVE_GROUPLIST_SUCCESS
)
export const receiveGroupListErrorAction = createAction(RECEIVE_GROUPLIST_ERROR)

/** Selectors */
const stateGroupSelector = (state) => state.groupsReducer
export const getGroupListSelector = createSelector(
  stateGroupSelector,
  (state) => state.data
)

/** Reducers */
const initialState = {
  data: {},
  loading: false,
  error: null,
  totalGroupsCount: 0,
}
export const reducer = createReducer(initialState, {
  [RECEIVE_GROUPLIST_REQUEST]: (state) => {
    state.loading = true
  },
  [RECEIVE_GROUPLIST_SUCCESS]: (state, { payload: { hits, total } }) => {
    state.loading = false
    state.data = keyBy(hits, '_id')
    state.totalGroupsCount = total
  },
  [RECEIVE_GROUPLIST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
})

/** Sagas */
function* receiveGroupListSaga({ payload }) {
  try {
    const hits = yield call(groupApi.getGroups, payload)
    yield put(receiveGroupListSuccessAction(hits))
  } catch (err) {
    captureSentryException(err)
    const errorMessage = 'Unable to fetch current group information.'
    notification({ type: 'error', msg: errorMessage })
    yield put(receiveGroupListErrorAction({ error: errorMessage }))
  }
}

export function* watcherSaga() {
  yield all([yield takeLatest(RECEIVE_GROUPLIST_REQUEST, receiveGroupListSaga)])
}
