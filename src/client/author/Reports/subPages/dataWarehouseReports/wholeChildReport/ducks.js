import { notification } from '@edulastic/common'
import { createSlice } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { call, put, all, takeLatest } from 'redux-saga/effects'
import { get, pick } from 'lodash'

import { dataWarehouseApi, reportsApi } from '@edulastic/api'

import { staticDropDownData, getStudentName } from './utils'
import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const initialState = {
  firstLoad: true,
  loadingFiltersData: false,
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
  filters: {
    ...staticDropDownData.initialFilters,
  },
  filterTagsData: {},
  settings: {
    selectedStudent: { key: '', title: '' },
    requestFilters: {
      termId: '',
      reportId: '',
      courseId: '',
      grade: '',
      subject: '',
      performanceBandProfileId: '',
      standardsProficiencyProfileId: '',
    },
    //   standardFilters: {
    //     domainIds: '',
    //     standardIds: '',
    //   },
    selectedFilterTagsData: {},
    selectedStudentInformation: {},
    selectedStudentClassData: {},
  },
  loadingReportData: false,
  reportData: {},
  error: '',
}

// -----|-----|-----|-----| SLICE BEGIN |-----|-----|-----|----- //

const slice = createSlice({
  name: 'wholeChildReport',
  initialState,
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
      state.loadingFiltersData = true
    },
    fetchStudentsDataRequestSuccess: (state, { payload }) => {
      state.loadingFiltersData = false
      state.studentsData = {
        studentsListQuery: payload.studentsData.studentsListQuery,
        studentsList: payload.studentsData.studentsList,
      }
      state.error = ''
    },
    fetchStudentsDataRequestError: (state, { payload }) => {
      state.loadingFiltersData = false
      state.error = payload.error
    },
    setFirstLoad: (state, { payload }) => {
      state.firstLoad = payload
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
    resetReport: () => ({ ...initialState }),
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
    const studentsList = get(result, 'data.result', []).map((item) => ({
      _id: item._id,
      title: getStudentName(item),
    }))
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
      : pick(payload, ['studentId', 'termId'])
    const reportData = yield call(dataWarehouseApi.getWholeChildReport, params)
    const dataSizeExceeded = reportData?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put(
        actions.fetchReportDataRequestError({ error: { ...reportData.data } })
      )
      return
    }
    yield put(actions.fetchReportDataRequestSuccess({ reportData }))
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Error fetching whole child report data. Please try again after a few minutes.'
    notification({ msg })
    yield put(actions.fetchReportDataRequestError({ error: msg }))
  }
}

export function* watcherSaga() {
  yield all([
    takeLatest(actions.fetchFiltersDataRequest, fetchFiltersDataRequestSaga),
    takeLatest(actions.fetchStudentsDataRequest, fetchStudentsDataRequestSaga),
    takeLatest(actions.fetchReportDataRequest, fetchReportDataRequestSaga),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

const stateSelector = (state) => state.reportReducer.reportWholeChildReducer

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
const filters = createSelector(stateSelector, (state) => state.filters)
const filterTagsData = createSelector(
  stateSelector,
  (state) => state.filterTagsData
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
  (state) => state.loadingFiltersData
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
const settings = createSelector(stateSelector, (state) => state.settings)
const reportData = createSelector(stateSelector, (state) => state.reportData)
const error = createSelector(stateSelector, (state) => state.error)

export const selectors = {
  firstLoad,
  loadingFiltersData,
  prevFiltersData,
  student,
  filtersData,
  filters,
  filterTagsData,
  selectedPerformanceBandProfileId,
  selectedStandardsProficiencyProfileId,
  selectedPerformanceBand,
  selectedStandardsProficiency,
  loadingStudentsData,
  studentsList,
  studentsListQuery,
  loadingReportData,
  settings,
  reportData,
  error,
}

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //
