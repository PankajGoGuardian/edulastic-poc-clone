import { dataWarehouse } from '@edulastic/constants'
import { dataWarehouseApi } from '@edulastic/api'
import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { all, call, put, takeLatest } from 'redux-saga/effects'
import { notification } from '@edulastic/common'

import { uploadToS3 } from '../utils/uploadToS3'

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
const GET_RESET_TEST_DATA_UPLOAD_RESPONSE =
  '[reports] get reset test data upload response'

const GET_RESET_TEST_DATA_UPLOAD_RESPONSE_SUCCESS =
  '[reports] get reset test data upload response success'

const GET_UPDATE_UPLOAD_PROGRESS_REQUEST =
  '[reports] get update upload progress request'

const GET_SET_CANCEL_UPLOAD_REQUEST = '[reports] get set cancel upload request'

const GET_ABORT_UPLOAD_REQUEST = '[reports] get abort upload request'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const uploadTestDataFileAction = createAction(
  UPLOAD_TEST_DATA_FILE_REQUEST
)

export const getUploadsStatusListAction = createAction(
  GET_UPLOADS_STATUS_LIST_REQUEST
)

export const getResetTestDataFileUploadResponseAction = createAction(
  GET_RESET_TEST_DATA_UPLOAD_RESPONSE
)

export const getUpdateUploadProgressAction = createAction(
  GET_UPDATE_UPLOAD_PROGRESS_REQUEST
)

export const getSetCancelUploadAction = createAction(
  GET_SET_CANCEL_UPLOAD_REQUEST
)

export const getAbortUploadAction = createAction(GET_ABORT_UPLOAD_REQUEST)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) => state.dataWarehouseReducer

export const getTestDataFileUploadLoader = createSelector(
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

export const getTestDataFileUploadResponse = createSelector(
  stateSelector,
  (state) => state.testDataFileUploadResponse
)

export const getFileUploadProgress = createSelector(
  stateSelector,
  (state) => state.uploadProgress
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  testDataFileUploadLoading: false,
  cancelUpload: null,
  uploadProgress: 0,
  testDataFileUploadError: null,
  testDataFileUploadResponse: null,
  uploadsStatusList: [],
  uploadsStatusListLoader: false,
  uploadsStatusListError: null,
}

export const dataWarehouseReducer = createReducer(initialState, {
  [UPLOAD_TEST_DATA_FILE_REQUEST]: (state) => {
    state.testDataFileUploadLoading = true
    state.testDataFileUploadResponse = null
  },
  [UPLOAD_TEST_DATA_FILE_REQUEST_SUCCESS]: (state, { payload }) => {
    state.testDataFileUploadLoading = false
    state.testDataFileUploadResponse = payload
    state.uploadProgress = 0
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
  [GET_UPLOADS_STATUS_LIST_REQUEST_ERROR]: (state, { payload }) => {
    state.uploadsStatusListLoader = false
    state.uploadsStatusListError = payload.error
  },
  [GET_RESET_TEST_DATA_UPLOAD_RESPONSE_SUCCESS]: (state) => {
    state.testDataFileUploadResponse = null
  },
  [GET_UPDATE_UPLOAD_PROGRESS_REQUEST]: (state, { payload }) => {
    const { loaded: uploaded, total } = payload.progressData
    const mulFactor = payload.mulFactor || 100
    const uploadProgress = Number(((mulFactor * uploaded) / total).toFixed(2))
    state.uploadProgress = uploadProgress || 0
  },
  [GET_SET_CANCEL_UPLOAD_REQUEST]: (state, { payload }) => {
    state.cancelUpload = payload
  },
  [GET_ABORT_UPLOAD_REQUEST]: (state) => {
    state.testDataFileUploadResponse = {
      message: 'File upload cancelled by user',
    }
    state.uploadProgress = 0
    if (state.cancelUpload) {
      state.cancelUpload()
    }
  },
})

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

export function* fetchUploadsStatusList() {
  try {
    const uploadsStatusList = yield call(dataWarehouseApi.getDataWarehouseLogs)
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

export function* uploadTestDataFile({
  payload: {
    file,
    category,
    handleUploadProgress,
    setCancelUpload,
    termId,
    testName,
    versionYear,
  },
}) {
  try {
    notification({
      msg: 'File upload in progress.',
      type: 'info',
    })
    const response = yield uploadToS3({
      file,
      folder: dataWarehouse.S3_DATA_WAREHOUSE_FOLDER,
      subFolder: 'raw_data',
      category,
      progressCallback: (progressData) =>
        handleUploadProgress({ progressData }),
      cancelUpload: setCancelUpload,
      termId,
      testName,
      versionYear,
    })
    yield put(
      handleUploadProgress({ progressData: { loaded: 100, total: 100 } })
    )
    yield put({
      type: UPLOAD_TEST_DATA_FILE_REQUEST_SUCCESS,
      payload: response,
    })
    notification({
      msg: 'Import Successful.',
      destroyAll: true,
      type: 'success',
    })
  } catch (error) {
    let msg = ''
    if (error?.message) {
      msg = error.message
      notification({ type: 'error', exact: true, msg, destroyAll: true })
    } else {
      msg = 'Error uploading the file. Please try again after a few minutes.'
      notification({ type: 'error', msg, destroyAll: true })
    }
    yield put({
      type: UPLOAD_TEST_DATA_FILE_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* resetUploadResponse() {
  yield put({
    type: GET_RESET_TEST_DATA_UPLOAD_RESPONSE_SUCCESS,
  })
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //

export function* dataWarehouseSaga() {
  yield all([
    yield takeLatest(UPLOAD_TEST_DATA_FILE_REQUEST, uploadTestDataFile),
    yield takeLatest(GET_UPLOADS_STATUS_LIST_REQUEST, fetchUploadsStatusList),
    yield takeLatest(GET_RESET_TEST_DATA_UPLOAD_RESPONSE, resetUploadResponse),
  ])
}
