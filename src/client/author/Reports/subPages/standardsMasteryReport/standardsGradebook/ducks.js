import { takeLatest, call, put, all } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { createAction, createReducer } from 'redux-starter-kit'

import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const GET_REPORTS_STANDARDS_GRADEBOOK_SUMMARY_REQUEST =
  '[reports] get reports standards gradebook summary request'
const GET_REPORTS_STANDARDS_GRADEBOOK_SUMMARY_REQUEST_SUCCESS =
  '[reports] get reports standards gradebook summary success'
const GET_REPORTS_STANDARDS_GRADEBOOK_SUMMARY_REQUEST_ERROR =
  '[reports] get reports standards gradebook summary error'
const GET_REPORTS_STANDARDS_GRADEBOOK_DETAILS_REQUEST =
  '[reports] get reports standards gradebook details request'
const GET_REPORTS_STANDARDS_GRADEBOOK_DETAILS_REQUEST_SUCCESS =
  '[reports] get reports standards gradebook details success'
const GET_REPORTS_STANDARDS_GRADEBOOK_DETAILS_REQUEST_ERROR =
  '[reports] get reports standards gradebook details error'
const GET_STUDENT_STANDARDS_REQUEST =
  '[reports] standard gradebook get student standards request '
const GET_STUDENT_STANDARDS_SUCCESS =
  '[reports] standard gradebook get student standards success'
const GET_STUDENT_STANDARDS_FAILED =
  '[reports] standard gradebook get student standards failed'
const RESET_REPORTS_STANDARDS_GRADEBOOK =
  '[reports] reset reports standards gradebook'

const GET_STANDARDS_GRADEBOOK_SKILL_INFO_REQUEST =
  '[reports] get standards gradebook skillInfo request'

const GET_STANDARDS_GRADEBOOK_SKILL_INFO_REQUEST_SUCCESS =
  '[reports] get standards gradebook skillInfo request success'
const GET_STANDARDS_GRADEBOOK_SKILL_INFO_REQUEST_ERROR =
  '[reports] get standards gradebook skillInfo request failed'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getStandardsGradebookSummaryAction = createAction(
  GET_REPORTS_STANDARDS_GRADEBOOK_SUMMARY_REQUEST
)
export const getStandardsGradebookDetailsAction = createAction(
  GET_REPORTS_STANDARDS_GRADEBOOK_DETAILS_REQUEST
)
export const getStudentStandardsAction = createAction(
  GET_STUDENT_STANDARDS_REQUEST
)
export const resetStandardsGradebookAction = createAction(
  RESET_REPORTS_STANDARDS_GRADEBOOK
)

export const getStandardsGradebookSkillInfoAction = createAction(
  GET_STANDARDS_GRADEBOOK_SKILL_INFO_REQUEST
)
// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportStandardsGradebookReducer

export const getSkillInfoLoader = createSelector(
  stateSelector,
  (state) => state.loadingSkillInfo
)

export const getStandardsGradebookSkillInfo = createSelector(
  stateSelector,
  (state) => state.skillInfo
)

export const getStandardsGradebookSummary = createSelector(
  stateSelector,
  (state) => state.summary
)

export const getStandardsGradebookSummaryLoader = createSelector(
  stateSelector,
  (state) => state.loadingSummary
)

export const getStandardsGradebookDetails = createSelector(
  stateSelector,
  (state) => state.details
)

export const getStandardsGradebookDetailsLoader = createSelector(
  stateSelector,
  (state) => state.loadingDetails
)

export const getReportsStandardsGradebookError = createSelector(
  stateSelector,
  (state) => state.error
)

export const getStudentStandardData = createSelector(
  stateSelector,
  (state) => state.studentStandard
)

export const getStudentStandardLoader = createSelector(
  stateSelector,
  (state) => state.loadingStudentStandard
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  loading: false,
  loadingSkillInfo: false,
  loadingSummary: false,
  loadingDetails: false,
  skillInfo: {},
  summary: {},
  details: {},
  testIds: '',
  studentStandard: [],
  loadingStudentStandard: false,
}

export const reportStandardsGradebookReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: () => initialState,
  [RESET_REPORTS_STANDARDS_GRADEBOOK]: () => initialState,
  [GET_REPORTS_STANDARDS_GRADEBOOK_SUMMARY_REQUEST]: (state) => {
    state.loadingSummary = true
  },
  [GET_REPORTS_STANDARDS_GRADEBOOK_SUMMARY_REQUEST_SUCCESS]: (
    state,
    { payload }
  ) => {
    state.loadingSummary = false
    state.error = false
    state.summary = payload.summary
  },
  [GET_REPORTS_STANDARDS_GRADEBOOK_SUMMARY_REQUEST_ERROR]: (
    state,
    { payload }
  ) => {
    state.loadingSummary = false
    state.error = payload.error
  },
  [GET_REPORTS_STANDARDS_GRADEBOOK_DETAILS_REQUEST]: (state) => {
    state.loadingDetails = true
  },
  [GET_REPORTS_STANDARDS_GRADEBOOK_DETAILS_REQUEST_SUCCESS]: (
    state,
    { payload }
  ) => {
    state.loadingDetails = false
    state.error = false
    state.details = payload.details
  },
  [GET_REPORTS_STANDARDS_GRADEBOOK_DETAILS_REQUEST_ERROR]: (
    state,
    { payload }
  ) => {
    state.loadingDetails = false
    state.error = payload.error
  },
  [GET_STUDENT_STANDARDS_REQUEST]: (state) => {
    state.loadingStudentStandard = true
  },
  [GET_STUDENT_STANDARDS_SUCCESS]: (state, { payload }) => {
    state.studentStandard = payload.data.result
    state.loadingStudentStandard = false
  },
  [GET_STUDENT_STANDARDS_FAILED]: (state) => {
    state.loadingStudentStandard = 'failed'
  },
  [GET_STANDARDS_GRADEBOOK_SKILL_INFO_REQUEST]: (state) => {
    state.loadingSkillInfo = true
  },
  [GET_STANDARDS_GRADEBOOK_SKILL_INFO_REQUEST_SUCCESS]: (
    state,
    { payload }
  ) => {
    state.loadingSkillInfo = false
    state.error = false
    state.skillInfo = payload.skillInfo
  },
  [GET_STANDARDS_GRADEBOOK_SKILL_INFO_REQUEST_ERROR]: (state, { payload }) => {
    state.loadingSkillInfo = false
    state.error = payload.error
  },
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getStandardsGradebookSkillInfoRequest({ payload }) {
  try {
    const skillInfo = yield call(
      reportsApi.fetchStandardsGradbookSkillInfo,
      payload
    )
    const dataSizeExceeded = skillInfo?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put({
        type: GET_STANDARDS_GRADEBOOK_SKILL_INFO_REQUEST_ERROR,
        payload: { error: { ...skillInfo.data } },
      })
      return
    }
    yield put({
      type: GET_STANDARDS_GRADEBOOK_SKILL_INFO_REQUEST_SUCCESS,
      payload: { skillInfo },
    })
  } catch (error) {
    const msg =
      'Error getting standards data. Please try again after a few minutes.'
    notification({ msg })
    yield put({
      type: GET_STANDARDS_GRADEBOOK_SKILL_INFO_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

function* getStandardsGradebookSummaryRequest({ payload }) {
  try {
    const summary = yield call(
      reportsApi.fetchStandardsGradebookSummary,
      payload
    )
    const dataSizeExceeded = summary?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put({
        type: GET_REPORTS_STANDARDS_GRADEBOOK_SUMMARY_REQUEST_ERROR,
        payload: { error: { ...summary.data } },
      })
      return
    }
    yield put({
      type: GET_REPORTS_STANDARDS_GRADEBOOK_SUMMARY_REQUEST_SUCCESS,
      payload: { summary },
    })
  } catch (error) {
    const msg =
      'Error getting standards gradebook report summary data. Please try again after a few minutes.'
    notification({ msg })
    yield put({
      type: GET_REPORTS_STANDARDS_GRADEBOOK_SUMMARY_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

function* getStandardsGradebookDetailsRequest({ payload }) {
  try {
    const details = yield call(
      reportsApi.fetchStandardsGradebookDetails,
      payload
    )
    const dataSizeExceeded = details?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put({
        type: GET_REPORTS_STANDARDS_GRADEBOOK_DETAILS_REQUEST_ERROR,
        payload: { error: { ...details.data } },
      })
      return
    }
    yield put({
      type: GET_REPORTS_STANDARDS_GRADEBOOK_DETAILS_REQUEST_SUCCESS,
      payload: { details },
    })
  } catch (error) {
    const msg =
      'Error getting standards gradebook report details data. Please try again after a few minutes.'
    notification({ msg })
    yield put({
      type: GET_REPORTS_STANDARDS_GRADEBOOK_DETAILS_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

function* getStudentStandardsSaga({ payload }) {
  try {
    const studentStandard = yield call(
      reportsApi.fetchStudentStandards,
      payload
    )
    yield put({
      type: GET_STUDENT_STANDARDS_SUCCESS,
      payload: studentStandard,
    })
  } catch (error) {
    console.error('err', error.stack)
    notification({ messageKey: 'failedToFetchStudentStandard' })
    yield put({
      type: GET_STUDENT_STANDARDS_FAILED,
    })
  }
}

export function* reportStandardsGradebookSaga() {
  yield all([
    yield takeLatest(GET_STUDENT_STANDARDS_REQUEST, getStudentStandardsSaga),
    yield takeLatest(
      GET_STANDARDS_GRADEBOOK_SKILL_INFO_REQUEST,
      getStandardsGradebookSkillInfoRequest
    ),
    yield takeLatest(
      GET_REPORTS_STANDARDS_GRADEBOOK_SUMMARY_REQUEST,
      getStandardsGradebookSummaryRequest
    ),
    yield takeLatest(
      GET_REPORTS_STANDARDS_GRADEBOOK_DETAILS_REQUEST,
      getStandardsGradebookDetailsRequest
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
