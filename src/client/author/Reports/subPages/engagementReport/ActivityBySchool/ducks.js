import { takeLatest, call, put, all } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const GET_REPORTS_ACTIVITY_BY_SCHOOL_REQUEST =
  '[reports] get reports activity by school request'
const GET_REPORTS_ACTIVITY_BY_SCHOOL_REQUEST_SUCCESS =
  '[reports] get reports activity by school success'
const GET_REPORTS_ACTIVITY_BY_SCHOOL_REQUEST_ERROR =
  '[reports] get reports activity by school error'
const RESET_REPORTS_ACTIVITY_BY_SCHOOL =
  '[reports] reset reports activity by school'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getActivityBySchoolRequestAction = createAction(
  GET_REPORTS_ACTIVITY_BY_SCHOOL_REQUEST
)
export const resetActivityBySchoolAction = createAction(
  RESET_REPORTS_ACTIVITY_BY_SCHOOL
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportActivityBySchoolReducer

export const getReportsActivityBySchool = createSelector(
  stateSelector,
  (state) => state.activityBySchool
)

export const getReportsActivityBySchoolLoader = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getReportsActivityBySchoolError = createSelector(
  stateSelector,
  (state) => state.error
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  activityBySchool: {},
  loading: false,
}

export const reportActivityBySchoolReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
  [RESET_REPORTS_ACTIVITY_BY_SCHOOL]: (state) => (state = initialState),
  [GET_REPORTS_ACTIVITY_BY_SCHOOL_REQUEST]: (state) => {
    state.loading = true
  },
  [GET_REPORTS_ACTIVITY_BY_SCHOOL_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.error = false
    state.activityBySchool = payload.activityBySchool
  },
  [GET_REPORTS_ACTIVITY_BY_SCHOOL_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsActivityBySchoolRequest({ payload }) {
  try {
    const activityBySchool = yield call(
      reportsApi.fetchActivityBySchool,
      payload
    )
    const dataSizeExceeded = activityBySchool?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put({
        type: GET_REPORTS_ACTIVITY_BY_SCHOOL_REQUEST_ERROR,
        payload: { error: { ...activityBySchool.data } },
      })
      return
    }
    yield put({
      type: GET_REPORTS_ACTIVITY_BY_SCHOOL_REQUEST_SUCCESS,
      payload: { activityBySchool },
    })
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Error getting activity by school report data. Please try again after a few minutes.'

    notification({ msg })
    yield put({
      type: GET_REPORTS_ACTIVITY_BY_SCHOOL_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportActivityBySchoolSaga() {
  yield all([
    yield takeLatest(
      GET_REPORTS_ACTIVITY_BY_SCHOOL_REQUEST,
      getReportsActivityBySchoolRequest
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
