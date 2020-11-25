import { createSelector } from 'reselect'
import { createAction, createReducer } from 'redux-starter-kit'
import { all, call, put, takeLatest } from 'redux-saga/effects'

import { collaborationApi, sharedReportApi } from '@edulastic/api'
import { notification } from '@edulastic/common'

const GET_SHARED_REPORTS_REQUEST = '[reports] get shared reports request'
const GET_SHARED_REPORTS_REQUEST_SUCCESS =
  '[reports] get shared reports request success'
const GET_SHARED_REPORTS_REQUEST_ERROR =
  '[reports] get shared reports request error'

const GET_TEACHER_GROUPS_REQUEST = '[reports] get teacher groups request'
const GET_TEACHER_GROUPS_REQUEST_SUCCESS =
  '[reports] get teacher groups request success'
const GET_TEACHER_GROUPS_REQUEST_ERROR =
  '[reports] get teacher groups request error'

const SHARE_REPORT_REQUEST = '[reports] share report request'
// const SHARE_REPORT_REQUEST_SUCCESS = '[reports] share report request success'
// const SHARE_REPORT_REQUEST_ERROR = '[reports] share report request error'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getSharedReportsAction = createAction(GET_SHARED_REPORTS_REQUEST)
export const getTeacherGroupsAction = createAction(GET_TEACHER_GROUPS_REQUEST)
export const shareReportAction = createAction(SHARE_REPORT_REQUEST)

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

export const getTeacherGroupsLoader = createSelector(
  stateSelector,
  (state) => state.loadingTeacherGroups
)

export const getTeacherGroupList = createSelector(
  stateSelector,
  (state) => state.teacherGroupList
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  sharedReportList: [],
  loading: false,
  teacherGroupList: [],
  loadingTeacherGroups: false,
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
  [GET_TEACHER_GROUPS_REQUEST]: (state) => {
    state.loadingTeacherGroups = true
  },
  [GET_TEACHER_GROUPS_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loadingTeacherGroups = false
    state.teacherGroupList = payload
  },
  [GET_TEACHER_GROUPS_REQUEST_ERROR]: (state, { payload }) => {
    state.loadingTeacherGroups = false
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
    const msg = 'Failed to fetch shared reports'
    notification({ msg })
    yield put({
      type: GET_SHARED_REPORTS_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

function* getTeacherGroupsRequest() {
  try {
    const { result: teacherGroupList } = yield call(
      collaborationApi.fetchGroups
    )
    yield put({
      type: GET_TEACHER_GROUPS_REQUEST_SUCCESS,
      payload: teacherGroupList,
    })
  } catch (err) {
    const msg = 'Failed to fetch collaboration groups'
    notification({ msg })
    yield put({
      type: GET_TEACHER_GROUPS_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

function* shareReportSaga({ payload }) {
  try {
    yield call(sharedReportApi.createSharedReport, payload)
    notification({
      type: 'success',
      msg: 'Shared report successfully',
    })
  } catch (err) {
    notification({ msg: 'Failed to share report' })
  }
}

export function* sharedReportsSaga() {
  yield all([
    yield takeLatest(GET_SHARED_REPORTS_REQUEST, getSharedReportsRequest),
    yield takeLatest(GET_TEACHER_GROUPS_REQUEST, getTeacherGroupsRequest),
    yield takeLatest(SHARE_REPORT_REQUEST, shareReportSaga),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
