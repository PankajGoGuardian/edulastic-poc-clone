import { notification } from '@edulastic/common'
import { createSlice } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { call, put, all, takeLatest } from 'redux-saga/effects'
// import { get, pick } from 'lodash'

import { reportsApi, dataWarehouseApi } from '@edulastic/api'
import { EXTERNAL_SCORE_TYPES } from '@edulastic/constants/reportUtils/dataWarehouseReports'

import { staticDropDownData } from './utils'
import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

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
    frontEndFilters: {
      externalScoretype: EXTERNAL_SCORE_TYPES.SCALED_SCORE,
    },
    selectedFilterTagsData: {},
    selectedCompareBy: {},
  },
  loadingReportTableData: false,
  loadingReportChartData: false,
  reportChartData: {},
  reportTableData: {},
  error: '',
  selectedTests: [],
}

// -----|-----|-----|-----| SLICE BEGIN |-----|-----|-----|----- //

const slice = createSlice({
  name: 'multipleAssessmentReportDw', //! FIXME key should be `slice` not `name`
  initialState: { ...initialState },
  reducers: {
    fetchDWMARFiltersDataRequest: (state) => {
      state.loadingFiltersData = true
    },
    fetchDWMARFiltersDataRequestSuccess: (state, { payload }) => {
      state.loadingFiltersData = false
      state.filtersData = payload.filtersData
      state.error = ''
    },
    fetchDWMARFiltersDataRequestError: (state, { payload }) => {
      state.loadingFiltersData = false
      state.error = payload.error
    },
    setDWMARFirstLoad: (state, { payload }) => {
      state.firstLoad = payload
    },
    setDWMARFiltersTabKey: (state, { payload }) => {
      state.filtersTabKey = payload
    },
    setDWMARFilters: (state, { payload }) => {
      state.filters = { ...payload }
    },
    setDWMARFilterTagsData: (state, { payload }) => {
      state.filterTagsData = payload
    },
    setDWMARSelectedFilterTagsData: (state, { payload }) => {
      state.settings.selectedFilterTagsData = payload
    },
    setDWMARPrevFiltersData: (state, { payload }) => {
      state.prevFiltersData = payload
    },
    resetDWMARFiltersData: (state) => {
      state.filtersData = {}
    },
    setDWMARSettings: (state, { payload }) => {
      state.settings = payload
    },
    fetchDWMARChartDataRequest: (state) => {
      state.loadingReportChartData = true
    },
    fetchDWMARChartDataRequestSuccess: (state, { payload }) => {
      state.loadingReportChartData = false
      state.reportChartData = payload.reportChartData
      state.error = ''
    },
    fetchDWMARChartDataRequestError: (state, { payload }) => {
      state.loadingReportChartData = false
      state.error = payload.error
    },
    fetchDWMARTableDataRequest: (state) => {
      state.loadingReportTableData = true
    },
    fetchDWMARTableDataRequestSuccess: (state, { payload }) => {
      state.loadingReportTableData = false
      state.reportTableData = payload.reportTableData
      state.error = ''
    },
    fetchDWMARTableDataRequestError: (state, { payload }) => {
      state.loadingReportTableData = false
      state.error = payload.error
    },
    setSelectedTests: (state, { payload }) => {
      state.selectedTests = payload
    },
    resetDWMARReport: () => ({ ...initialState }),
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
    const filtersData = yield call(reportsApi.fetchMARFilterData, payload)
    yield put(actions.fetchDWMARFiltersDataRequestSuccess({ filtersData }))
  } catch (error) {
    const msg =
      'Error getting filter data. Please try again after a few minutes.'
    notification({ msg })
    yield put(actions.fetchDWMARFiltersDataRequestError({ error: msg }))
  }
}

function* fetchMARChartDataRequestSaga({ payload }) {
  try {
    const reportChartData = yield call(
      dataWarehouseApi.getMARChartMetrics,
      payload
    )
    const dataSizeExceeded = reportChartData?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put(
        actions.fetchDWMARChartDataRequestError({
          error: { ...reportChartData.data },
        })
      )
      return
    }
    yield put(actions.fetchDWMARChartDataRequestSuccess({ reportChartData }))
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Error fetching performance trends data. Please try again after a few minutes.'
    notification({ msg })
    yield put(actions.fetchDWMARChartDataRequestError({ error: msg }))
  }
}

function* fetchMARTableDataRequestSaga({ payload }) {
  try {
    const reportTableData = yield call(
      dataWarehouseApi.getMARTableMetrics,
      payload
    )
    const dataSizeExceeded = reportTableData?.data?.dataSizeExceeded || false
    if (dataSizeExceeded) {
      yield put(
        actions.fetchDWMARTableDataRequestError({
          error: { ...reportTableData.data },
        })
      )
      return
    }
    yield put(actions.fetchDWMARTableDataRequestSuccess({ reportTableData }))
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Error fetching performance trends data. Please try again after a few minutes.'
    notification({ msg })
    yield put(actions.fetchDWMARTableDataRequestError({ error: msg }))
  }
}

export function* watcherSaga() {
  yield all([
    takeLatest(
      actions.fetchDWMARFiltersDataRequest,
      fetchFiltersDataRequestSaga
    ),
    takeLatest(
      actions.fetchDWMARChartDataRequest,
      fetchMARChartDataRequestSaga
    ),
    takeLatest(
      actions.fetchDWMARTableDataRequest,
      fetchMARTableDataRequestSaga
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

const stateSelector = (state) =>
  state.reportReducer.reportMultipleAssessmentDwReducer

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
const loadingReportChartData = createSelector(
  stateSelector,
  (state) => state.loadingReportChartData
)
const loadingReportTableData = createSelector(
  stateSelector,
  (state) => state.loadingReportTableData
)
const settings = createSelector(stateSelector, (state) => state.settings)
const reportChartData = createSelector(
  stateSelector,
  (state) => state.reportChartData
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
  loadingReportChartData,
  loadingReportTableData,
  settings,
  reportChartData,
  reportTableData,
  error,
}

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //
