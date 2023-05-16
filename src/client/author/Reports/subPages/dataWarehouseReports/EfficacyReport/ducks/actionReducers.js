import { createSlice } from 'redux-starter-kit'
import { RESET_ALL_REPORTS } from '../../../../common/reportsRedux'

import { staticDropDownData } from '../utils'

const reduxNamespaceKey = 'reportDwEfficacy'

const initialState = {
  firstLoad: true,
  loadingFiltersData: false,
  prevFiltersData: null,
  filtersData: {},
  filtersTabKey: staticDropDownData.filterSections.TEST_FILTERS.key,
  filters: {
    ...staticDropDownData.initialFilters,
  },
  filterTagsData: {},
  settings: {
    requestFilters: {
      ...staticDropDownData.requestFilters,
    },
    selectedFilterTagsData: {},
    selectedCompareBy: {},
  },
  loadingReportSummaryData: false,
  loadingReportTableData: false,
  reportSummaryData: {},
  reportTableData: {},
  error: '',
  selectedTests: [],
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
    fetchReportSummaryDataRequest: (state) => {
      state.loadingReportSummaryData = true
    },
    fetchReporSummaryDataRequestSuccess: (state, { payload }) => {
      state.loadingReportSummaryData = false
      state.reportSummaryData = payload.reportSummaryData
      state.error = ''
    },
    fetchReportSummaryDataRequestError: (state, { payload }) => {
      state.loadingReportSummaryData = false
      state.error = payload.error
      state.reportSummaryData = {}
    },
    fetchReportTableDataRequest: (state) => {
      state.loadingReportTableData = true
    },
    fetchReportTableDataRequestSuccess: (state, { payload }) => {
      state.loadingReportTableData = false
      state.reportTableData = payload.reportTableData
      state.error = ''
    },
    fetchReportTableDataRequestError: (state, { payload }) => {
      state.loadingReportTableData = false
      state.error = payload.error
      state.reportTableData = {}
    },
    resetEfficacyReport: () => ({ ...initialState }),
    // todo - sort it out later
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
    setSelectedTests: (state, { payload }) => {
      state.selectedTests = payload
    },
  },
  extraReducers: {
    [RESET_ALL_REPORTS]: () => ({ ...initialState }),
  },
})

export const { actions, reducer } = slice
export { reduxNamespaceKey }
