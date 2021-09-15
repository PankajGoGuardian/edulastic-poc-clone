import { createSelector } from 'reselect'
import { createAction, createReducer } from 'redux-starter-kit'
import { all, call, put, takeLatest } from 'redux-saga/effects'
import { customReportApi } from '@edulastic/api'
import { notification } from '@edulastic/common'

const GET_CUSTOM_REPORT_STATE_REQUEST = '[reports] get custom reports request'
const GET_CUSTOM_REPORT_STATE_REQUEST_SUCCESS =
  '[reports] get custom reports success'
const GET_CUSTOM_REPORT_STATE_REQUEST_ERROR =
  '[reports] get custom reports error'

const GET_CUSTOM_REPORT_URL_REQUEST = '[reports] get custom reports url request'
const GET_CUSTOM_REPORT_URL_REQUEST_SUCCESS =
  '[reports] get custom url reports success'
const GET_CUSTOM_REPORT_URL_REQUEST_ERROR =
  '[reports] get custom url reports error'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getCustomReportAction = createAction(
  GET_CUSTOM_REPORT_STATE_REQUEST
)
export const getCustomReportURLAction = createAction(
  GET_CUSTOM_REPORT_URL_REQUEST
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) => state.reportReducer.customReportReducer

export const getCustomReportList = createSelector(
  stateSelector,
  (state) => state.customReportList
)

export const getCustomReportLoader = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getCustomReportURL = createSelector(stateSelector, (state) =>
  state.reportURL ? state.reportURL.url : ''
)

export const getCustomReportName = createSelector(stateSelector, (state) =>
  state.reportURL ? state.reportURL.name : ''
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  customReportList: [],
}

export const customReportReducer = createReducer(initialState, {
  [GET_CUSTOM_REPORT_STATE_REQUEST]: (state, { payload }) => {
    state.loading = true
  },
  [GET_CUSTOM_REPORT_STATE_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.customReportList = payload
  },
  [GET_CUSTOM_REPORT_STATE_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [GET_CUSTOM_REPORT_URL_REQUEST]: (state, { payload }) => {
    state.loading = true
  },
  [GET_CUSTOM_REPORT_URL_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.reportURL = payload
  },
  [GET_CUSTOM_REPORT_URL_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
})

// -----|-----|-----|-----| REDUCER ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

export function* getCustomReportRequest({ payload }) {
  try {
    const customReportList = yield call(customReportApi.getCustomReports)
    yield put({
      type: GET_CUSTOM_REPORT_STATE_REQUEST_SUCCESS,
      payload: customReportList,
    })
    return customReportList
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Error getting custom reports data. Please try again after a few minutes.'
    notification({ msg })
    yield put({
      type: GET_CUSTOM_REPORT_STATE_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* getCustomReportURLRequest({ payload }) {
  try {
    const reportURL = yield call(customReportApi.getCustomReportsURL, payload)
    yield put({
      type: GET_CUSTOM_REPORT_URL_REQUEST_SUCCESS,
      payload: reportURL,
    })
  } catch (error) {
    console.log('err', error.stack)
    const msg =
      'Error getting custom report url. Please try again after a few minutes.'
    notification({ msg })
    yield put({
      type: GET_CUSTOM_REPORT_URL_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //

export function* customReportSaga() {
  yield all([
    yield takeLatest(GET_CUSTOM_REPORT_STATE_REQUEST, getCustomReportRequest),
    yield takeLatest(GET_CUSTOM_REPORT_URL_REQUEST, getCustomReportURLRequest),
  ])
}
