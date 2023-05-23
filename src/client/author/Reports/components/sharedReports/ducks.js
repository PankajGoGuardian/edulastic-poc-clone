import { createSelector } from 'reselect'
import { createAction, createReducer } from 'redux-starter-kit'
import { all, call, select, put, takeLatest } from 'redux-saga/effects'

import { collaborationApi, sharedReportApi } from '@edulastic/api'
import { notification } from '@edulastic/common'

const GET_SHARED_REPORTS_REQUEST = '[reports] get shared reports request'
const GET_SHARED_REPORTS_REQUEST_SUCCESS =
  '[reports] get shared reports request success'
const GET_SHARED_REPORTS_REQUEST_ERROR =
  '[reports] get shared reports request error'

const GET_COLLABORATIVE_GROUPS_REQUEST =
  '[reports] get collaborative groups request'
const GET_COLLABORATIVE_GROUPS_REQUEST_SUCCESS =
  '[reports] get collaborative groups request success'
const GET_COLLABORATIVE_GROUPS_REQUEST_ERROR =
  '[reports] get collaborative groups request error'

const SHARE_REPORT_REQUEST = '[reports] share report request'
const SHARE_REPORT_REQUEST_SUCCESS = '[reports] share report request success'
const SHARE_REPORT_REQUEST_ERROR = '[reports] share report request error'

const ARCHIVE_REPORT_REQUEST = '[reports] archive report request'
const ARCHIVE_REPORT_REQUEST_SUCCESS =
  '[reports] archive report request success'
const ARCHIVE_REPORT_REQUEST_ERROR = '[reports] archive report request error'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getSharedReportsAction = createAction(GET_SHARED_REPORTS_REQUEST)
export const getCollaborativeGroupsAction = createAction(
  GET_COLLABORATIVE_GROUPS_REQUEST
)
export const shareReportAction = createAction(SHARE_REPORT_REQUEST)
export const archiveReportAction = createAction(ARCHIVE_REPORT_REQUEST)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) => state.reportReducer.sharedReportsReducer

export const getSharedReportsLoader = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getSharedReportList = createSelector(
  stateSelector,
  (state) => state.sharedReportList
)

export const getCollaborativeGroupsLoader = createSelector(
  stateSelector,
  (state) => state.loadingCollaborativeGroups
)

export const getCollaborativeGroupList = createSelector(
  stateSelector,
  (state) => state.collaborativeGroupList
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  sharedReportList: [],
  loading: true,
  collaborativeGroupList: [],
  loadingCollaborativeGroups: false,
}

export const sharedReportsReducer = createReducer(initialState, {
  [GET_SHARED_REPORTS_REQUEST]: (state) => {
    state.loading = true
  },
  [GET_SHARED_REPORTS_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.sharedReportList = payload
  },
  [GET_SHARED_REPORTS_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [GET_COLLABORATIVE_GROUPS_REQUEST]: (state) => {
    state.loadingCollaborativeGroups = true
  },
  [GET_COLLABORATIVE_GROUPS_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loadingCollaborativeGroups = false
    state.collaborativeGroupList = payload
  },
  [GET_COLLABORATIVE_GROUPS_REQUEST_ERROR]: (state, { payload }) => {
    state.loadingCollaborativeGroups = false
    state.error = payload.error
  },
  [SHARE_REPORT_REQUEST_SUCCESS]: (state, { payload }) => {
    state.sharedReportList = payload
  },
  [SHARE_REPORT_REQUEST_ERROR]: (state, { payload }) => {
    state.error = payload.error
  },
  [ARCHIVE_REPORT_REQUEST_SUCCESS]: (state, { payload }) => {
    state.sharedReportList = payload
  },
  [ARCHIVE_REPORT_REQUEST_ERROR]: (state, { payload }) => {
    state.loadingCollaborativeGroups = false
    state.error = payload.error
  },
})

// -----|-----|-----|-----| REDUCER ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

export function* getSharedReportsRequest({ payload }) {
  try {
    const sharedReportList = yield call(
      sharedReportApi.getSharedReports,
      payload
    )
    yield put({
      type: GET_SHARED_REPORTS_REQUEST_SUCCESS,
      payload: sharedReportList,
    })
  } catch (error) {
    const msg = 'Error getting shared reports data'
    notification({ msg })
    yield put({
      type: GET_SHARED_REPORTS_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

function* getCollaborativeGroupsRequest() {
  try {
    const { result: collaborativeGroupList } = yield call(
      collaborationApi.fetchGroups
    )
    yield put({
      type: GET_COLLABORATIVE_GROUPS_REQUEST_SUCCESS,
      payload: collaborativeGroupList,
    })
  } catch (err) {
    const msg = 'Error getting collaboration groups'
    notification({ msg })
    yield put({
      type: GET_COLLABORATIVE_GROUPS_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

function* shareReportSaga({ payload }) {
  try {
    const sharedReport = yield call(sharedReportApi.createSharedReport, payload)
    if (sharedReport?._id) {
      // add newly shared report to shared report list
      const sharedReportList = yield select(getSharedReportList)
      yield put({
        type: SHARE_REPORT_REQUEST_SUCCESS,
        payload: [sharedReport, ...sharedReportList],
      })
    }
    notification({
      type: 'success',
      msg: 'Shared report successfully',
    })
  } catch (err) {
    const msg = 'Failed to share report'
    notification({ msg })
    yield put({
      type: SHARE_REPORT_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

function* archiveReportSaga({ payload }) {
  try {
    const result = yield call(sharedReportApi.archiveSharedReport, payload)
    if (result && payload?.id) {
      // remove archived report from shared report list
      const sharedReportList = yield select(getSharedReportList)
      const filteredList = sharedReportList.filter(
        (report) => report._id !== payload.id
      )
      yield put({
        type: ARCHIVE_REPORT_REQUEST_SUCCESS,
        payload: filteredList,
      })
    }
    notification({
      type: 'success',
      msg: 'Archived report successfully',
    })
  } catch (err) {
    const msg = 'Failed to archive report'
    notification({ msg })
    yield put({
      type: ARCHIVE_REPORT_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* sharedReportsSaga() {
  yield all([
    yield takeLatest(GET_SHARED_REPORTS_REQUEST, getSharedReportsRequest),
    yield takeLatest(
      GET_COLLABORATIVE_GROUPS_REQUEST,
      getCollaborativeGroupsRequest
    ),
    yield takeLatest(SHARE_REPORT_REQUEST, shareReportSaga),
    yield takeLatest(ARCHIVE_REPORT_REQUEST, archiveReportSaga),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
