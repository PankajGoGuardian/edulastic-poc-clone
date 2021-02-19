import { takeEvery, call, put, all } from 'redux-saga/effects'
import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'

import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'

import { RESET_ALL_REPORTS } from '../../../common/reportsRedux'

const GET_REPORTS_ER_FILTER_DATA_REQUEST =
  '[reports] get reports er filter data request'
const GET_REPORTS_ER_FILTER_DATA_REQUEST_SUCCESS =
  '[reports] get reports er filter data request success'
const GET_REPORTS_ER_FILTER_DATA_REQUEST_ERROR =
  '[reports] get reports er filter data request error'
const SET_REPORTS_PREV_ER_FILTER_DATA =
  '[reports] set reports prev er filter data'

const SET_FILTERS = '[reports] set er filters'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getERFilterDataRequestAction = createAction(
  GET_REPORTS_ER_FILTER_DATA_REQUEST
)
export const setPrevERFilterDataAction = createAction(
  SET_REPORTS_PREV_ER_FILTER_DATA
)

export const setFiltersAction = createAction(SET_FILTERS)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) =>
  state.reportReducer.reportERFilterDataReducer

export const getReportsPrevERFilterData = createSelector(
  stateSelector,
  (state) => state.prevERFilterData
)

export const getReportsERFilterData = createSelector(
  stateSelector,
  (state) => state.ERFilterData
)

export const getFiltersSelector = createSelector(
  stateSelector,
  (state) => state.filters
)

export const getReportsERFilterLoadingState = createSelector(
  stateSelector,
  (state) => state.loading
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  prevERFilterData: null,
  ERFilterData: {},
  filters: {
    reportId: '',
    termId: '',
    schoolIds: '',
    teacherIds: '',
    grade: 'All',
    subject: 'All',
    assessmentTypes: '',
  },
  loading: false,
}

export const reportERFilterDataReducer = createReducer(initialState, {
  [GET_REPORTS_ER_FILTER_DATA_REQUEST]: (state) => {
    state.loading = true
  },
  [GET_REPORTS_ER_FILTER_DATA_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.ERFilterData = payload.ERFilterData
  },
  [GET_REPORTS_ER_FILTER_DATA_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [SET_FILTERS]: (state, { payload }) => {
    state.filters = payload
  },
  [SET_REPORTS_PREV_ER_FILTER_DATA]: (state, { payload }) => {
    state.prevERFilterData = payload
  },
  [RESET_ALL_REPORTS]: (state) => (state = initialState),
})

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsERFilterDataRequest({ payload }) {
  try {
    // TODO: update after backend api is implemented
    const ERFilterData = { foo: 'bar' }
    // const ERFilterData = yield call(reportsApi.fetchERFilterData, payload)
    yield put({
      type: GET_REPORTS_ER_FILTER_DATA_REQUEST_SUCCESS,
      payload: { ERFilterData },
    })
  } catch (error) {
    const msg = 'Failed to fetch filter data Please try again...'
    notification({ msg })
    yield put({
      type: GET_REPORTS_ER_FILTER_DATA_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* reportERFilterDataSaga() {
  yield all([
    yield takeEvery(
      GET_REPORTS_ER_FILTER_DATA_REQUEST,
      getReportsERFilterDataRequest
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
