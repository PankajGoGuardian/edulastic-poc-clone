import { createSelector } from 'reselect'
import { createAction, createReducer } from 'redux-starter-kit'
import { all, call, put, takeLatest } from 'redux-saga/effects'
import { customReportApi } from '@edulastic/api'
import { notification } from '@edulastic/common'

const sampleUploadsStatusList = [
  {
    _id: 1,
    testName: 'Enrollment report',
    lastUpdatedAt: new Date().getTime(),
    status: 'success',
  },
  {
    _id: 2,
    testName: 'Test Correlations',
    lastUpdatedAt: new Date().getTime(),
    status: 'failed',
  },
  {
    _id: 3,
    testName: 'SAT',
    lastUpdatedAt: new Date().getTime(),
    status: 'in progress',
  },
]

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

const UPLOAD_TEST_DATA_FILE_REQUEST = '[reports] upload test data file request'
const UPLOAD_TEST_DATA_FILE_REQUEST_SUCCESS =
  '[reports] upload test data file request success'
const UPLOAD_TEST_DATA_FILE_REQUEST_ERROR =
  '[reports] upload test data file request error'

const GET_UPLOADS_STATUS_LIST_REQUEST =
  '[reports] get uploads status list request'
const GET_UPLOADS_STATUS_LIST_REQUEST_SUCCESS =
  '[reports] get uploads status list success'
const GET_UPLOADS_STATUS_LIST_REQUEST_ERROR =
  '[reports] get uploads status list error'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getCustomReportAction = createAction(
  GET_CUSTOM_REPORT_STATE_REQUEST
)
export const getCustomReportURLAction = createAction(
  GET_CUSTOM_REPORT_URL_REQUEST
)

export const uploadTestDataFileAction = createAction(
  UPLOAD_TEST_DATA_FILE_REQUEST
)

export const getUploadsStatusListAction = createAction(
  GET_UPLOADS_STATUS_LIST_REQUEST
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

export const getTestDatFileUploadLoader = createSelector(
  stateSelector,
  (state) => state.testDataFileUploadLoading
)

export const getUploadsStatusLoader = createSelector(
  stateSelector,
  (state) => state.uploadsStatusListLoader
)

export const getUploadsStatusList = createSelector(
  stateSelector,
  (state) => state.uploadsStatusList
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  customReportList: [],
  testDataFileUploadLoading: false,
  testDataFileUploadError: null,
  testDataFileUploadResponse: null,
  uploadsStatusList: [],
  uploadsStatusListLoader: false,
  uploadsStatusListError: null,
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
  [UPLOAD_TEST_DATA_FILE_REQUEST]: (state) => {
    state.testDataFileUploadLoading = true
  },
  [UPLOAD_TEST_DATA_FILE_REQUEST_SUCCESS]: (state, { payload }) => {
    state.testDataFileUploadLoading = false
    state.testDataFileUploadResponse = payload
  },
  [UPLOAD_TEST_DATA_FILE_REQUEST_ERROR]: (state, { payload }) => {
    state.testDataFileUploadLoading = false
    state.testDataFileUploadError = payload.error
  },
  [GET_UPLOADS_STATUS_LIST_REQUEST]: (state) => {
    state.uploadsStatusListLoader = true
  },
  [GET_UPLOADS_STATUS_LIST_REQUEST_SUCCESS]: (state, { payload }) => {
    state.uploadsStatusListLoader = false
    state.uploadsStatusList = payload
  },
  [GET_CUSTOM_REPORT_STATE_REQUEST_ERROR]: (state, { payload }) => {
    state.uploadsStatusListLoader = false
    state.uploadsStatusListError = payload.error
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

export function* uploadTestDataFile({ payload }) {
  try {
    // make api call
    // const response = yield call()
    const response = {}
    console.log('payload', payload)
    yield put({
      type: UPLOAD_TEST_DATA_FILE_REQUEST_SUCCESS,
      payload: response,
    })
  } catch (error) {
    const msg = 'Error uploading the file. Please try again after a few minutes.'
    notification({ msg })
    yield put({
      type: UPLOAD_TEST_DATA_FILE_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* fetchUploadsStatusList({ payload }) {
  try {
    // const uploadsStatusList = yield call()
    const uploadsStatusList = sampleUploadsStatusList
    yield put({
      type: GET_UPLOADS_STATUS_LIST_REQUEST_SUCCESS,
      payload: uploadsStatusList,
    })
  } catch (error) {
    const msg =
      'Error getting uploads status list. Please try again after a few minutes.'
    notification({ msg })
    yield put({
      type: GET_UPLOADS_STATUS_LIST_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //

export function* customReportSaga() {
  yield all([
    yield takeLatest(GET_CUSTOM_REPORT_STATE_REQUEST, getCustomReportRequest),
    yield takeLatest(GET_CUSTOM_REPORT_URL_REQUEST, getCustomReportURLRequest),
    yield takeLatest(UPLOAD_TEST_DATA_FILE_REQUEST, uploadTestDataFile),
    yield takeLatest(GET_UPLOADS_STATUS_LIST_REQUEST, fetchUploadsStatusList),
  ])
}
