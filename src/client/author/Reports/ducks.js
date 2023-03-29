import { createSelector } from 'reselect'
import { createAction, createReducer, combineReducers } from 'redux-starter-kit'
import { all, call, put, takeEvery, select, take } from 'redux-saga/effects'
import { get, isEmpty, omitBy, mapValues, uniqBy } from 'lodash'

import { assignmentStatusOptions, roleuser } from '@edulastic/constants'
import { assignmentApi, reportsApi } from '@edulastic/api'

import { reportGroupType } from '@edulastic/constants/const/report'
import { styledNotification } from './common/styled'

import {
  reportAssignmentsReducer,
  reportAssignmentsSaga,
} from './assignmentsDucks'

import { RESET_ALL_REPORTS } from './common/reportsRedux'
import {
  getReportsSARSettings,
  reportSARSettingsReducer,
  setSARTagsDataAction,
} from './subPages/singleAssessmentReport/ducks'

import {
  getReportsMARSettings,
  reportMARSettingsReducer,
  setMARTagsDataAction,
} from './subPages/multipleAssessmentReport/ducks'
import {
  getReportsSPRSettings,
  reportSPRSettingsReducer,
  setSPRTagsDataAction,
} from './subPages/studentProfileReport/ducks'
import {
  getReportsSMRSettings,
  reportSMRSettingsReducer,
  setSMRTagsDataAction,
} from './subPages/standardsMasteryReport/ducks'
import {
  getReportsERSettings,
  reportERSettingsReducer,
  setERTagsDataAction,
} from './subPages/engagementReport/ducks'

import {
  getTempTagsDataSelector as getSARTempTagsDataSelector,
  setTempTagsDataAction as setSARTempTagsDataAction,
  reportSARFilterDataReducer,
  reportSARFilterDataSaga,
  getReportsSARFilterData,
  GET_REPORTS_SAR_FILTER_DATA_REQUEST_ERROR,
  GET_REPORTS_SAR_FILTER_DATA_REQUEST_SUCCESS,
} from './subPages/singleAssessmentReport/common/filterDataDucks'
import {
  getTempTagsDataSelector as getMARTempTagsDataSelector,
  setTempTagsDataAction as setMARTempTagsDataAction,
  reportMARFilterDataReducer,
  reportMARFilterDataSaga,
} from './subPages/multipleAssessmentReport/common/filterDataDucks'
import {
  getTempTagsDataSelector as getSPRTempTagsDataSelector,
  setTempTagsDataAction as setSPRTempTagsDataAction,
  reportSPRFilterDataReducer,
  reportSPRFilterDataSaga,
} from './subPages/studentProfileReport/common/filterDataDucks'
import {
  getTempTagsDataSelector as getSMRTempTagsDataSelector,
  setTempTagsDataAction as setSMRTempTagsDataAction,
  reportStandardsFilterDataReducer,
  reportStandardsFilterSaga,
} from './subPages/standardsMasteryReport/common/filterDataDucks'
import {
  getTempTagsDataSelector as getERTempTagsDataSelector,
  setTempTagsDataAction as setERTempTagsDataAction,
  reportERFilterDataReducer,
} from './subPages/engagementReport/common/filterDataDucks'

import {
  reportAssessmentSummaryReducer,
  reportAssessmentSummarySaga,
} from './subPages/singleAssessmentReport/AssessmentSummary/ducks'
import {
  reportPeerPerformanceReducer,
  reportPeerPerformanceSaga,
} from './subPages/singleAssessmentReport/PeerPerformance/ducks'
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
  reducer as reportPreVsPostReducer,
  watcherSaga as reportPreVsPostSaga,
} from './subPages/multipleAssessmentReport/PreVsPost/ducks'
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
  reducer as reportPerformanceByRubricsCriteriaReducer,
  watcherSaga as reportPerformanceByRubricsCriteriaSaga,
} from './subPages/standardsMasteryReport/performanceByRubricCriteria/ducks'
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
  reducer as reportWholeLearnerReducer,
  watcherSaga as reportWholeLearnerSaga,
  selectors as reportWholeLearnerSelectors,
  actions as reportWholeLearnerActions,
} from './subPages/dataWarehouseReports/wholeLearnerReport/ducks'
import {
  reducer as reportMultipleAssessmentDwReducer,
  watcherSaga as reportMultipleAssessmentDwSaga,
  selectors as reportMultipleAssessmentDwSelectors,
  actions as reportMultipleAssessmentDwActions,
} from './subPages/dataWarehouseReports/MultipleAssessmentReport/ducks'
import * as dwAttendanceSummaryDucks from './subPages/dataWarehouseReports/AttendanceSummary/ducks'

import {
  customReportReducer,
  customReportSaga,
} from './components/customReport/ducks'
import {
  sharedReportsReducer,
  sharedReportsSaga,
} from './components/sharedReports/ducks'
import {
  getClassListSelector,
  receiveClassListAction,
  RECEIVE_CLASSLIST_ERROR,
  RECEIVE_CLASSLIST_SUCCESS,
} from '../Classes/ducks'
import {
  getCourseListSelector,
  receiveCourseListAction,
  RECEIVE_COURSE_ERROR,
  RECEIVE_COURSE_SUCCESS,
} from '../Courses/ducks'
import {
  getTeachersListSelector,
  receiveTeachersListAction,
  RECEIVE_TEACHERLIST_ERROR,
  RECEIVE_TEACHERLIST_SUCCESS,
} from '../Teacher/ducks'
import { combineNames } from './common/util'
import {
  getSchoolsSelector,
  receiveSchoolsAction,
  RECEIVE_SCHOOLS_ERROR,
  RECEIVE_SCHOOLS_SUCCESS,
} from '../Schools/ducks'
import {
  getOrgDataSelector,
  getUser,
  getUserOrgId,
} from '../src/selectors/user'
import {
  getAllTagsAction,
  getAllTagsSelector,
  SET_ALL_TAGS,
  SET_ALL_TAGS_FAILED,
} from '../TestPage/ducks'
import {
  RECEIVE_GROUPLIST_SUCCESS,
  RECEIVE_GROUPLIST_ERROR,
  getGroupListSelector,
  receiveGroupListAction,
} from '../Groups/ducks'

const SET_SHARING_STATE = '[reports] set sharing state'
const SET_PRINTING_STATE = '[reports] set printing state'
const SET_CSV_DOWNLOADING_STATE = '[reports] set csv download state'

const GENERATE_CSV_REQUEST = '[reports] generate csv request'
const SET_CSV_MODAL_VISIBLE = '[reports] set csv modal visible'
const SET_HAS_CSV_DOCS = '[reports] set hasCsvDocs'
const UPDATE_CSV_DOCS = '[reports] update csv docs'
const UPDATE_CSV_DOCS_SUCCESS = '[reports] update csv docs success'
const UPDATE_CSV_DOCS_ERROR = '[reports] update csv docs error'

const RECEIVE_TEST_LIST_REQUEST = '[reports] receive test list request'
const RECEIVE_TEST_LIST_REQUEST_SUCCESS =
  '[reports] receive test list request success'
const RECEIVE_TEST_LIST_REQUEST_ERROR =
  '[reports] receive test list request request error'

const FETCH_UPDATE_TAGS_DATA = '[reports] fetch & update tagsData'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const setSharingStateAction = createAction(SET_SHARING_STATE)
export const setPrintingStateAction = createAction(SET_PRINTING_STATE)
export const setCsvDownloadingStateAction = createAction(
  SET_CSV_DOWNLOADING_STATE
)

export const receiveTestListAction = createAction(RECEIVE_TEST_LIST_REQUEST)

export const generateCSVAction = createAction(GENERATE_CSV_REQUEST)
export const setCsvModalVisibleAction = createAction(SET_CSV_MODAL_VISIBLE)
export const setHasCsvDocsAction = createAction(SET_HAS_CSV_DOCS)
export const updateCsvDocsAction = createAction(UPDATE_CSV_DOCS)

export const fetchUpdateTagsDataAction = createAction(FETCH_UPDATE_TAGS_DATA)
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

const _testListSelectors = {}
export const createTestListSelector = (statePrefix = '') => {
  if (!(statePrefix in _testListSelectors)) {
    _testListSelectors[statePrefix] = createSelector(
      stateSelector,
      (state) => state[`${statePrefix}testList`] ?? []
    )
  }
  return _testListSelectors[statePrefix]
}

export const getTestListSelector = createSelector(
  stateSelector,
  (state) => state.testList
)

const _testListLoadingSelectors = {}
export const createTestListLoadingSelector = (statePrefix = '') => {
  if (!(statePrefix in _testListLoadingSelectors)) {
    _testListLoadingSelectors[statePrefix] = createSelector(
      stateSelector,
      (state) => state[`${statePrefix}testListLoading`] ?? true
    )
  }
  return _testListLoadingSelectors[statePrefix]
}

export const getTestListLoadingSelector = createSelector(
  stateSelector,
  (state) => state.testListLoading
)

export const getCsvModalVisible = createSelector(
  stateSelector,
  (state) => state.csvModalVisible
)

export const getHasCsvDocs = createSelector(
  stateSelector,
  (state) => state.hasCsvDocs
)

export const getCsvDocs = createSelector(
  stateSelector,
  (state) => state.csvDocs
)

export const getCsvDocsLoading = createSelector(
  stateSelector,
  (state) => state.csvDocsLoading
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
  hasCsvDocs: false,
  csvDocs: [],
  csvDocsLoading: false,
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
  [RECEIVE_TEST_LIST_REQUEST]: (state, { payload }) => {
    const { statePrefix = '' } = payload
    state[`${statePrefix}testListLoading`] = true
  },
  [RECEIVE_TEST_LIST_REQUEST_SUCCESS]: (state, { payload }) => {
    const { statePrefix = '', testList } = payload
    state[`${statePrefix}testListLoading`] = false
    state[`${statePrefix}testList`] = testList
  },
  [RECEIVE_TEST_LIST_REQUEST_ERROR]: (state, { payload }) => {
    const { statePrefix = '', error } = payload
    state[`${statePrefix}testListLoading`] = false
    state[`${statePrefix}testList`] = []
    state.error = error
  },
  [SET_CSV_MODAL_VISIBLE]: (state, { payload }) => {
    state.csvModalVisible = payload
  },
  [SET_HAS_CSV_DOCS]: (state, { payload }) => {
    state.hasCsvDocs = payload
  },
  [UPDATE_CSV_DOCS]: (state) => {
    state.csvDocsLoading = true
  },
  [UPDATE_CSV_DOCS_SUCCESS]: (state, { payload }) => {
    state.csvDocs = payload.csvDocs
    state.csvModalVisible = payload.csvModalVisible
    state.csvDocsLoading = false
  },
  [UPDATE_CSV_DOCS_ERROR]: (state, { payload }) => {
    state.error = payload.error
    state.csvDocsLoading = false
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
  reportResponseFrequencyReducer,
  reportPerformanceByStandardsReducer,
  reportPerformanceByStudentsReducer,
  reportPerformanceOverTimeReducer,
  reportPeerProgressAnalysisReducer,
  reportStudentProgressReducer,
  reportPreVsPostReducer,
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
  reportWholeLearnerReducer,
  reportMultipleAssessmentDwReducer,
  [dwAttendanceSummaryDucks.reduxNamespaceKey]:
    dwAttendanceSummaryDucks.reducer,
  reportPerformanceByRubricsCriteriaReducer,
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
  } catch (error) {
    const errorMessage =
      error.response.data?.message || 'Download request failed.'
    styledNotification({ msg: errorMessage })
  }
}

export function* updateCsvDocsSaga({ payload = {} }) {
  try {
    const { csvModalVisible = false } = payload
    // get signed download URLs for generated CSVs
    const response = yield call(reportsApi.fetchGeneratedCSVs)
    yield put({
      type: UPDATE_CSV_DOCS_SUCCESS,
      payload: { csvDocs: response, csvModalVisible },
    })
  } catch (error) {
    const errorMessage = error?.message || 'Failed to fetch secured CSVs'
    styledNotification({ msg: errorMessage })
    yield put({ type: UPDATE_CSV_DOCS_ERROR, payload: { error: errorMessage } })
  }
}

const filterMapKeys = (list, ids, key = 'name') =>
  list
    .filter((li) => ids.includes(li._id))
    .map((li) => ({ key: li._id, title: get(li, key) }))

const selectorDict = {
  [reportGroupType.SINGLE_ASSESSMENT_REPORT]: {
    getTempTags: getSARTempTagsDataSelector,
    getSettings: getReportsSARSettings,
    setTags: setSARTagsDataAction,
    setTempTags: setSARTempTagsDataAction,
    remapTags: (tags) => {
      const { courseIds, ..._tags } = tags
      return { ..._tags, courseId: courseIds?.[0] }
    },
  },
  [reportGroupType.MULTIPLE_ASSESSMENT_REPORT]: {
    getTempTags: getMARTempTagsDataSelector,
    getSettings: getReportsMARSettings,
    setTags: setMARTagsDataAction,
    setTempTags: setMARTempTagsDataAction,
    remapTags: (tags) => {
      const { courseIds, ..._tags } = tags
      return { ..._tags, courseId: courseIds?.[0] }
    },
  },
  [reportGroupType.STANDARDS_MASTERY_REPORT]: {
    getTempTags: getSMRTempTagsDataSelector,
    getSettings: getReportsSMRSettings,
    setTags: setSMRTagsDataAction,
    setTempTags: setSMRTempTagsDataAction,
    remapTags: (tags) => {
      const { courseIds, ..._tags } = tags
      return { ..._tags, courseId: courseIds?.[0] }
    },
  },
  [reportGroupType.STUDENT_PROFILE_REPORT]: {
    getTempTags: getSPRTempTagsDataSelector,
    getSettings: getReportsSPRSettings,
    setTags: setSPRTagsDataAction,
    setTempTags: setSPRTempTagsDataAction,
  },
  [reportGroupType.ENGAGEMENT_REPORT]: {
    getTempTags: getERTempTagsDataSelector,
    getSettings: getReportsERSettings,
    setTags: setERTagsDataAction,
    setTempTags: setERTempTagsDataAction,
  },
  [reportGroupType.WHOLE_STUDENT_REPORT]: {
    getTempTags: reportWholeLearnerSelectors.filterTagsData,
    getSettings: reportWholeLearnerSelectors.settings,
    setTags: reportWholeLearnerActions.setSelectedFilterTagsData,
    setTempTags: reportWholeLearnerActions.setFilterTagsData,
  },
  [reportGroupType.MULTIPLE_ASSESSMENT_REPORT_DW]: {
    getTempTags: reportMultipleAssessmentDwSelectors.filterTagsData,
    getSettings: reportMultipleAssessmentDwSelectors.settings,
    setTags: reportMultipleAssessmentDwActions.setDWMARSelectedFilterTagsData,
    setTempTags: reportMultipleAssessmentDwActions.setDWMARFilterTagsData,
  },
  [reportGroupType.DW_ATTENDANCE_SUMMARY_REPORT]: {
    getTempTags: dwAttendanceSummaryDucks.selectors.filterTagsData,
    getSettings: dwAttendanceSummaryDucks.selectors.settings,
    setTags: dwAttendanceSummaryDucks.actions.setSelectedFilterTagsData,
    setTempTags: dwAttendanceSummaryDucks.actions.setFilterTagsData,
  },
}

const uniqTags = (tagsData) =>
  mapValues(tagsData, (val) => (Array.isArray(val) ? uniqBy(val, 'key') : val))

function* updateTags(tags, type) {
  if (!selectorDict[type]) return
  if (Object.values(tags).every((tag) => isEmpty(tag))) return
  const remappedTags = selectorDict[type].remapTags
    ? selectorDict[type].remapTags(tags)
    : tags
  const tempTagsData = yield select(selectorDict[type].getTempTags)
  const tagsData = (yield select(selectorDict[type].getSettings)).tagsData
  yield put(
    selectorDict[type].setTempTags(
      uniqTags({ ...tempTagsData, ...remappedTags })
    )
  )
  yield put(
    selectorDict[type].setTags(uniqTags({ ...tagsData, ...remappedTags }))
  )
}

function* getTagFilters(ids, options) {
  let result = []
  if (Array.isArray(ids) && ids.length) {
    const type = options.tagTypes || [
      'group',
      'testitem',
      'playlist',
      'test',
      'assignment',
    ]
    yield put(getAllTagsAction({ type }))
    yield take([SET_ALL_TAGS, SET_ALL_TAGS_FAILED])
    const list = yield all(
      type.map((t) => select((state) => getAllTagsSelector(state, t)))
    )
    result = filterMapKeys(list.flat(), ids, 'tagName')
  }
  return result
}
function* getGroupTags(ids, options) {
  let result = []
  if (Array.isArray(ids) && ids.length) {
    const q = {
      limit: ids.length || 25,
      page: 1,
      districtId: options.districtId,
      search: {
        name: '',
        type: ['custom'],
        groupIds: ids,
      },
      queryType: 'OR',
    }

    yield put(receiveGroupListAction(q))
    yield take([RECEIVE_GROUPLIST_SUCCESS, RECEIVE_GROUPLIST_ERROR])
    const list = Object.values(
      yield select(getGroupListSelector)
    ).map((li) => ({ ...li, name: li._source.name }))
    result = filterMapKeys(list, ids)
  }
  return result
}
function* getTestTags(ids, options) {
  let result = []
  const { statePrefix } = options
  if (Array.isArray(ids) && ids.length) {
    const { IN_PROGRESS, IN_GRADING, DONE } = assignmentStatusOptions
    const q = {
      limit: ids.length || 25,
      page: 1,
      search: {
        searchString: '',
        statuses: [IN_PROGRESS, IN_GRADING, DONE],
        districtId: options.districtId,
        testIds: ids,
      },
      aggregate: true,

      statePrefix,
    }
    yield put(receiveTestListAction(q))
    yield take([
      RECEIVE_TEST_LIST_REQUEST_SUCCESS,
      RECEIVE_TEST_LIST_REQUEST_ERROR,
    ])
    const list = yield select(createTestListSelector(statePrefix))
    result = filterMapKeys(list, ids, 'title')
  }
  return result
}
function* getClassTags(ids, options) {
  let result = []
  if (Array.isArray(ids) && ids.length) {
    const q = {
      limit: ids.length || 25,
      page: 1,
      districtId: options.districtId,
      search: {
        name: '',
        type: ['class'],
        groupIds: ids,
      },
      queryType: 'OR',
    }
    yield put(receiveClassListAction(q))
    yield take([RECEIVE_CLASSLIST_SUCCESS, RECEIVE_CLASSLIST_ERROR])
    const list = Object.values(yield select(getClassListSelector))
    result = filterMapKeys(list, ids, '_source.name')
  }
  return result
}
function* getCourseTags(ids, options) {
  let result = []
  if (Array.isArray(ids) && ids.length) {
    const q = {
      limit: ids.length || 25,
      page: 1,
      districtId: options.districtId,
      search: {
        name: [{ type: 'cont', value: '' }],
        courseIds: ids,
      },
    }
    yield put(receiveCourseListAction(q))
    yield take([RECEIVE_COURSE_SUCCESS, RECEIVE_COURSE_ERROR])
    const list = yield select(getCourseListSelector)
    result = filterMapKeys(list, ids)
  }
  return result
}
function* getTeacherTags(ids, options) {
  let result = []
  if (Array.isArray(ids) && ids.length) {
    const q = {
      limit: ids.length || 25,
      page: 1,
      districtId: options.districtId,
      search: {},
      role: roleuser.TEACHER,
      teacherIds: ids,
    }
    if (!isEmpty(options.schoolIds)) {
      q.institutionId = options.schoolIds.join(',')
    }
    if (!isEmpty(options.termId)) {
      q.termId = options.termId
    }
    if (!isEmpty(options.testIds)) {
      q.testIds = options.testIds
    }
    yield put(receiveTeachersListAction(q))
    yield take([RECEIVE_TEACHERLIST_SUCCESS, RECEIVE_TEACHERLIST_ERROR])
    const list = combineNames(yield select(getTeachersListSelector))
    result = filterMapKeys(list, ids)
  }
  return result
}
function* getNetworkTags(ids) {
  let data = yield select(getReportsSARFilterData)
  let networks = get(data, 'data.result.networks', [])
  if (isEmpty(networks)) {
    yield take([
      GET_REPORTS_SAR_FILTER_DATA_REQUEST_SUCCESS,
      GET_REPORTS_SAR_FILTER_DATA_REQUEST_ERROR,
    ])
    data = yield select(getReportsSARFilterData)
    networks = get(data, 'data.result.networks', [])
  }
  return filterMapKeys(networks, ids)
}
function* getSchoolTags(ids, options) {
  let result = []
  if (Array.isArray(ids) && ids.length) {
    const q = {
      limit: ids.length || 25,
      page: 1,
      districtId: options.districtId,
      search: {
        name: [{ type: 'cont', value: '' }],
      },
      schoolIds: ids,
    }
    yield put(receiveSchoolsAction(q))
    yield take([RECEIVE_SCHOOLS_SUCCESS, RECEIVE_SCHOOLS_ERROR])
    const list = yield select(getSchoolsSelector)
    result = filterMapKeys(list, ids)
  }
  return result
}

const tagGetterMap = {
  tagIds: getTagFilters,
  testIds: getTestTags,
  networkIds: getNetworkTags,
  schoolIds: getSchoolTags,
  teacherIds: getTeacherTags,
  courseIds: getCourseTags,
  classIds: getClassTags,
  groupIds: getGroupTags,
  preTestId: (id, opts) => getTestTags([id], { ...opts, statePrefix: 'pre' }),
  postTestId: (id, opts) => getTestTags([id], { ...opts, statePrefix: 'post' }),
}

function* fetchUpdateTagsData({ payload }) {
  const { options = {}, type, ...keys } = payload
  try {
    const orgData = yield select(getOrgDataSelector)
    const districtId = yield select(getUserOrgId)
    const userDetails = yield select(getUser)
    const params = {
      ...orgData,
      ...options,
      districtId,
      userDetails,
    }
    const result = yield all(
      mapValues(
        omitBy(tagGetterMap, (v, k) => !keys[k]),
        (func, key) => func(keys[key], params)
      )
    )
    yield* updateTags(result, type)
  } catch (error) {
    const msg = 'Failed to update tags for autocomplete filters from url.'
    console.error(msg, '\nError =>', error.stack)
  }
}

export function* receiveTestListSaga({ payload }) {
  const { statePrefix = '', ...params } = payload
  try {
    const searchResult = yield call(assignmentApi.searchAssignments, params)
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
      payload: { testList, statePrefix },
    })
  } catch (error) {
    const msg = 'Failed to receive tests dropdown data. Please try again...'
    styledNotification({ msg })
    yield put({
      type: RECEIVE_TEST_LIST_REQUEST_ERROR,
      payload: { error: msg, statePrefix },
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
    reportResponseFrequencySaga(),
    performanceByStandardsSaga(),
    reportPerformanceByStudentsSaga(),
    reportPerformanceOverTimeSaga(),
    reportPeerProgressAnalysisSaga(),
    reportStudentProgressSaga(),
    reportPreVsPostSaga(),
    reportStudentProgressProfileSaga(),
    reportStudentProfileSummarySaga(),
    reportStudentMasteryProfileSaga(),
    reportPerformanceByRubricsCriteriaSaga(),
    reportStudentAssessmentProfileSaga(),
    reportStandardsPerformanceSummarySaga(),
    reportStandardsGradebookSaga(),
    reportStandardsProgressSaga(),
    reportEngagementSummarySaga(),
    reportActivityBySchoolSaga(),
    reportActivityByTeacherSaga(),
    customReportSaga(),
    sharedReportsSaga(),
    reportWholeLearnerSaga(),
    reportMultipleAssessmentDwSaga(),
    dwAttendanceSummaryDucks.watcherSaga(),
    takeEvery(GENERATE_CSV_REQUEST, generateCSVSaga),
    takeEvery(UPDATE_CSV_DOCS, updateCsvDocsSaga),
    takeEvery(RECEIVE_TEST_LIST_REQUEST, receiveTestListSaga),
    takeEvery(FETCH_UPDATE_TAGS_DATA, fetchUpdateTagsData),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
