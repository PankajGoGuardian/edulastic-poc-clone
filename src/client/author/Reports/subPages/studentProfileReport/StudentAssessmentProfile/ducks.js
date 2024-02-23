import { takeLatest, takeEvery, fork, call, put, all } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { questionType } from '@edulastic/constants'
import { classResponseApi, reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'
import { isEmpty } from 'lodash'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'
import {
  getAttachmentsForItems,
  loadAnnotationsFromServer,
  loadPassagesForItems,
} from '../../../../sharedDucks/classResponses'
import { SAVE_USER_WORK } from '../../../../../assessment/constants/actions'

const GET_REPORTS_STUDENT_ASSESSMENT_PROFILE_REQUEST =
  '[reports] get reports student assessment profile request'
const GET_REPORTS_STUDENT_ASSESSMENT_PROFILE_REQUEST_SUCCESS =
  '[reports] get reports student assessment profile success'
const GET_REPORTS_STUDENT_ASSESSMENT_PROFILE_REQUEST_ERROR =
  '[reports] get reports student assessment profile error'
const RESET_REPORTS_STUDENT_ASSESSMENT_PROFILE =
  '[reports] reset reports student assessment profile'
const RECEIVE_STUDENT_REPORT_RESPONSE_SUCCESS =
  '[reports] receive student report response success'
const RECEIVE_STUDENT_REPORT_RESPONSE_ERROR =
  '[reports] receive student report response error'
const RECEIVE_STUDENT_REPORT_RESPONSE_REQUEST =
  '[reports] receive student report response request'
const SET_IS_TEST_ACTIVITY_VISIBLE = '[reports] set test activity modal visible'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getStudentAssessmentProfileRequestAction = createAction(
  GET_REPORTS_STUDENT_ASSESSMENT_PROFILE_REQUEST
)
export const resetStudentAssessmentProfileAction = createAction(
  RESET_REPORTS_STUDENT_ASSESSMENT_PROFILE
)

export const receiveStudentReportResponseAction = (data) => ({
  type: RECEIVE_STUDENT_REPORT_RESPONSE_REQUEST,
  payload: data,
})

export const setIsActivityModalVisibleAction = (payload) => ({
  type: SET_IS_TEST_ACTIVITY_VISIBLE,
  payload,
})
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

export const getReportsStudentResponse = createSelector(
  stateSelector,
  (state) => state.studentResponse
)

export const getReportsClassResponse = createSelector(
  stateSelector,
  (state) => state.classResponse
)

export const getReportsStudentResponseLoader = createSelector(
  stateSelector,
  (state) => state.activityModalLoading
)

export const getActivityModalVisibleSelector = createSelector(
  stateSelector,
  (state) => state.isActivityModalVisible
)
// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  studentAssessmentProfile: {},
  studentResponse: {},
  classResponse: {},
  loading: false,
  activityModalLoading: false,
  isActivityModalVisible: false,
}

export const reportStudentAssessmentProfileReducer = createReducer(
  initialState,
  {
    [RESET_ALL_REPORTS]: (state, { payload }) => {
      state = initialState
    },
    [RESET_REPORTS_STUDENT_ASSESSMENT_PROFILE]: (state, { payload }) => {
      state = initialState
    },
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
    [RECEIVE_STUDENT_REPORT_RESPONSE_SUCCESS]: (state, { payload }) => {
      state.activityModalLoading = false
      state.error = false
      state.studentResponse = payload.studentResponse
      state.classResponse = payload.classResponse
    },
    [RECEIVE_STUDENT_REPORT_RESPONSE_ERROR]: (state, { payload }) => {
      state.activityModalLoading = false
      state.error = payload.error
      state.studentResponse = {}
      state.classResponse = {}
    },
    [RECEIVE_STUDENT_REPORT_RESPONSE_REQUEST]: (state, { payload }) => {
      state.activityModalLoading = true
    },
    [GET_REPORTS_STUDENT_ASSESSMENT_PROFILE_REQUEST_ERROR]: (
      state,
      { payload }
    ) => {
      state.loading = false
      state.error = payload.error
    },
    [SET_IS_TEST_ACTIVITY_VISIBLE]: (state, { payload }) => {
      state.isActivityModalVisible = payload
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

// student view LCB modal
function* receiveStudentReportResponseSaga({ payload }) {
  try {
    const studentResponse = yield call(
      classResponseApi.studentResponse,
      payload
    )
    const classResponse = yield call(classResponseApi.classResponse, {
      ...payload,
      classId: payload.groupId,
    })
    delete payload.audit
    const { questionActivities: uqas = [] } = studentResponse
    const sc = uqas.filter(
      (uqa) =>
        uqa?.scratchPad?.scratchpad &&
        uqa.qType === questionType.HIGHLIGHT_IMAGE
    )
    yield fork(getAttachmentsForItems, {
      testActivityId: payload.testActivityId,
      testItemsIdArray: sc,
    })
    const passages = studentResponse.testActivity.passages

    if (!isEmpty(passages)) {
      yield fork(loadPassagesForItems, {
        testActivityId: payload.testActivityId,
        passages,
      })
    }

    const userWork = {}
    if (studentResponse.testActivity?.isDocBased) {
      if (uqas.length) {
        const { testItemId, testActivityId } = uqas[0] || {}
        if (testItemId && testActivityId) {
          yield fork(loadAnnotationsFromServer, {
            referrerId: testActivityId,
            referrerId2: testItemId,
          })
        }
      }
    }
    uqas.forEach((item) => {
      if (item.scratchPad) {
        const newUserWork = { ...item.scratchPad }
        userWork[item.testItemId] = newUserWork
      }
    })

    if (Object.keys(userWork).length > 0) {
      yield put({
        type: SAVE_USER_WORK,
        payload: userWork,
      })
    }

    yield put({
      type: RECEIVE_STUDENT_REPORT_RESPONSE_SUCCESS,
      payload: { studentResponse, classResponse },
    })
  } catch (err) {
    console.log('err is', err)
    const errorMessage = 'Unable to retrieve student report response.'
    notification({ type: 'error', messageKey: 'receiveTestFailing' })
    yield put({
      type: RECEIVE_STUDENT_REPORT_RESPONSE_ERROR,
      payload: { error: errorMessage },
    })
  }
}

export function* reportStudentAssessmentProfileSaga() {
  yield all([
    yield takeLatest(
      GET_REPORTS_STUDENT_ASSESSMENT_PROFILE_REQUEST,
      getReportsStudentAssessmentProfileRequest
    ),
    yield takeEvery(
      RECEIVE_STUDENT_REPORT_RESPONSE_REQUEST,
      receiveStudentReportResponseSaga
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
