import { createSelector } from 'reselect'
import { reduxNamespaceKey } from './actionReducers'

const stateSelector = (state) => state.reportReducer[reduxNamespaceKey]

const firstLoad = createSelector(stateSelector, (state) => state.firstLoad)
const selectedTests = createSelector(
  stateSelector,
  (state) => state.selectedTests
)
const loadingFiltersData = createSelector(
  stateSelector,
  (state) => state.loadingFiltersData
)
const prevFiltersData = createSelector(
  stateSelector,
  (state) => state.prevFiltersData
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
const selectedFilterTagsData = createSelector(
  stateSelector,
  (state) => state.settings.selectedFilterTagsData
)
const settings = createSelector(stateSelector, (state) => state.settings)
const loadingReportSummaryData = createSelector(
  stateSelector,
  (state) => state.loadingReportSummaryData
)
const loadingReportTableData = createSelector(
  stateSelector,
  (state) => state.loadingReportTableData
)
const reportSummaryData = createSelector(
  stateSelector,
  (state) => state.reportSummaryData
)
const reportTableData = createSelector(
  stateSelector,
  (state) => state.reportTableData
)
const error = createSelector(stateSelector, (state) => state.error)

export const selectors = {
  firstLoad,
  selectedTests,
  loadingFiltersData,
  prevFiltersData,
  filtersData,
  filtersTabKey,
  filters,
  filterTagsData,
  selectedFilterTagsData,
  settings,
  loadingReportSummaryData,
  loadingReportTableData,
  reportSummaryData,
  reportTableData,
  error,
}
