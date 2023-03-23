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
const loadingTableData = createSelector(
  stateSelector,
  (state) => state.loadingTableData
)
const tableData = createSelector(stateSelector, (state) => state.tableData)
const tableDataRequestError = createSelector(
  stateSelector,
  (state) => state.tableDataRequestError
)

export {
  firstLoad,
  loadingFiltersData,
  filtersData,
  filtersTabKey,
  filters,
  filterTagsData,
  settings,
  error,
  loadingTableData,
  tableData,
  tableDataRequestError,
}
