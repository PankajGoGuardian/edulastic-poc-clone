import { takeLatest, call, put, all } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const GET_REPORTS_ACTIVITY_BY_TEACHER_REQUEST =
  '[reports] get reports activity by teacher request'
const GET_REPORTS_ACTIVITY_BY_TEACHER_REQUEST_SUCCESS =
  '[reports] get reports activity by teacher success'
const GET_REPORTS_ACTIVITY_BY_TEACHER_REQUEST_ERROR =
  '[reports] get reports activity by teacher error'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getActivityByTeacherRequestAction = createAction(
  GET_REPORTS_ACTIVITY_BY_TEACHER_REQUEST
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportActivityByTeacherReducer

export const getReportsActivityByTeacher = createSelector(
  stateSelector,
  (state) => state.activityByTeacher
)

export const getReportsActivityByTeacherLoader = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getReportsActivityByTeacherError = createSelector(
  stateSelector,
  (state) => state.error
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  activityByTeacher: {},
  loading: true,
}

export const reportActivityByTeacherReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
  [GET_REPORTS_ACTIVITY_BY_TEACHER_REQUEST]: (state) => {
    state.loading = true
  },
  [GET_REPORTS_ACTIVITY_BY_TEACHER_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.error = false
    state.activityByTeacher = payload.activityByTeacher
  },
  [GET_REPORTS_ACTIVITY_BY_TEACHER_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsActivityByTeacherRequest({ payload }) {
  try {
    const activityByTeacher = yield call(
      reportsApi.fetchActivityByTeacher,
      payload
    )
    const dataSizeExceeded = activityByTeacher?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put({
        type: GET_REPORTS_ACTIVITY_BY_TEACHER_REQUEST_ERROR,
        payload: { error: { ...activityByTeacher.data } },
      })
      return
    }
    yield put({
      type: GET_REPORTS_ACTIVITY_BY_TEACHER_REQUEST_SUCCESS,
      payload: { activityByTeacher },
    })
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Failed to fetch reports activity by teacher. Please try again...'

    notification({ msg })
    yield put({
      type: GET_REPORTS_ACTIVITY_BY_TEACHER_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportActivityByTeacherSaga() {
  yield all([
    yield takeLatest(
      GET_REPORTS_ACTIVITY_BY_TEACHER_REQUEST,
      getReportsActivityByTeacherRequest
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
