import { takeEvery, call, put, all } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const GET_REPORTS_STUDENT_PROGRESS_REQUEST =
  '[reports] get reports student progress request'
const GET_REPORTS_STUDENT_PROGRESS_REQUEST_SUCCESS =
  '[reports] get reports student progress success'
const GET_REPORTS_STUDENT_PROGRESS_REQUEST_ERROR =
  '[reports] get reports student progress error'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getStudentProgressRequestAction = createAction(
  GET_REPORTS_STUDENT_PROGRESS_REQUEST
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportStudentProgressReducer

export const getReportsStudentProgress = createSelector(
  stateSelector,
  (state) => state.studentProgress
)

export const getReportsStudentProgressLoader = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getReportsStudentProgressError = createSelector(
  stateSelector,
  (state) => state.error
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  studentProgress: {},
  loading: true,
}

export const reportStudentProgressReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
  [GET_REPORTS_STUDENT_PROGRESS_REQUEST]: (state) => {
    state.loading = true
  },
  [GET_REPORTS_STUDENT_PROGRESS_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.error = false
    state.studentProgress = payload.studentProgress
  },
  [GET_REPORTS_STUDENT_PROGRESS_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsStudentProgressRequest({ payload }) {
  try {
    const studentProgress = yield call(
      reportsApi.fetchStudentProgressReport,
      payload
    )
    const dataSizeExceeded = studentProgress?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put({
        type: GET_REPORTS_STUDENT_PROGRESS_REQUEST_ERROR,
        payload: { error: { ...studentProgress?.data } },
      })
      return
    }
    yield put({
      type: GET_REPORTS_STUDENT_PROGRESS_REQUEST_SUCCESS,
      payload: { studentProgress },
    })
  } catch (error) {
    console.log('err', error.stack)
    const msg = 'Failed to fetch student progress Please try again...'
    notification({ msg })
    yield put({
      type: GET_REPORTS_STUDENT_PROGRESS_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportStudentProgressSaga() {
  yield all([
    yield takeEvery(
      GET_REPORTS_STUDENT_PROGRESS_REQUEST,
      getReportsStudentProgressRequest
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
