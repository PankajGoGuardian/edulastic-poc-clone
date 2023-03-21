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
    resetReport: () => ({ ...initialState }),
  },
  extraReducers: {
    [RESET_ALL_REPORTS]: () => ({ ...initialState }),
  },
})

export const { actions, reducer } = slice
export { reduxNamespaceKey }
