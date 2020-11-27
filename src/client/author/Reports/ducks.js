import { createSelector } from 'reselect'
import { createAction, createReducer, combineReducers } from 'redux-starter-kit'
import { all } from 'redux-saga/effects'

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

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const setSharingStateAction = createAction(SET_SHARING_STATE)
export const setPrintingStateAction = createAction(SET_PRINTING_STATE)
export const setCsvDownloadingStateAction = createAction(
  SET_CSV_DOWNLOADING_STATE
)

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

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  isSharing: false,
  isPrinting: false,
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
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
