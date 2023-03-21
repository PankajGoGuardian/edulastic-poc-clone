import { createSelector } from 'reselect'
import { reduxNamespaceKey } from './actionReducers'

const stateSelector = (state) => state.reportReducer[reduxNamespaceKey]

// report filter selectors
const firstLoad = createSelector(stateSelector, (state) => state.firstLoad)

const loadingFiltersData = createSelector(
  stateSelector,
  (state) => state.loadingFiltersData
)
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
const settings = createSelector(stateSelector, (state) => state.settings)
const error = createSelector(stateSelector, (state) => state.error)

// Report Data selectors
const loadingAcademicSummaryData = createSelector(
  stateSelector,
  (state) => state.loadingAcademicSummaryData
)
const loadingAttendanceSummaryData = createSelector(
  stateSelector,
  (state) => state.loadingAttendanceSummaryData
)
const loadingTableData = createSelector(
  stateSelector,
  (state) => state.loadingTableData
)
const academicSummaryData = createSelector(
  stateSelector,
  (state) => state.academicSummaryData
)
const attendanceSummaryData = createSelector(
  stateSelector,
  (state) => state.attendanceSummaryData
)
const tableData = createSelector(stateSelector, (state) => state.tableData)
const academicSummaryRequestError = createSelector(
  stateSelector,
  (state) => state.academicSummaryRequestError
)
const attendanceRequestSummaryError = createSelector(
  stateSelector,
  (state) => state.attendanceRequestSummaryError
)
const tableDataRequestError = createSelector(
  stateSelector,
  (state) => state.tableDataRequestError
)

const selectors = {
  firstLoad,
  loadingFiltersData,
  filtersData,
  filtersTabKey,
  filters,
  filterTagsData,
  settings,
  error,
  loadingAcademicSummaryData,
  loadingAttendanceSummaryData,
  loadingTableData,
  academicSummaryData,
  attendanceSummaryData,
  tableData,
  academicSummaryRequestError,
  attendanceRequestSummaryError,
  tableDataRequestError,
}

export default selectors
