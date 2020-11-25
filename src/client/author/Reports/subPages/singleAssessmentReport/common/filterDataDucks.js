import { takeLatest, takeEvery, call, put, all } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { createAction, createReducer } from 'redux-starter-kit'
import { get } from 'lodash'

import { reportsApi, assignmentApi } from '@edulastic/api'
import { notification } from '@edulastic/common'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const GET_REPORTS_SAR_FILTER_DATA_REQUEST =
  '[reports] get reports sar filter data request'
const GET_REPORTS_SAR_FILTER_DATA_REQUEST_SUCCESS =
  '[reports] get reports sar filter data request success'
const GET_REPORTS_SAR_FILTER_DATA_REQUEST_ERROR =
  '[reports] get reports sar filter data request error'
const RESET_REPORTS_SAR_FILTER_DATA = '[reports] reset reports sar filter data'
const RESET_REPORTS_SAR_FILTERS = '[reports] reset reports sar filters'
const SET_REPORTS_PREV_SAR_FILTER_DATA =
  '[reports] set reports prev sar filter data'

const SET_FILTERS_OR_TEST_ID = '[reports] set sar filters or testId'

const RECEIVE_TEST_LIST_REQUEST = '[reports] receive test list request'
const RECEIVE_TEST_LIST_REQUEST_SUCCESS =
  '[reports] receive test list request success'
const RECEIVE_TEST_LIST_REQUEST_ERROR =
  '[reports] receive test list request request error'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getSARFilterDataRequestAction = createAction(
  GET_REPORTS_SAR_FILTER_DATA_REQUEST
)
export const resetSARFiltersAction = createAction(RESET_REPORTS_SAR_FILTERS)
export const setPrevSARFilterDataAction = createAction(
  SET_REPORTS_PREV_SAR_FILTER_DATA
)

export const setFiltersOrTestIdAction = createAction(SET_FILTERS_OR_TEST_ID)

export const receiveTestListAction = createAction(RECEIVE_TEST_LIST_REQUEST)

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

export const getReportsPrevSARFilterData = createSelector(
  stateSelector,
  (state) => state.prevSARFilterData
)

export const getReportsSARFilterLoadingState = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getSAFFilterSelectedPerformanceBandProfile = createSelector(
  stateSelector,
  (state) => state.filters.performanceBandProfile
)

export const getSAFFilterPerformanceBandProfiles = createSelector(
  stateSelector,
  (state) => get(state, 'SARFilterData.data.result.bandInfo', [])
)

export const getSAFFilterSelectedStandardsProficiencyProfile = createSelector(
  stateSelector,
  (state) => state.filters.standardsProficiencyProfile
)

export const getSAFFilterStandardsProficiencyProfiles = createSelector(
  stateSelector,
  (state) => get(state, 'SARFilterData.data.result.scaleInfo', [])
)

export const getTestListSelector = createSelector(
  stateSelector,
  (state) => state.testList
)

export const getTestListLoadingSelector = createSelector(
  stateSelector,
  (state) => state.testListLoading
)

export const getSAFilterDemographics = createSelector(stateSelector, (state) =>
  get(state, 'SARFilterData.data.result.demographics', [])
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  SARFilterData: {},
  prevSARFilterData: null,
  filters: {
    reportId: '',
    termId: '',
    subject: 'All',
    studentSubject: 'All',
    grade: 'All',
    studentGrade: 'All',
    courseId: 'All',
    studentCourseId: 'All',
    classId: 'All',
    groupId: 'All',
    schoolIds: [],
    teacherIds: [],
    assessmentTypes: '',
    performanceBandProfile: '',
    standardsProficiencyProfile: '',
  },
  testId: '',
  loading: false,
  testList: [],
  testListLoading: true,
}

export const reportSARFilterDataReducer = createReducer(initialState, {
  [GET_REPORTS_SAR_FILTER_DATA_REQUEST]: (state) => {
    state.loading = true
  },
  [GET_REPORTS_SAR_FILTER_DATA_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.SARFilterData = payload.SARFilterData
  },
  [GET_REPORTS_SAR_FILTER_DATA_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [SET_FILTERS_OR_TEST_ID]: (state, { payload }) => {
    const { testId, filters } = payload
    if (filters) {
      state.filters = filters
    }
    if (testId) {
      state.testId = testId
    }
  },
  [RESET_REPORTS_SAR_FILTER_DATA]: (state) => {
    state.SARFilterData = {}
  },
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
  [SET_REPORTS_PREV_SAR_FILTER_DATA]: (state, { payload }) => {
    state.prevSARFilterData = payload
  },
  [RECEIVE_TEST_LIST_REQUEST]: (state) => {
    state.testListLoading = true
  },
  [RECEIVE_TEST_LIST_REQUEST_SUCCESS]: (state, { payload }) => {
    state.testListLoading = false
    state.testList = payload.testList
  },
  [RECEIVE_TEST_LIST_REQUEST_ERROR]: (state, { payload }) => {
    state.testListLoading = false
    state.testList = []
    state.error = payload.error
  },
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsSARFilterDataRequest({ payload }) {
  try {
    yield put({ type: RESET_REPORTS_SAR_FILTER_DATA })
    const SARFilterData = yield call(reportsApi.fetchSARFilterData, payload)
    yield put({
      type: GET_REPORTS_SAR_FILTER_DATA_REQUEST_SUCCESS,
      payload: { SARFilterData },
    })
  } catch (error) {
    const msg = 'Failed to fetch filter data. Please try again...'
    notification({ msg })
    yield put({
      type: GET_REPORTS_SAR_FILTER_DATA_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* receiveTestListSaga({ payload }) {
  try {
    const searchResult = yield call(assignmentApi.searchAssignments, payload)
    const assignmentBuckets = get(
      searchResult,
      'aggregations.buckets.buckets',
      []
    )
    const testList = assignmentBuckets
      .map(({ key: _id, assignments }) => {
        const hits = get(assignments, 'hits.hits', [])
        const title = get(hits[0], '_source.title', '')
        return { _id, title }
      })
      .filter(({ _id, title }) => _id && title)
    yield put({
      type: RECEIVE_TEST_LIST_REQUEST_SUCCESS,
      payload: { testList },
    })
  } catch (error) {
    const msg = 'Failed to receive tests dropdown data. Please try again...'
    notification({ msg })
    yield put({
      type: RECEIVE_TEST_LIST_REQUEST_SUCCESS,
      payload: { error: msg },
    })
  }
}

export function* reportSARFilterDataSaga() {
  yield all([
    yield takeLatest(
      GET_REPORTS_SAR_FILTER_DATA_REQUEST,
      getReportsSARFilterDataRequest
    ),
    yield takeEvery(RECEIVE_TEST_LIST_REQUEST, receiveTestListSaga),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
