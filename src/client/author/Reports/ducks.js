import { createSelector } from 'reselect'
import { createAction, createReducer, combineReducers } from 'redux-starter-kit'
import { all, call, put, takeEvery } from 'redux-saga/effects'
import { get } from 'lodash'

import { assignmentApi, reportsApi } from '@edulastic/api'

import { styledNotification } from './common/styled'

import {
  reportAssignmentsReducer,
  reportAssignmentsSaga,
} from './assignmentsDucks'

import { RESET_ALL_REPORTS } from './common/reportsRedux'

import { reportSARSettingsReducer } from './subPages/singleAssessmentReport/ducks'
import { reportMARSettingsReducer } from './subPages/multipleAssessmentReport/ducks'
import { reportSPRSettingsReducer } from './subPages/studentProfileReport/ducks'
import { reportSMRSettingsReducer } from './subPages/standardsMasteryReport/ducks'
import { reportERSettingsReducer } from './subPages/engagementReport/ducks'

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
import { reportERFilterDataReducer } from './subPages/engagementReport/common/filterDataDucks'

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
  reportStudentProgressProfileReducer,
  reportStudentProgressProfileSaga,
} from './subPages/studentProfileReport/StudentProgressProfile/ducks'
import {
  reportStandardsPerformanceSummaryReducer,
  reportStandardsPerformanceSummarySaga,
} from './subPages/standardsMasteryReport/standardsPerformance/ducks'
import {
  reportStandardsGradebookReducer,
  reportStandardsGradebookSaga,
} from './subPages/standardsMasteryReport/standardsGradebook/ducks'
import {
  reportStandardsProgressReducer,
  reportStandardsProgressSaga,
} from './subPages/standardsMasteryReport/standardsProgress/ducks'
import {
  reportEngagementSummaryReducer,
  reportEngagementSummarySaga,
} from './subPages/engagementReport/EngagementSummary/ducks'
import {
  reportActivityBySchoolReducer,
  reportActivityBySchoolSaga,
} from './subPages/engagementReport/ActivityBySchool/ducks'
import {
  reportActivityByTeacherReducer,
  reportActivityByTeacherSaga,
} from './subPages/engagementReport/ActivityByTeacher/ducks'
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

const GENERATE_CSV_REQUEST = '[reports] generate csv request'
const GENERATE_CSV_STATUS = '[reports] generate csv request status'
const SET_CSV_MODAL_VISIBLE = '[reports] set csv modal visible'
const SET_CSV_DOCS = '[reports] set csv docs'

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

export const generateCSVAction = createAction(GENERATE_CSV_REQUEST)
export const setGenerateCSVStatusAction = createAction(GENERATE_CSV_STATUS)
export const setCsvModalVisibleAction = createAction(SET_CSV_MODAL_VISIBLE)
export const setCsvDocsAction = createAction(SET_CSV_DOCS)

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

export const getCsvModalVisible = createSelector(
  stateSelector,
  (state) => state.csvModalVisible
)

export const getCsvDocs = createSelector(
  stateSelector,
  (state) => state.csvDocs
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  isSharing: false,
  isPrinting: false,
  testList: [],
  testListLoading: true,
  csvModalVisible: false,
  csvDocs: [],
  csvLoading: false,
}

const reports = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state) => {
    state.testList = []
    state.testListLoading = true
  },
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
  [GENERATE_CSV_STATUS]: (state, { payload }) => {
    state.csvLoading = payload
  },
  [SET_CSV_MODAL_VISIBLE]: (state, { payload }) => {
    state.csvModalVisible = payload
  },
  [SET_CSV_DOCS]: (state, { payload }) => {
    state.csvDocs = payload
  },
})

export const reportReducer = combineReducers({
  reports,
  reportAssignmentsReducer,

  reportSARSettingsReducer,
  reportMARSettingsReducer,
  reportSPRSettingsReducer,
  reportSMRSettingsReducer,
  reportERSettingsReducer,

  reportSARFilterDataReducer,
  reportMARFilterDataReducer,
  reportSPRFilterDataReducer,
  reportStandardsFilterDataReducer,
  reportERFilterDataReducer,

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
  reportStudentProgressProfileReducer,
  reportStandardsPerformanceSummaryReducer,
  reportStandardsGradebookReducer,
  reportStandardsProgressReducer,
  reportEngagementSummaryReducer,
  reportActivityBySchoolReducer,
  reportActivityByTeacherReducer,
  customReportReducer,
  sharedReportsReducer,
})

// -----|-----|-----|-----| REDUCER ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

export function* generateCSVSaga({ payload }) {
  try {
    styledNotification({
      type: 'info',
      msg:
        'Download request received. We will notify you as soon as it gets ready.',
    })
    const response = yield call(reportsApi.generateCSV, payload)
    if (!response) {
      throw new Error('Failed to generate CSV')
    }
    yield put({ type: GENERATE_CSV_STATUS, payload: true })
  } catch (error) {
    const errorMessage =
      error.response.data?.message || 'Download request failed.'
    styledNotification({ msg: errorMessage })
    yield put({ type: GENERATE_CSV_STATUS, payload: false })
  }
}

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
    styledNotification({ msg })
    yield put({
      type: RECEIVE_TEST_LIST_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportSaga() {
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
    reportStudentProgressProfileSaga(),
    reportStudentProfileSummarySaga(),
    reportStudentMasteryProfileSaga(),
    reportStudentAssessmentProfileSaga(),
    reportStandardsPerformanceSummarySaga(),
    reportStandardsGradebookSaga(),
    reportStandardsProgressSaga(),
    reportEngagementSummarySaga(),
    reportActivityBySchoolSaga(),
    reportActivityByTeacherSaga(),
    customReportSaga(),
    sharedReportsSaga(),
    yield takeEvery(GENERATE_CSV_REQUEST, generateCSVSaga),
    yield takeEvery(RECEIVE_TEST_LIST_REQUEST, receiveTestListSaga),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
