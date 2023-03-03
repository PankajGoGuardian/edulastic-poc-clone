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
const RESET_REPORTS_QUESTION_ANALYSIS =
  '[reports] reset reports question analysis'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getQuestionAnalysisRequestAction = createAction(
  GET_REPORTS_QUESTION_ANALYSIS_REQUEST
)
export const resetQuestionAnalysisAction = createAction(
  RESET_REPORTS_QUESTION_ANALYSIS
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

export const getReportsQuestionAnalysis1 = createSelector(
  stateSelector,
  (state) => state.questionAnalysis1
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
  questionAnalysis: {},
  questionAnalysis1: {},
  loading: false,
}

export const reportQuestionAnalysisReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
  [RESET_REPORTS_QUESTION_ANALYSIS]: (state) => (state = initialState),
  [GET_REPORTS_QUESTION_ANALYSIS_REQUEST]: (state) => {
    state.loading = true
  },
  [GET_REPORTS_QUESTION_ANALYSIS_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.error = false
    state.questionAnalysis = payload.questionAnalysis
    state.questionAnalysis1 = payload.questionAnalysis1
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
    const { data } = yield call(reportsApi.fetchQuestionAnalysisReport, payload)
    // fetchQuestionAnalysisSummaryReport
    // fetchQuestionAnalysisPerformanceReport
    const qSummary = [{
      questionId: "123",
      questionLabel: "Q1",
      points: 1,
      standards: ["1.OA.C.6"],
      districtAvgPerf: 90,
      avgTimeSpent: 5,
      avgPerformance: 10,
    },{
      questionId: "234",
      questionLabel: "Q2",
      points: 1,
      standards: ["1.OA.A.1"],
      districtAvgPerf: 90,
      avgTimeSpent: 8,
      avgPerformance: 10,
    },{
      questionId: "456",
      questionLabel: "Q3",
      points: 1,
      standards: ["1.MD.B.3"],
      districtAvgPerf: 90,
      avgTimeSpent: 10,
      avgPerformance: 10,
    }]
    const performanceByDimension = {
      "teacherId": {
        "totalPages": 4,
        "details": [
          {
            questionId: "123",
            teacherId: 1,
            teacherName: "as",
            scorePercent: 20,
            allTeachersScorePercent: 40,
            assignmentId: 123,
          },
          {
            questionId: "234",
            teacherId: 1,
            teacherName: "as",
            scorePercent: 10,
            allTeachersScorePercent: 50,
            assignmentId: 123,
          },
          {
            questionId: "456",
            teacherId: 1,
            teacherName: "as",
            scorePercent: 30,
            allTeachersScorePercent: 60,
            assignmentId: 123,
          },
          {
            questionId: "123",
            teacherId: 2,
            teacherName: "an",
            scorePercent: 20,
            allTeachersScorePercent: 55,
            assignmentId: 123,
          },
          {
            questionId: "234",
            teacherId: 2,
            teacherName: "an",
            scorePercent: 10,
            allTeachersScorePercent: 65,
            assignmentId: 123,
          },
          {
            questionId: "456",
            teacherId: 2,
            teacherName: "an",
            scorePercent: 30,
            allTeachersScorePercent: 75,
            assignmentId: 123,
          },{
            questionId: "123",
            teacherId: 3,
            teacherName: "au",
            scorePercent: 20,
            allTeachersScorePercent: 70,
            assignmentId: 123,
          },
          {
            questionId: "234",
            teacherId: 3,
            teacherName: "au",
            scorePercent: 10,
            allTeachersScorePercent: 100,
            assignmentId: 123,
          },
          {
            questionId: "456",
            teacherId: 3,
            teacherName: "au",
            scorePercent: 30,
            allTeachersScorePercent: 80,
            assignmentId: 123,
          }
        ],
      },
      "schoolId": {
        "totalPages": 5,
        "details": [
          {
            questionId: "123",
            schoolId: 1,
            schoolName: "s1",
            scorePercent: 20,
            allSchoolsScorePercent: 12,
            assignmentId: 123,
          },
          {
            questionId: "234",
            schoolId: 1,
            schoolName: "s1",
            scorePercent: 10,
            allSchoolsScorePercent: 4,
            assignmentId: 123,
          },
          {
            questionId: "456",
            schoolId: 1,
            schoolName: "s1",
            scorePercent: 30,
            allSchoolsScorePercent: 70,
            assignmentId: 123,
          },
          {
            questionId: "123",
            schoolId: 2,
            schoolName: "s2",
            scorePercent: 20,
            allSchoolsScorePercent: 75,
            assignmentId: 123,
          },
          {
            questionId: "234",
            schoolId: 2,
            schoolName: "s2",
            scorePercent: 10,
            allSchoolsScorePercent: 95,
            assignmentId: 123,
          },
          {
            questionId: "456",
            schoolId: 2,
            schoolName: "s2",
            scorePercent: 30,
            allSchoolsScorePercent: 100,
            assignmentId: 123,
          },{
            questionId: "123",
            schoolId: 3,
            schoolName: "s3",
            scorePercent: 20,
            allSchoolsScorePercent: 90,
            assignmentId: 123,
          },
          {
            questionId: "234",
            schoolId: 3,
            schoolName: "s3",
            scorePercent: 10,
            allSchoolsScorePercent: 95,
            assignmentId: 123,
          },
          {
            questionId: "456",
            schoolId: 3,
            schoolName: "s3",
            scorePercent: 30,
            allSchoolsScorePercent: 24,
            assignmentId: 123,
          }
        ],
      },
      "groupId": {
        "totalPages": 6,
        "details": [
          {
            questionId: "123",
            groupId: 1,
            groupName: "g1",
            scorePercent: 20,
            allGroupsScorePercent: 40,
            assignmentId: 123,
          },
          {
            questionId: "234",
            groupId: 1,
            groupName: "g1",
            scorePercent: 10,
            allGroupsScorePercent: 50,
            assignmentId: 123,
          },
          {
            questionId: "456",
            groupId: 1,
            groupName: "g1",
            scorePercent: 30,
            allGroupsScorePercent: 60,
            assignmentId: 123,
          },
          {
            questionId: "123",
            groupId: 2,
            groupName: "g2",
            scorePercent: 20,
            allGroupsScorePercent: 55,
            assignmentId: 123,
          },
          {
            questionId: "234",
            groupId: 2,
            groupName: "g2",
            scorePercent: 10,
            allGroupsScorePercent: 65,
            assignmentId: 123,
          },
          {
            questionId: "456",
            groupId: 2,
            groupName: "g2",
            scorePercent: 30,
            allGroupsScorePercent: 75,
            assignmentId: 123,
          },{
            questionId: "123",
            groupId: 3,
            groupName: "g3",
            scorePercent: 20,
            allGroupsScorePercent: 70,
            assignmentId: 123,
          },
          {
            questionId: "234",
            groupId: 3,
            groupName: "g3",
            scorePercent: 10,
            allGroupsScorePercent: 100,
            assignmentId: 123,
          },
          {
            questionId: "456",
            groupId: 3,
            groupName: "g3",
            scorePercent: 30,
            allGroupsScorePercent: 80,
            assignmentId: 123,
          }
        ],
      },
    }
    if (data && data?.dataSizeExceeded) {
      yield put({
        type: GET_REPORTS_QUESTION_ANALYSIS_REQUEST_ERROR,
        payload: { error: { ...data } },
      })
      return
    }
    const { result } = data
    const { compareBy } = payload.requestFilters
    const questionAnalysis = isEmpty(result) ? defaultReport : result
    const questionAnalysis1 = {
      qSummary,
      performanceByDimension: performanceByDimension[compareBy],
    }

    yield put({
      type: GET_REPORTS_QUESTION_ANALYSIS_REQUEST_SUCCESS,
      payload: { questionAnalysis, questionAnalysis1 },
    })
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Error getting question analysis report data. Please try again after a few minutes.'
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
