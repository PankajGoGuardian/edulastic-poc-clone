import { createSlice } from 'redux-starter-kit'
import { RESET_ALL_REPORTS } from '../../../../common/reportsRedux'
import { staticDropDownData } from '../utils/constants'

const reduxNamespaceKey = 'reportDwAttendance'

const initialState = {
  firstLoad: true,

  loadingFiltersData: false,
  filtersData: {},
  filtersTabKey: staticDropDownData.filterSections.STUDENT_FILTERS.key,
  filters: {
    ...staticDropDownData.initialFilters,
  },
  filterTagsData: {},

  settings: {
    requestFilters: {},
    selectedFilterTagsData: {},
    selectedCompareBy: {},
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
    setSelectedFilterTagsData: (state, { payload }) => {
      state.settings.selectedFilterTagsData = payload
    },
    resetReport: () => ({ ...initialState }),
  },
  extraReducers: {
    [RESET_ALL_REPORTS]: () => ({ ...initialState }),
  },
})

const {
  fetchFiltersDataRequest,
  fetchFiltersDataRequestSuccess,
  fetchFiltersDataRequestError,
  setFirstLoad,
  setFiltersTabKey,
  setFilters,
  setFilterTagsData,
  resetFiltersData,
  setSettings,
  setSelectedFilterTagsData,
  resetReport,
} = slice.actions

export const actions = {
  fetchFiltersDataRequest,
  fetchFiltersDataRequestSuccess,
  fetchFiltersDataRequestError,
  setFirstLoad,
  setFiltersTabKey,
  setFilters,
  setFilterTagsData,
  resetFiltersData,
  setSettings,
  setSelectedFilterTagsData,
  resetReport,
}

export const { reducer } = slice

export { reduxNamespaceKey }
