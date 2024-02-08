import { notification } from '@edulastic/common'
import { createSlice } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { call, put, all, takeLatest } from 'redux-saga/effects'
import { get, pick } from 'lodash'

import { dataWarehouseApi, reportsApi } from '@edulastic/api'

import { staticDropDownData } from './utils'
import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'
import { getStudentsList } from '../../../common/util'

const initialState = {
  firstLoad: true,
  loadingFiltersData: false,
  loadingStudentList: false,
  prevFiltersData: null,
  filtersData: {},
  studentsData: {
    studentsListQuery: null,
    studentsList: [],
  },
  student: {
    key: '',
    title: '',
  },
  filtersTabKey: staticDropDownData.filterSections.STUDENT_FILTERS.key,
  filters: {
    ...staticDropDownData.initialFilters,
  },
  filterTagsData: {},
  settings: {
    selectedStudent: { key: '', title: '' },
    requestFilters: {
      termId: '',
      reportId: '',
      courseIds: '',
      grade: '',
      subject: '',
      standardsProficiencyProfileId: '',
    },
    frontEndFilters: {
      testTypes: '',
      performanceBandProfileId: '',
    },
    //   standardFilters: {
    //     domainIds: '',
    //     standardIds: '',
    //   },
    selectedFilterTagsData: {},
    selectedStudentInformation: {},
    selectedStudentClassData: [],
  },
  loadingReportData: false,
  reportData: {},
  loadingAttendanceData: false,
  attendanceData: {},
  loadingMasteryData: false,
  studentMasteryProfile: {},
  SPRFFilterData: {},
  loadingSPRFFilterData: false,
  error: '',
}

// -----|-----|-----|-----| SLICE BEGIN |-----|-----|-----|----- //

const slice = createSlice({
  name: 'wholeLearnerReport', //! FIXME key should be `slice` not `name`
  initialState: { ...initialState },
  reducers: {
    fetchFiltersDataRequest: (state) => {
      state.loadingFiltersData = true
    },
    fetchFiltersDataRequestSuccess: (state, { payload }) => {
      state.loadingFiltersData = false
      state.filtersData = payload.filtersData
      state.error = ''
    },
    fetchFiltersDataRequestError: (state, { payload }) => {
      state.loadingFiltersData = false
      state.error = payload.error
    },
    fetchStudentsDataRequest: (state) => {
      state.loadingStudentList = true
    },
    fetchStudentsDataRequestSuccess: (state, { payload }) => {
      state.loadingStudentList = false
      state.studentsData = {
        studentsListQuery: payload.studentsData.studentsListQuery,
        studentsList: payload.studentsData.studentsList,
      }
      state.error = ''
    },
    fetchStudentsDataRequestError: (state, { payload }) => {
      state.loadingStudentList = false
      state.error = payload.error
    },
    fetchStudentsMasteryDataRequest: (state) => {
      state.loadingMasteryData = true
    },
    fetchStudentsMasteryDataRequestSuccess: (state, { payload }) => {
      state.loadingMasteryData = false
      state.studentMasteryProfile = payload.studentMasteryProfile
      state.error = ''
    },
    fetchStudentsMasteryDataRequestError: (state, { payload }) => {
      state.loadingMasteryData = false
      state.error = payload.error
    },
    fetchSPRFFilterDataRequest: (state) => {
      state.loadingSPRFFilterData = true
    },
    fetchSPRFFilterDataRequestSuccess: (state, { payload }) => {
      state.loadingSPRFFilterData = false
      state.SPRFFilterData = payload.SPRFFilterData
      state.error = ''
    },
    fetchSPRFFilterDataRequestError: (state, { payload }) => {
      state.loadingSPRFFilterData = false
      state.error = payload.error
    },
    setFirstLoad: (state, { payload }) => {
      state.firstLoad = payload
    },
    setFiltersTabKey: (state, { payload }) => {
      state.filtersTabKey = payload
    },
    setFilters: (state, { payload }) => {
      state.filters = { ...payload }
    },
    setStudent: (state, { payload }) => {
      state.student = payload
    },
    setFilterTagsData: (state, { payload }) => {
      state.filterTagsData = payload
    },
    setPrevFiltersData: (state, { payload }) => {
      state.prevFiltersData = payload
    },
    resetFiltersData: (state) => {
      state.filtersData = {}
    },
    setSettings: (state, { payload }) => {
      state.settings = payload
    },
    setSelectedFilterTagsData: (state, { payload }) => {
      state.settings.selectedFilterTagsData = payload
    },
    setTestTypes: (state, { payload }) => {
      state.settings.frontEndFilters.testTypes = payload
    },
    fetchReportDataRequest: (state) => {
      state.loadingReportData = true
    },
    fetchReportDataRequestSuccess: (state, { payload }) => {
      state.loadingReportData = false
      state.reportData = payload.reportData
      state.error = ''
    },
    fetchReportDataRequestError: (state, { payload }) => {
      state.loadingReportData = false
      state.error = payload.error
    },
    fetchAttendanceDataRequest: (state) => {
      state.loadingAttendanceData = true
    },
    fetchAttendanceDataRequestSuccess: (state, { payload }) => {
      state.loadingAttendanceData = false
      state.attendanceData = payload.attendanceData.data.result
      state.error = ''
    },
    fetchAttendanceDataRequestError: (state, { payload }) => {
      state.loadingAttendanceData = false
      state.attendanceData = []
      state.error = payload.error
    },
    resetDWWholeLearnerReport: () => ({ ...initialState }),
  },
  extraReducers: {
    [RESET_ALL_REPORTS]: () => ({ ...initialState }),
  },
})

export const { actions, reducer } = slice

// -----|-----|-----|-----| SLICE ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* fetchFiltersDataRequestSaga({ payload }) {
  try {
    const filtersData = yield call(reportsApi.fetchSPRFilterData, payload)
    yield put(actions.fetchFiltersDataRequestSuccess({ filtersData }))
  } catch (error) {
    const msg =
      'Error getting filter data. Please try again after a few minutes.'
    notification({ msg })
    yield put(actions.fetchFiltersDataRequestError({ error: msg }))
  }
}

function* fetchStudentsDataRequestSaga({ payload }) {
  try {
    const result = yield call(reportsApi.fetchStudentList, payload)
    const studentsList = getStudentsList(get(result, 'data.result', []))
    yield put(
      actions.fetchStudentsDataRequestSuccess({
        studentsData: {
          studentsListQuery: payload,
          studentsList,
        },
      })
    )
  } catch (err) {
    const msg = 'Unable to fetch students list.'
    notification({ type: 'error', msg })
    yield put(actions.fetchStudentsDataRequestError({ error: msg }))
  }
}

function* fetchReportDataRequestSaga({ payload }) {
  try {
    const params = payload.reportId
      ? pick(payload, ['reportId'])
      : {
          ...pick(payload, [
            'studentId',
            'termId',
            'testTermIds',
            'testUniqIds',
            'testGrades',
            'testSubjects',
            'tagIds',
          ]),
          assessmentTypes: payload.testTypes,
        }

    const reportData = yield call(
      dataWarehouseApi.getWholeLearnerReport,
      params
    )
    const dataSizeExceeded = reportData?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put(
        actions.fetchReportDataRequestError({ error: { ...reportData.data } })
      )
      return
    }
    yield put(actions.fetchReportDataRequestSuccess({ reportData }))
  } catch (error) {
    const msg =
      'Error fetching whole learner data. Please try again after a few minutes.'
    notification({ type: 'error', msg })
    yield put(actions.fetchReportDataRequestError({ error: msg }))
  }
}

function* fetchStudentsMasteryDataRequestSaga({ payload }) {
  try {
    const studentMasteryProfile = yield call(
      reportsApi.fetchStudentMasteryProfileReport,
      payload
    )
    const dataSizeExceeded =
      studentMasteryProfile?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put(
        actions.fetchStudentsMasteryDataRequestError({
          error: { ...studentMasteryProfile.data },
        })
      )
      return
    }
    yield put(
      actions.fetchStudentsMasteryDataRequestSuccess({ studentMasteryProfile })
    )
  } catch (error) {
    const msg =
      'Error getting student mastery profile report data. Please try again after a few minutes.'
    notification({ msg, type: 'error' })
    yield put(actions.fetchStudentsMasteryDataRequestError({ error: msg }))
  }
}

function* fetchSPRFFilterDataRequestSaga({ payload }) {
  try {
    const SPRFFilterData = yield call(reportsApi.fetchSPRFilterData, payload)

    yield put(actions.fetchSPRFFilterDataRequestSuccess({ SPRFFilterData }))
  } catch (error) {
    const msg =
      'Error getting filter data. Please try again after a few minutes.'
    notification({ msg })
    yield put(actions.fetchSPRFFilterDataRequestError({ error: msg }))
  }
}

function* fetchAttendanceDataRequestSaga({ payload }) {
  try {
    const params = payload.reportId
      ? pick(payload, ['reportId'])
      : pick(payload, ['studentId', 'termId'])
    const attendanceData = yield call(
      dataWarehouseApi.getAttendanceMetrics,
      params
    )
    const dataSizeExceeded = attendanceData?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put(
        actions.fetchReportDataRequestError({
          error: { ...attendanceData.data },
        })
      )
      return
    }
    yield put(actions.fetchAttendanceDataRequestSuccess({ attendanceData }))
  } catch (error) {
    const msg =
      'Error fetching attendance data. Please try again after a few minutes.'
    notification({ type: 'error', msg })
    yield put(actions.fetchAttendanceDataRequestError({ error: msg }))
  }
}

export function* watcherSaga() {
  yield all([
    takeLatest(actions.fetchFiltersDataRequest, fetchFiltersDataRequestSaga),
    takeLatest(actions.fetchStudentsDataRequest, fetchStudentsDataRequestSaga),
    takeLatest(actions.fetchReportDataRequest, fetchReportDataRequestSaga),
    takeLatest(
      actions.fetchAttendanceDataRequest,
      fetchAttendanceDataRequestSaga
    ),
    takeLatest(
      actions.fetchSPRFFilterDataRequest,
      fetchSPRFFilterDataRequestSaga
    ),
    takeLatest(
      actions.fetchStudentsMasteryDataRequest,
      fetchStudentsMasteryDataRequestSaga
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

const stateSelector = (state) => state.reportReducer.reportWholeLearnerReducer

const firstLoad = createSelector(stateSelector, (state) => state.firstLoad)
const loadingFiltersData = createSelector(
  stateSelector,
  (state) => state.loadingFiltersData
)
const prevFiltersData = createSelector(
  stateSelector,
  (state) => state.prevFiltersData
)
const student = createSelector(stateSelector, (state) => state.student)
const filtersData = createSelector(stateSelector, (state) => state.filtersData)
const filtersTabKey = createSelector(
  stateSelector,
  (state) => state.filtersTabKey
)
const filters = createSelector(stateSelector, (state) => state.filters)
const filterTagsData = createSelector(
  stateSelector,
  (state) => state.filterTagsData
)
const selectedFilterTagsData = createSelector(
  stateSelector,
  (state) => state.settings.selectedFilterTagsData
)
const selectedPerformanceBandProfileId = createSelector(
  stateSelector,
  (state) => state?.filters?.performanceBandProfileId || ''
)
const selectedStandardsProficiencyProfileId = createSelector(
  stateSelector,
  (state) => state?.filters?.standardsProficiencyProfileId || ''
)
const selectedPerformanceBand = createSelector(
  filtersData,
  selectedPerformanceBandProfileId,
  (_filtersData, _selectedPerformanceBandProfileId) => {
    const bands = _filtersData?.data?.result?.bandInfo || []
    return (
      bands.find((x) => x._id === _selectedPerformanceBandProfileId) || bands[0]
    )?.performanceBand
  }
)
const selectedStandardsProficiency = createSelector(
  filtersData,
  selectedStandardsProficiencyProfileId,
  (_filtersData, _selectedStandardsProficiencyProfileId) => {
    const scales = _filtersData?.data?.result?.scaleInfo || []
    return (
      scales.find((x) => x._id === _selectedStandardsProficiencyProfileId) ||
      scales[0]
    )?.scale
  }
)
const loadingStudentsData = createSelector(
  stateSelector,
  (state) => state.loadingStudentList
)
const studentsList = createSelector(
  stateSelector,
  (state) => state.studentsData.studentsList
)
const studentsListQuery = createSelector(
  stateSelector,
  (state) => state.studentsData.studentsListQuery
)
const loadingReportData = createSelector(
  stateSelector,
  (state) => state.loadingReportData
)
const loadingMasteryData = createSelector(
  stateSelector,
  (state) => state.loadingMasteryData
)
const loadingSPRFFilterData = createSelector(
  stateSelector,
  (state) => state.loadingSPRFFilterData
)
const settings = createSelector(stateSelector, (state) => state.settings)
const reportData = createSelector(stateSelector, (state) => state.reportData)
const error = createSelector(stateSelector, (state) => state.error)
const attendanceData = createSelector(
  stateSelector,
  (state) => state.attendanceData
)
const loadingAttendanceData = createSelector(
  stateSelector,
  (state) => state.loadingAttendanceData
)
const studentMasteryProfile = createSelector(
  stateSelector,
  (state) => state.studentMasteryProfile
)
const SPRFFilterData = createSelector(
  stateSelector,
  (state) => state.SPRFFilterData
)

export const selectors = {
  firstLoad,
  loadingFiltersData,
  prevFiltersData,
  student,
  filtersData,
  filtersTabKey,
  filters,
  filterTagsData,
  selectedFilterTagsData,
  selectedPerformanceBandProfileId,
  selectedStandardsProficiencyProfileId,
  selectedPerformanceBand,
  selectedStandardsProficiency,
  loadingStudentsData,
  studentsList,
  studentsListQuery,
  loadingReportData,
  loadingMasteryData,
  loadingSPRFFilterData,
  settings,
  reportData,
  error,
  attendanceData,
  loadingAttendanceData,
  studentMasteryProfile,
  SPRFFilterData,
}

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //
