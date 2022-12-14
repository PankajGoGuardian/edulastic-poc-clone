import { takeLatest, call, put, all } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { createAction, createReducer } from 'redux-starter-kit'
import { get } from 'lodash'

import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'

import { RESET_ALL_REPORTS } from '../../../../../common/reportsRedux'

import staticDropDownData from './staticDropDownData.json'

const GET_REPORTS_SEL_ASSESSMENT_RESPONSES_FILTER_DATA_REQUEST =
  '[reports] get reports sar filter data request'
export const GET_REPORTS_SEL_ASSESSMENT_RESPONSES_FILTER_DATA_REQUEST_SUCCESS =
  '[reports] get reports sar filter data request success'
export const GET_REPORTS_SEL_ASSESSMENT_RESPONSES_FILTER_DATA_REQUEST_ERROR =
  '[reports] get reports sar filter data request error'
const RESET_REPORTS_SEL_ASSESSMENT_RESPONSES_FILTER_DATA =
  '[reports] reset reports sar filter data'
const RESET_REPORTS_SEL_ASSESSMENT_RESPONSES_FILTERS =
  '[reports] reset reports sar filters'
const SET_REPORTS_PREV_SEL_ASSESSMENT_RESPONSES_FILTER_DATA =
  '[reports] set reports prev sar filter data'

export const SET_FILTERS_OR_TEST_ID = '[reports] set sar filters or testId'
const SET_TEMP_DD_FILTER = '[reports] set sar tempDdFilter'
const SET_TEMP_TAGS_DATA = '[reports] set sar temp tempTagsData'

const SET_PERFORMANCE_BAND_PROFILE = '[reports] set sar peformance band profile'
const SET_STANDARD_MANTERY_PROFILE = '[reports] set sar standard matery profile'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getSARFilterDataRequestAction = createAction(
  GET_REPORTS_SEL_ASSESSMENT_RESPONSES_FILTER_DATA_REQUEST
)
export const resetSARFiltersAction = createAction(
  RESET_REPORTS_SEL_ASSESSMENT_RESPONSES_FILTERS
)
export const setPrevSARFilterDataAction = createAction(
  SET_REPORTS_PREV_SEL_ASSESSMENT_RESPONSES_FILTER_DATA
)

export const setFiltersOrTestIdAction = createAction(SET_FILTERS_OR_TEST_ID)

export const setTempDdFilterAction = createAction(SET_TEMP_DD_FILTER)

export const setTempTagsDataAction = createAction(SET_TEMP_TAGS_DATA)

export const setPerformanceBandProfileAction = createAction(
  SET_PERFORMANCE_BAND_PROFILE
)

export const setStandardMasteryProfileAction = createAction(
  SET_STANDARD_MANTERY_PROFILE
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportSARFilterDataReducer

export const getReportsSARFilterData = createSelector(
  stateSelector,
  (state) => state.SARFilterData
)

export const getFiltersAndTestIdSelector = createSelector(
  stateSelector,
  ({ filters, testId }) => ({ filters, testId })
)

export const getTempDdFilterSelector = createSelector(
  stateSelector,
  (state) => state.tempDdFilter
)

export const getTempTagsDataSelector = createSelector(
  stateSelector,
  (state) => state.tempTagsData
)

export const getReportsPrevSARFilterData = createSelector(
  stateSelector,
  (state) => state.prevSARFilterData
)

export const getReportsSARFilterLoadingState = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getSAFFilterPerformanceBandProfiles = createSelector(
  stateSelector,
  (state) => get(state, 'SARFilterData.data.result.bandInfo', [])
)

export const getSAFFilterStandardsProficiencyProfiles = createSelector(
  stateSelector,
  (state) => get(state, 'SARFilterData.data.result.scaleInfo', [])
)

export const getFilterDemographics = createSelector(stateSelector, (state) =>
  get(state, 'SARFilterData.data.result.demographics', [])
)

export const getPerformanceBandProfile = createSelector(
  stateSelector,
  (state) => state.performanceBandProfile
)

export const getStandardMasteryScale = createSelector(
  stateSelector,
  (state) => state.standardsProficiencyProfile
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  SARFilterData: {},
  prevSARFilterData: null,
  filters: {
    ...staticDropDownData.initialFilters,
  },
  testId: '',
  tempDdFilter: {
    ...staticDropDownData.initialDdFilters,
  },
  tempTagsData: {},
  loading: false,
}

export const reportSelAssessmentResponsesFilterDataReducer = createReducer(
  initialState,
  {
    [GET_REPORTS_SEL_ASSESSMENT_RESPONSES_FILTER_DATA_REQUEST]: (state) => {
      state.loading = true
    },
    [GET_REPORTS_SEL_ASSESSMENT_RESPONSES_FILTER_DATA_REQUEST_SUCCESS]: (
      state,
      { payload }
    ) => {
      state.loading = false
      state.SARFilterData = payload.SARFilterData
    },
    [GET_REPORTS_SEL_ASSESSMENT_RESPONSES_FILTER_DATA_REQUEST_ERROR]: (
      state,
      { payload }
    ) => {
      state.loading = false
      state.error = payload.error
    },
    [SET_FILTERS_OR_TEST_ID]: (state, { payload }) => {
      const { testId, filters } = payload
      if (filters) {
        state.filters = filters
      }
      state.testId = testId
    },
    [SET_TEMP_DD_FILTER]: (state, { payload }) => {
      state.tempDdFilter = payload
    },
    [SET_TEMP_TAGS_DATA]: (state, { payload }) => {
      state.tempTagsData = payload
    },
    [RESET_REPORTS_SEL_ASSESSMENT_RESPONSES_FILTER_DATA]: (state) => {
      state.SARFilterData = {}
    },
    [RESET_ALL_REPORTS]: (state) => (state = initialState),
    [SET_REPORTS_PREV_SEL_ASSESSMENT_RESPONSES_FILTER_DATA]: (
      state,
      { payload }
    ) => {
      state.prevSARFilterData = payload
    },
    [SET_PERFORMANCE_BAND_PROFILE]: (state, { payload }) => {
      state.performanceBandProfile = payload
    },
    [SET_STANDARD_MANTERY_PROFILE]: (state, { payload }) => {
      state.standardsProficiencyProfile = payload
    },
  }
)

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsSelAssessmentResponsesFilterDataRequest({ payload }) {
  try {
    yield put({ type: RESET_REPORTS_SEL_ASSESSMENT_RESPONSES_FILTER_DATA })
    const SARFilterData = yield call(reportsApi.fetchSARFilterData, payload)
    yield put({
      type: GET_REPORTS_SEL_ASSESSMENT_RESPONSES_FILTER_DATA_REQUEST_SUCCESS,
      payload: { SARFilterData },
    })
  } catch (error) {
    const msg =
      'Error getting filter data. Please try again after a few minutes.'
    notification({ msg })
    yield put({
      type: GET_REPORTS_SEL_ASSESSMENT_RESPONSES_FILTER_DATA_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportSelAssessmentResponsesFilterDataSaga() {
  yield all([
    takeLatest(
      GET_REPORTS_SEL_ASSESSMENT_RESPONSES_FILTER_DATA_REQUEST,
      getReportsSelAssessmentResponsesFilterDataRequest
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
