import { createSelector } from 'reselect'

const stateSelector = (state) => state.reportReducer.reportPreVsPostReducer

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
  loadingReportSummaryData,
  loadingReportTableData,
  reportSummaryData,
  reportTableData,
  error,
}
