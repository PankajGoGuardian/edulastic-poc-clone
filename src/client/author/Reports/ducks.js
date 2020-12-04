import { createSelector } from 'reselect'
import { createAction, createReducer, combineReducers } from 'redux-starter-kit'
import { all, call, put, takeEvery } from 'redux-saga/effects'
import { notification } from 'antd'
import { get } from 'lodash'

import { assignmentApi } from '@edulastic/api'

import {
  reportAssignmentsReducer,
  reportAssignmentsSaga,
} from './assignmentsDucks'

import { reportSARSettingsReducer } from './subPages/singleAssessmentReport/ducks'
import { reportMARSettingsReducer } from './subPages/multipleAssessmentReport/ducks'
import { reportSPRSettingsReducer } from './subPages/studentProfileReport/ducks'
import { reportSMRSettingsReducer } from './subPages/standardsMasteryReport/ducks'

import {
  reportSARFilterDataReducer,
  reportSARFilterDataSaga,
} from './subPages/singleAssessmentReport/common/filterDataDucks'
import {
  reportMARFilterDataReducer,
  reportMARFilterDataSaga,
} from './subPages/multipleAssessmentReport/common/filterDataDucks'
import {
  reportSPRFilterDataReducer,
  reportSPRFilterDataSaga,
} from './subPages/studentProfileReport/common/filterDataDucks'
import {
  reportStandardsFilterDataReducer,
  reportStandardsFilterSaga,
} from './subPages/standardsMasteryReport/common/filterDataDucks'

import {
  reportAssessmentSummaryReducer,
  reportAssessmentSummarySaga,
} from './subPages/singleAssessmentReport/AssessmentSummary/ducks'
import {
  reportPeerPerformanceReducer,
  reportPeerPerformanceSaga,
} from './subPages/singleAssessmentReport/PeerPerformance/ducks'
import {
  reportQuestionAnalysisReducer,
  reportQuestionAnalysisSaga,
} from './subPages/singleAssessmentReport/QuestionAnalysis/ducks'
import {
  reportResponseFrequencyReducer,
  reportResponseFrequencySaga,
} from './subPages/singleAssessmentReport/ResponseFrequency/ducks'
import {
  reportPerformanceByStandardsReducer,
  performanceByStandardsSaga,
} from './subPages/singleAssessmentReport/PerformanceByStandards/ducks'
import {
  reportPerformanceByStudentsReducer,
  reportPerformanceByStudentsSaga,
} from './subPages/singleAssessmentReport/PerformanceByStudents/ducks'
import {
  reportPerformanceOverTimeReducer,
  reportPerformanceOverTimeSaga,
} from './subPages/multipleAssessmentReport/PerformanceOverTime/ducks'
import {
  reportPeerProgressAnalysisReducer,
  reportPeerProgressAnalysisSaga,
} from './subPages/multipleAssessmentReport/PeerProgressAnalysis/ducks'
import {
  reportStudentProgressReducer,
  reportStudentProgressSaga,
} from './subPages/multipleAssessmentReport/StudentProgress/ducks'
import {
  reportStudentProfileSummaryReducer,
  reportStudentProfileSummarySaga,
} from './subPages/studentProfileReport/StudentProfileSummary/ducks'
import {
  reportStudentMasteryProfileReducer,
  reportStudentMasteryProfileSaga,
} from './subPages/studentProfileReport/StudentMasteryProfile/ducks'
import {
  reportStudentAssessmentProfileReducer,
  reportStudentAssessmentProfileSaga,
} from './subPages/studentProfileReport/StudentAssessmentProfile/ducks'
import {
  reportStandardsPerformanceSummaryReducer,
  reportStandardsPerformanceSummarySaga,
} from './subPages/standardsMasteryReport/standardsPerformance/ducks'
import {
  reportStandardsGradebookReducer,
  reportStandardsGradebookSaga,
} from './subPages/standardsMasteryReport/standardsGradebook/ducks'
import {
  customReportReducer,
  customReportSaga,
} from './components/customReport/ducks'
import {
  sharedReportsReducer,
  sharedReportsSaga,
} from './components/sharedReports/ducks'

const SET_SHARING_STATE = '[reports] set sharing state'
const SET_PRINTING_STATE = '[reports] set printing state'
const SET_CSV_DOWNLOADING_STATE = '[reports] set csv download state'

const RECEIVE_TEST_LIST_REQUEST = '[reports] receive test list request'
const RECEIVE_TEST_LIST_REQUEST_SUCCESS =
  '[reports] receive test list request success'
const RECEIVE_TEST_LIST_REQUEST_ERROR =
  '[reports] receive test list request request error'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const setSharingStateAction = createAction(SET_SHARING_STATE)
export const setPrintingStateAction = createAction(SET_PRINTING_STATE)
export const setCsvDownloadingStateAction = createAction(
  SET_CSV_DOWNLOADING_STATE
)
export const receiveTestListAction = createAction(RECEIVE_TEST_LIST_REQUEST)
// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) => state.reportReducer.reports

export const getSharingState = createSelector(
  stateSelector,
  (state) => state.isSharing
)

export const getPrintingState = createSelector(
  stateSelector,
  (state) => state.isPrinting
)

export const getCsvDownloadingState = createSelector(
  stateSelector,
  (state) => state.isCsvDownloading
)

export const getTestListSelector = createSelector(
  stateSelector,
  (state) => state.testList
)

export const getTestListLoadingSelector = createSelector(
  stateSelector,
  (state) => state.testListLoading
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  isSharing: false,
  isPrinting: false,
  testList: [],
  testListLoading: true,
}

const reports = createReducer(initialState, {
  [SET_SHARING_STATE]: (state, { payload }) => {
    state.isSharing = payload
  },
  [SET_PRINTING_STATE]: (state, { payload }) => {
    state.isPrinting = payload
  },
  [SET_CSV_DOWNLOADING_STATE]: (state, { payload }) => {
    state.isCsvDownloading = payload
  },
  [RECEIVE_TEST_LIST_REQUEST]: (state) => {
    state.testListLoading = true
  },
  [RECEIVE_TEST_LIST_REQUEST_SUCCESS]: (state, { payload }) => {
    state.testListLoading = false
    state.testList = payload.testList
  },
  [RECEIVE_TEST_LIST_REQUEST_ERROR]: (state, { payload }) => {
    state.testListLoading = false
    state.testList = []
    state.error = payload.error
  },
})

export const reportReducer = combineReducers({
  reports,
  reportAssignmentsReducer,

  reportSARSettingsReducer,
  reportMARSettingsReducer,
  reportSPRSettingsReducer,
  reportSMRSettingsReducer,

  reportSARFilterDataReducer,
  reportMARFilterDataReducer,
  reportSPRFilterDataReducer,
  reportStandardsFilterDataReducer,

  reportAssessmentSummaryReducer,
  reportPeerPerformanceReducer,
  reportQuestionAnalysisReducer,
  reportResponseFrequencyReducer,
  reportPerformanceByStandardsReducer,
  reportPerformanceByStudentsReducer,
  reportPerformanceOverTimeReducer,
  reportPeerProgressAnalysisReducer,
  reportStudentProgressReducer,
  reportStudentProfileSummaryReducer,
  reportStudentMasteryProfileReducer,
  reportStudentAssessmentProfileReducer,
  reportStandardsPerformanceSummaryReducer,
  reportStandardsGradebookReducer,
  customReportReducer,
  sharedReportsReducer,
})

// -----|-----|-----|-----| REDUCER ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

export function* receiveTestListSaga({ payload }) {
  try {
    const searchResult = yield call(assignmentApi.searchAssignments, payload)
    const assignmentBuckets = get(
      searchResult,
      'aggregations.buckets.buckets',
      []
    )
    const testList = assignmentBuckets
      .map(({ key: _id, assignments }) => {
        const hits = get(assignments, 'hits.hits', [])
        const title = get(hits[0], '_source.title', '')
        return { _id, title }
      })
      .filter(({ _id, title }) => _id && title)
    yield put({
      type: RECEIVE_TEST_LIST_REQUEST_SUCCESS,
      payload: { testList },
    })
  } catch (error) {
    const msg = 'Failed to receive tests dropdown data. Please try again...'
    notification({ msg })
    yield put({
      type: RECEIVE_TEST_LIST_REQUEST_SUCCESS,
      payload: { error: msg },
    })
  }
}

export function* reportSaga(params) {
  yield all([
    reportAssignmentsSaga(),

    reportSARFilterDataSaga(),
    reportMARFilterDataSaga(),
    reportSPRFilterDataSaga(),
    reportStandardsFilterSaga(),

    reportAssessmentSummarySaga(),
    reportPeerPerformanceSaga(),
    reportQuestionAnalysisSaga(),
    reportResponseFrequencySaga(),
    performanceByStandardsSaga(),
    reportPerformanceByStudentsSaga(),
    reportPerformanceOverTimeSaga(),
    reportPeerProgressAnalysisSaga(),
    reportStudentProgressSaga(),
    reportStudentProfileSummarySaga(),
    reportStudentMasteryProfileSaga(),
    reportStudentAssessmentProfileSaga(),
    reportStandardsPerformanceSummarySaga(),
    reportStandardsGradebookSaga(),
    customReportSaga(),
    sharedReportsSaga(),
    yield takeEvery(RECEIVE_TEST_LIST_REQUEST, receiveTestListSaga),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
