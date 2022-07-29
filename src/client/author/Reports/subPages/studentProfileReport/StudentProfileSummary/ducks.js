import { takeLatest, call, put, all } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const GET_REPORTS_STUDENT_PROFILE_SUMMARY_REQUEST =
  '[reports] get reports student profile summary request'
const GET_REPORTS_STUDENT_PROFILE_SUMMARY_REQUEST_SUCCESS =
  '[reports] get reports student profile summary success'
const GET_REPORTS_STUDENT_PROFILE_SUMMARY_REQUEST_ERROR =
  '[reports] get reports student profile summary error'
const RESET_REPORTS_STUDENT_PROFILE_SUMMARY =
  '[reports] reset reports student profile summary'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getStudentProfileSummaryRequestAction = createAction(
  GET_REPORTS_STUDENT_PROFILE_SUMMARY_REQUEST
)
export const resetStudentProfileSummaryAction = createAction(
  RESET_REPORTS_STUDENT_PROFILE_SUMMARY
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportStudentProfileSummaryReducer

export const getReportsStudentProfileSummary = createSelector(
  stateSelector,
  (state) => state.studentProfileSummary
)

export const getReportsStudentProfileSummaryLoader = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getReportsStudentProfileSummaryError = createSelector(
  stateSelector,
  (state) => state.error
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  studentProfileSummary: {},
  loading: false,
}

export const reportStudentProfileSummaryReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state, { payload }) => (state = initialState),
  [RESET_REPORTS_STUDENT_PROFILE_SUMMARY]: (state, { payload }) =>
    (state = initialState),
  [GET_REPORTS_STUDENT_PROFILE_SUMMARY_REQUEST]: (state, { payload }) => {
    state.loading = true
  },
  [GET_REPORTS_STUDENT_PROFILE_SUMMARY_REQUEST_SUCCESS]: (
    state,
    { payload }
  ) => {
    state.loading = false
    state.error = false
    state.studentProfileSummary = payload.studentProfileSummary
  },
  [GET_REPORTS_STUDENT_PROFILE_SUMMARY_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsStudentProfileSummaryRequest({ payload }) {
  try {
    if (payload.fetchLastYearData) {
      payload.termId = payload.lastYearTermId
    }
    const studentProfileSummary = yield call(
      reportsApi.fetchStudentProfileSummaryReport,
      payload
    )
    const dataSizeExceeded =
      studentProfileSummary?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put({
        type: GET_REPORTS_STUDENT_PROFILE_SUMMARY_REQUEST_ERROR,
        payload: { error: { ...studentProfileSummary.data } },
      })
      return
    }
    yield put({
      type: GET_REPORTS_STUDENT_PROFILE_SUMMARY_REQUEST_SUCCESS,
      payload: { studentProfileSummary },
    })
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Error getting student profile summary report data. Please try again after a few minutes.'
    notification({ msg })
    yield put({
      type: GET_REPORTS_STUDENT_PROFILE_SUMMARY_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportStudentProfileSummarySaga() {
  yield all([
    yield takeLatest(
      GET_REPORTS_STUDENT_PROFILE_SUMMARY_REQUEST,
      getReportsStudentProfileSummaryRequest
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
