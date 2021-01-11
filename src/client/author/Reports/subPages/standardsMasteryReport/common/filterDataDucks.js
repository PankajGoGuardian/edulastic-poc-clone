import { createAction, createReducer } from 'redux-starter-kit'
import { takeLatest, call, put, all } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { get } from 'lodash'

import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

import staticDropDownData from './static/json/staticDropDownData.json'

const GET_REPORTS_STANDARDS_FILTERS_REQUEST =
  '[reports] get reports standards filters request'
const GET_REPORTS_STANDARDS_FILTERS_REQUEST_SUCCESS =
  '[reports] get reports standards filters success'
const GET_REPORTS_STANDARDS_FILTERS_REQUEST_ERROR =
  '[reports] get reports standards filters error'
const SET_REPORTS_PREV_STANDARDS_FILTERS =
  '[reports] get reports prev standards filters'

const SET_FILTERS = '[reports] set standards filters'
const SET_TEST_ID = '[reports] set standards testId'
const SET_TEMP_DD_FILTER = '[reports] set standards tempDdFilters'
const SET_TAGS_DATA = '[reports] set standards tagsData'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getStandardsFiltersRequestAction = createAction(
  GET_REPORTS_STANDARDS_FILTERS_REQUEST
)
export const setPrevStandardsFiltersAction = createAction(
  SET_REPORTS_PREV_STANDARDS_FILTERS
)

export const setFiltersAction = createAction(SET_FILTERS)
export const setTestIdAction = createAction(SET_TEST_ID)
export const setTempDdFilterAction = createAction(SET_TEMP_DD_FILTER)
export const setTagsDataAction = createAction(SET_TAGS_DATA)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportStandardsFilterDataReducer

export const getReportsStandardsFiltersLoader = createSelector(
  stateSelector,
  (state) => state.loading || state.loadingStandards
)

export const getReportsStandardsFilters = createSelector(
  stateSelector,
  (state) => state.standardsFilters
)

export const getFiltersSelector = createSelector(
  stateSelector,
  (state) => state.filters
)

export const getTestIdSelector = createSelector(
  stateSelector,
  (state) => state.testIds
)

export const getTempDdFilterSelector = createSelector(
  stateSelector,
  (state) => state.tempDdFilter
)

export const getTagsDataSelector = createSelector(
  stateSelector,
  (state) => state.tagsData
)

export const getPrevStandardsFiltersSelector = createSelector(
  stateSelector,
  (state) => state.prevStandardsFilters
)

export const getSMRFilterDemographics = createSelector(stateSelector, (state) =>
  get(state, 'standardsFilters.data.result.demographics', [])
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  standardsFilters: {},
  prevStandardsFilters: null,
  filters: {
    ...staticDropDownData.initialFilters,
  },
  testIds: [],
  tempDdFilter: {
    ...staticDropDownData.initialDdFilters,
  },
  tagsData: {},
  loading: false,
}

export const reportStandardsFilterDataReducer = createReducer(initialState, {
  [GET_REPORTS_STANDARDS_FILTERS_REQUEST]: (state) => {
    state.loading = true
  },
  [GET_REPORTS_STANDARDS_FILTERS_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.standardsFilters = payload.standardsFilters
  },
  [GET_REPORTS_STANDARDS_FILTERS_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [SET_REPORTS_PREV_STANDARDS_FILTERS]: (state, { payload }) => {
    state.prevStandardsFilters = payload
  },
  [SET_FILTERS]: (state, { payload }) => {
    state.filters = { ...payload }
  },
  [SET_TEST_ID]: (state, { payload }) => {
    state.testIds = payload
  },
  [SET_TEMP_DD_FILTER]: (state, { payload }) => {
    state.tempDdFilter = payload
  },
  [SET_TAGS_DATA]: (state, { payload }) => {
    state.tagsData = { ...payload }
  },
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //
function* getReportsStandardsFiltersRequest({ payload }) {
  try {
    const standardsFilters = yield call(
      reportsApi.fetchStandardMasteryFilter,
      payload
    )
    yield put({
      type: GET_REPORTS_STANDARDS_FILTERS_REQUEST_SUCCESS,
      payload: { standardsFilters },
    })
  } catch (error) {
    console.log('err', error.stack)
    const msg = 'Failed to fetch standards Please try again...'
    notification({ msg })
    yield put({
      type: GET_REPORTS_STANDARDS_FILTERS_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportStandardsFilterSaga() {
  yield all([
    yield takeLatest(
      GET_REPORTS_STANDARDS_FILTERS_REQUEST,
      getReportsStandardsFiltersRequest
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
