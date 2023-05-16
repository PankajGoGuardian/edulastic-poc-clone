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
const selectedFilterTagsData = createSelector(
  stateSelector,
  (state) => state.settings.selectedFilterTagsData
)
const settings = createSelector(stateSelector, (state) => state.settings)
const error = createSelector(stateSelector, (state) => state.error)

export {
  firstLoad,
  loadingFiltersData,
  filtersData,
  filtersTabKey,
  filters,
  filterTagsData,
  selectedFilterTagsData,
  settings,
  error,
}
