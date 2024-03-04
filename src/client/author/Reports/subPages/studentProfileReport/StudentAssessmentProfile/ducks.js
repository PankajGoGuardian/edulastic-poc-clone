import { takeLatest, call, put, all } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const GET_REPORTS_STUDENT_ASSESSMENT_PROFILE_REQUEST =
  '[reports] get reports student assessment profile request'
const GET_REPORTS_STUDENT_ASSESSMENT_PROFILE_REQUEST_SUCCESS =
  '[reports] get reports student assessment profile success'
const GET_REPORTS_STUDENT_ASSESSMENT_PROFILE_REQUEST_ERROR =
  '[reports] get reports student assessment profile error'
const RESET_REPORTS_STUDENT_ASSESSMENT_PROFILE =
  '[reports] reset reports student assessment profile'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getStudentAssessmentProfileRequestAction = createAction(
  GET_REPORTS_STUDENT_ASSESSMENT_PROFILE_REQUEST
)
export const resetStudentAssessmentProfileAction = createAction(
  RESET_REPORTS_STUDENT_ASSESSMENT_PROFILE
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportStudentAssessmentProfileReducer

export const getReportsStudentAssessmentProfile = createSelector(
  stateSelector,
  (state) => state.studentAssessmentProfile
)

export const getReportsStudentAssessmentProfileLoader = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getReportsStudentAssessmentProfileError = createSelector(
  stateSelector,
  (state) => state.error
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  studentAssessmentProfile: {},
  loading: false,
}

export const reportStudentAssessmentProfileReducer = createReducer(
  initialState,
  {
    [RESET_ALL_REPORTS]: (state, { payload }) => (state = initialState),
    [RESET_REPORTS_STUDENT_ASSESSMENT_PROFILE]: (state, { payload }) =>
      (state = initialState),
    [GET_REPORTS_STUDENT_ASSESSMENT_PROFILE_REQUEST]: (state, { payload }) => {
      state.loading = true
    },
    [GET_REPORTS_STUDENT_ASSESSMENT_PROFILE_REQUEST_SUCCESS]: (
      state,
      { payload }
    ) => {
      state.loading = false
      state.error = false
      state.studentAssessmentProfile = payload.studentAssessmentProfile
    },
    [GET_REPORTS_STUDENT_ASSESSMENT_PROFILE_REQUEST_ERROR]: (
      state,
      { payload }
    ) => {
      state.loading = false
      state.error = payload.error
    },
  }
)

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsStudentAssessmentProfileRequest({ payload }) {
  try {
    const studentAssessmentProfile = yield call(
      reportsApi.fetchStudentAssessmentProfileReport,
      payload
    )
    const dataSizeExceeded =
      studentAssessmentProfile?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put({
        type: GET_REPORTS_STUDENT_ASSESSMENT_PROFILE_REQUEST_ERROR,
        payload: { error: { ...studentAssessmentProfile.data } },
      })
      return
    }
    yield put({
      type: GET_REPORTS_STUDENT_ASSESSMENT_PROFILE_REQUEST_SUCCESS,
      payload: { studentAssessmentProfile },
    })
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Error getting student assessment profile report data. Please try again after a few minutes.'
    notification({ msg })
    yield put({
      type: GET_REPORTS_STUDENT_ASSESSMENT_PROFILE_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportStudentAssessmentProfileSaga() {
  yield all([
    yield takeLatest(
      GET_REPORTS_STUDENT_ASSESSMENT_PROFILE_REQUEST,
      getReportsStudentAssessmentProfileRequest
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
