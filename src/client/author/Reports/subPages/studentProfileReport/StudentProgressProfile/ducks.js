import { takeLatest, call, put, all } from 'redux-saga/effects'
import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createSelector } from 'reselect'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const GET_REPORTS_STUDENT_PROGRESS_PROFILE_REQUEST =
  '[reports] get reports student progress profile request'
const GET_REPORTS_STUDENT_PROGRESS_PROFILE_REQUEST_SUCCESS =
  '[reports] get reports student progress profile success'
const GET_REPORTS_STUDENT_PROGRESS_PROFILE_REQUEST_ERROR =
  '[reports] get reports student progress profile error'
  const RESET_REPORTS_STUDENT_PROGRESS_PROFILE = '[reports] reset reports student progress profile'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getStudentProgressProfileRequestACtion = createAction(
  GET_REPORTS_STUDENT_PROGRESS_PROFILE_REQUEST
)
export const resetStudentProgressProfileAction = createAction(
  RESET_REPORTS_STUDENT_PROGRESS_PROFILE
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportStudentProgressProfileReducer

export const getReportsStudentProgressProfile = createSelector(
  stateSelector,
  (state) => state.studentProgressProfile
)

export const getReportsStudentProgressProfileLoader = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getReportsStudentProgressProfileError = createSelector(
  stateSelector,
  (state) => state.error
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  studentProgressProfile: {},
  loading: false,
}

export const reportStudentProgressProfileReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state, { payload }) => (state = initialState),
  [RESET_REPORTS_STUDENT_PROGRESS_PROFILE]: (state, { payload }) => (state = initialState),
  [GET_REPORTS_STUDENT_PROGRESS_PROFILE_REQUEST]: (state) => {
    state.loading = true
  },
  [GET_REPORTS_STUDENT_PROGRESS_PROFILE_REQUEST_SUCCESS]: (
    state,
    { payload }
  ) => {
    state.loading = false
    state.error = false
    state.studentProgressProfile = payload.studentProgressProfile
  },
  [GET_REPORTS_STUDENT_PROGRESS_PROFILE_REQUEST_ERROR]: (
    state,
    { payload }
  ) => {
    state.loading = false
    state.error = payload.error
  },
})

// -----|-----|-----|-----| REDUCER ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsStudentProgressProfileRequest({ payload }) {
  try {
    const studentProgressProfile = yield call(
      reportsApi.fetchStudentProgressProfileReport,
      payload
    )
    const dataSizeExceeded =
      studentProgressProfile?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put({
        type: GET_REPORTS_STUDENT_PROGRESS_PROFILE_REQUEST_ERROR,
        payload: { error: { ...studentProgressProfile.data } },
      })
      return
    }
    yield put({
      type: GET_REPORTS_STUDENT_PROGRESS_PROFILE_REQUEST_SUCCESS,
      payload: { studentProgressProfile },
    })
  } catch (error) {
    console.log('err', error.stack)
    const msg = 'Failed to fetch student progress profile Please try again...'
    notification({ msg })
    yield put({
      type: GET_REPORTS_STUDENT_PROGRESS_PROFILE_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportStudentProgressProfileSaga() {
  yield all([
    yield takeLatest(
      GET_REPORTS_STUDENT_PROGRESS_PROFILE_REQUEST,
      getReportsStudentProgressProfileRequest
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
