import { createSlice } from 'redux-starter-kit'
import { RESET_ALL_REPORTS } from '../../../../common/reportsRedux'
import { staticDropDownData } from '../utils'

const reduxNamespaceKey = 'reportDwDashboard'

const initialState = {
  firstLoad: true,

  loadingFiltersData: false,
  filtersData: {},
  filtersTabKey: staticDropDownData.filterSections.TEST_FILTERS.key,
  filters: {
    ...staticDropDownData.initialFilters,
  },
  filterTagsData: {},

  settings: {
    requestFilters: {
      // ...staticDropDownData.requestFilters,
    },
    selectedFilterTagsData: {},
    selectedCompareBy: {},
    academicSummaryFilters: {},
  },
  error: '',
  loadingAcademicSummaryData: false,
  loadingAttendanceSummaryData: false,
  loadingTableData: false,
  academicSummaryData: {},
  attendanceSummaryData: {},
  tableData: {},
  academicSummaryRequestError: '',
  attendanceSummaryRequestError: '',
  tableDataRequestError: '',
}
const slice = createSlice({
  slice: reduxNamespaceKey,
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
    setFirstLoad: (state, { payload }) => {
      state.firstLoad = payload
    },
    setFiltersTabKey: (state, { payload }) => {
      state.filtersTabKey = payload
    },
    setFilters: (state, { payload }) => {
      state.filters = { ...payload }
    },
    setFilterTagsData: (state, { payload }) => {
      state.filterTagsData = payload
    },
    resetFiltersData: (state) => {
      state.filtersData = {}
    },
    setSettings: (state, { payload }) => {
      state.settings = payload
    },
    setAcademicSummaryFilters: (state, { payload }) => {
      state.settings.academicSummaryFilters = payload
    },
    setSelectedFilterTagsData: (state, { payload }) => {
      state.settings.selectedFilterTagsData = payload
    },
    fetchAcademicSummaryDataRequest: (state) => {
      state.loadingAcademicSummaryData = true
    },
    fetchAcademicSummaryDataRequestSuccess: (state, { payload }) => {
      state.loadingAcademicSummaryData = false
      state.academicSummaryData = payload.academicSummaryData
      state.academicSummaryError = ''
    },
    fetchAcademicSummaryDataRequestError: (state, { payload }) => {
      state.loadingAcademicSummaryData = false
      state.academicSummaryError = payload.error
      state.academicSummaryData = {}
    },
    fetchAttendanceSummaryDataRequest: (state) => {
      state.loadingAttendanceSummaryData = true
    },
    fetchAttendanceSummaryDataRequestSuccess: (state, { payload }) => {
      state.loadingAttendanceSummaryData = false
      state.attendanceSummaryData = payload.attendanceSummaryData
      state.attendanceSummaryError = ''
    },
    fetchAttendanceSummaryDataRequestError: (state, { payload }) => {
      state.loadingAttendanceSummaryData = false
      state.attendanceSummaryError = payload.error
      state.attendanceSummaryData = {}
    },
    fetchDashboardTableDataRequest: (state) => {
      state.loadingTableData = true
    },
    fetchDashboardTableDataRequestSuccess: (state, { payload }) => {
      state.loadingTableData = false
      state.tableData = payload.tableData
      state.tableDataRequestError = ''
    },
    fetchDashboardTableDataRequestError: (state, { payload }) => {
      state.loadingTableData = false
      state.tableDataRequestError = payload.error
      state.tableData = {}
    },
    resetReport: () => ({ ...initialState }),
  },
  extraReducers: {
    [RESET_ALL_REPORTS]: () => ({ ...initialState }),
  },
})

export const { actions, reducer } = slice
export { reduxNamespaceKey }
