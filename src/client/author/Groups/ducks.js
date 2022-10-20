import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { takeLatest, call, put, all } from 'redux-saga/effects'
import { collaborationApi, groupApi } from '@edulastic/api'
import { captureSentryException, notification } from '@edulastic/common'
import { keyBy } from 'lodash'
import { push } from 'connected-react-router'

const RECEIVE_GROUPLIST_REQUEST = '[group] receive list request'
export const RECEIVE_GROUPLIST_SUCCESS = '[group] receive list success'
export const RECEIVE_GROUPLIST_ERROR = '[group] receive list error'

// Fetch Collaboration Groups Action(s)
const FETCH_COLLABORATION_GROUP = '[group] fetch collaboration groups'
const FETCH_COLLABORATION_GROUP_SUCCESS =
  '[group] fetch collaboration group - success'
const FETCH_COLLABORATION_GROUP_ERROR =
  '[group] fetch collaboration group - error'
const CREATE_COLLABORATION_GROUP = '[group] create collaboration group'
const ARCHIVE_COLLABORATION_GROUP = '[group] archive collaboration group'
const RESET_COLLABORATION_GROUP = '[group] reset collaboration group state'

/** Actions */
export const receiveGroupListAction = createAction(RECEIVE_GROUPLIST_REQUEST)
export const receiveGroupListSuccessAction = createAction(
  RECEIVE_GROUPLIST_SUCCESS
)
export const receiveGroupListErrorAction = createAction(RECEIVE_GROUPLIST_ERROR)

// Collaboration Groups Action(s)
export const fetchCollaborationGroupsAction = createAction(
  FETCH_COLLABORATION_GROUP
)
export const fetchCollaborationGroupsSuccessAction = createAction(
  FETCH_COLLABORATION_GROUP_SUCCESS
)
export const fetchCollaborationGroupsErrorAction = createAction(
  FETCH_COLLABORATION_GROUP_ERROR
)

export const createCollaborationGroupAction = createAction(
  CREATE_COLLABORATION_GROUP
)
export const archiveCollaborationGroupAction = createAction(
  ARCHIVE_COLLABORATION_GROUP
)
export const resetCollaborationGroupsAction = createAction(
  RESET_COLLABORATION_GROUP
)

/** Selectors */
const stateGroupSelector = (state) => state.groupsReducer
export const getGroupListSelector = createSelector(
  stateGroupSelector,
  (state) => state.data
)
export const collaborationGroupSelector = createSelector(
  stateGroupSelector,
  (state) => state.collaborationGroupsData
)
export const groupsLoadingSelector = createSelector(
  stateGroupSelector,
  (state) => state.loading
)

/** Reducers */
const initialState = {
  data: {},
  loading: false,
  error: null,
  totalGroupsCount: 0,
  collaborationGroupsData: [],
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
  [FETCH_COLLABORATION_GROUP]: (state) => {
    state.loading = true
  },
  [FETCH_COLLABORATION_GROUP_SUCCESS]: (
    state,
    { payload: { hits, total } }
  ) => {
    state.loading = false
    state.collaborationGroupsData = hits
    state.totalGroupsCount = total
  },
  [FETCH_COLLABORATION_GROUP_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [RESET_COLLABORATION_GROUP]: () => initialState,
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

function* fetchCollaborationGroups() {
  try {
    const hits = yield call(collaborationApi.fetchGroups)
    yield put(
      fetchCollaborationGroupsSuccessAction({
        hits: hits.result,
        total: hits.result.length,
      })
    )
  } catch (err) {
    captureSentryException(err)
    const errorMessage = 'Unable to fetch collaboration group(s).'
    notification({ type: 'error', msg: errorMessage })
    yield put(fetchCollaborationGroupsErrorAction({ error: errorMessage }))
  }
}

function* createCollaborationGroup({ payload }) {
  try {
    const result = yield call(collaborationApi.createGroup, payload) || {}
    notification({
      type: 'success',
      msg: `"${result.name}" collaboration group created successfully`,
    })
    yield put(push(`/author/collaborations/${result._id}`))
  } catch (err) {
    captureSentryException(err)
    notification({
      msg: err.message || 'Unable to create collaboration group.',
    })
  }
}

function* archiveCollaborationGroup({ payload }) {
  try {
    yield call(collaborationApi.archiveGroup, payload.id)
    yield call(fetchCollaborationGroups)
    notification({
      type: 'success',
      msg: `"${payload.name}" collaboration group archived successfully`,
    })
  } catch (err) {
    captureSentryException(err)
    notification({
      type: 'error',
      msg: 'Unable to archive collaboration group.',
    })
  }
}

export function* watcherSaga() {
  yield all([
    yield takeLatest(RECEIVE_GROUPLIST_REQUEST, receiveGroupListSaga),
    yield takeLatest(FETCH_COLLABORATION_GROUP, fetchCollaborationGroups),
    yield takeLatest(CREATE_COLLABORATION_GROUP, createCollaborationGroup),
    yield takeLatest(ARCHIVE_COLLABORATION_GROUP, archiveCollaborationGroup),
  ])
}
