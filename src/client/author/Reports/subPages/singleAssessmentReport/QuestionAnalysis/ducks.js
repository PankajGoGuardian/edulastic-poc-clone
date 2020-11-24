import { takeLatest, call, put, all } from 'redux-saga/effects'
import { isEmpty } from 'lodash'
import { createSelector } from 'reselect'
import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const GET_REPORTS_QUESTION_ANALYSIS_REQUEST =
  '[reports] get reports question analysis request'
const GET_REPORTS_QUESTION_ANALYSIS_REQUEST_SUCCESS =
  '[reports] get reports question analysis success'
const GET_REPORTS_QUESTION_ANALYSIS_REQUEST_ERROR =
  '[reports] get reports question analysis error'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getQuestionAnalysisRequestAction = createAction(
  GET_REPORTS_QUESTION_ANALYSIS_REQUEST
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportQuestionAnalysisReducer

export const getReportsQuestionAnalysis = createSelector(
  stateSelector,
  (state) => state.questionAnalysis
)

export const getReportsQuestionAnalysisLoader = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getReportsQuestionAnalysisError = createSelector(
  stateSelector,
  (state) => state.error
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

export const defaultReport = {
  metaInfo: [],
  metricInfo: [],
}

const initialState = {
  questionAnalysis: defaultReport,
  loading: false,
}

export const reportQuestionAnalysisReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
  [GET_REPORTS_QUESTION_ANALYSIS_REQUEST]: (state) => {
    state.loading = true
  },
  [GET_REPORTS_QUESTION_ANALYSIS_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.error = false
    state.questionAnalysis = payload.questionAnalysis
  },
  [GET_REPORTS_QUESTION_ANALYSIS_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsQuestionAnalysisRequest({ payload }) {
  try {
    payload.requestFilters.classIds =
      payload.requestFilters?.classIds?.join(',') ||
      payload.requestFilters?.classId ||
      ''
    payload.requestFilters.groupIds =
      payload.requestFilters?.groupIds?.join(',') ||
      payload.requestFilters?.groupId ||
      ''
    payload.requestFilters.assessmentTypes =
      payload.requestFilters?.assessmentTypes?.join(',') || ''

    payload.requestFilters.teacherIds =
      payload.requestFilters?.teacherIds?.join(',') || ''

    payload.requestFilters.schoolIds =
      payload.requestFilters?.schoolIds?.join(',') || ''

    payload.requestFilters.grade = payload.requestFilters.studentGrade
    payload.requestFilters.courseId = payload.requestFilters.studentCourseId
    payload.requestFilters.subject = payload.requestFilters.studentSubject

    const { data } = yield call(reportsApi.fetchQuestionAnalysisReport, payload)

    if (data && data?.dataSizeExceeded) {
      yield put({
        type: GET_REPORTS_QUESTION_ANALYSIS_REQUEST_ERROR,
        payload: { error: { ...data } },
      })
      return
    }
    const { result } = data

    const questionAnalysis = isEmpty(result) ? defaultReport : result

    yield put({
      type: GET_REPORTS_QUESTION_ANALYSIS_REQUEST_SUCCESS,
      payload: { questionAnalysis },
    })
  } catch (error) {
    console.log('err', error.stack)
    const msg = 'Failed to fetch question analysis Please try again...'
    notification({ msg })
    yield put({
      type: GET_REPORTS_QUESTION_ANALYSIS_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportQuestionAnalysisSaga() {
  yield all([
    yield takeLatest(
      GET_REPORTS_QUESTION_ANALYSIS_REQUEST,
      getReportsQuestionAnalysisRequest
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
