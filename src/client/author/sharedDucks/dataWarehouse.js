import { dataWarehouse } from '@edulastic/constants'
import { dataWarehouseApi } from '@edulastic/api'
import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { notification } from '@edulastic/common'

import { uploadToS3 } from '../utils/uploadToS3'
import { getUserOrgId } from '../src/selectors/user'

const UPLOAD_TEST_DATA_FILE_REQUEST = '[reports] upload test data file request'
const UPLOAD_TEST_DATA_FILE_REQUEST_SUCCESS =
  '[reports] upload test data file request success'
const UPLOAD_TEST_DATA_FILE_REQUEST_ERROR =
  '[reports] upload test data file request error'

const DELETE_TEST_DATA_FILE_REQUEST = '[reports] delete test data file request'
const DELETE_TEST_DATA_FILE_REQUEST_SUCCESS =
  '[reports] delete test data file request success'
const DELETE_TEST_DATA_FILE_REQUEST_ERROR =
  '[reports] delete test data file request error'

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

const GET_FEED_TYPES_REQUEST = '[reports] get feed types request'
const GET_FEED_TYPES_REQUEST_SUCCESS =
  '[reports] get feed types request success'
const GET_FEED_TYPES_REQUEST_ERROR = '[reports] get feed types request error'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const uploadTestDataFileAction = createAction(
  UPLOAD_TEST_DATA_FILE_REQUEST
)

export const deleteTestDataFileAction = createAction(
  DELETE_TEST_DATA_FILE_REQUEST
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

export const getFeedTypesAction = createAction(GET_FEED_TYPES_REQUEST)

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

export const getFeedTypes = createSelector(
  stateSelector,
  (state) => state.feedTypes
)

export const getFeedTypesLoader = createSelector(
  stateSelector,
  (state) => state.feedTypesLoader
)

export const getFeedTypesError = createSelector(
  stateSelector,
  (state) => state.feedTypesError
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  testDataFileUploadLoading: false,
  cancelUpload: null,
  uploadProgress: 0,
  testDataFileUploadError: null,
  testDataFileDeleteError: null,
  testDataFileUploadResponse: null,
  uploadsStatusList: [],
  uploadsStatusListLoader: false,
  uploadsStatusListError: null,
  feedTypes: [],
  feedTypesLoader: false,
  feedTypesError: null,
}

export const dataWarehouseReducer = createReducer(initialState, {
  [UPLOAD_TEST_DATA_FILE_REQUEST]: (state) => {
    state.testDataFileUploadLoading = true
    state.testDataFileUploadResponse = null
  },
  [UPLOAD_TEST_DATA_FILE_REQUEST_SUCCESS]: (state, { payload }) => {
    const filteredUploadsStatusList = state.uploadsStatusList.filter(
      (item) => item.feedId !== payload.uploadLog.feedId
    )
    state.testDataFileUploadLoading = false
    state.testDataFileUploadResponse = payload.uploadResponse
    state.uploadProgress = 0
    state.uploadsStatusList = [payload.uploadLog, ...filteredUploadsStatusList]
  },
  [UPLOAD_TEST_DATA_FILE_REQUEST_ERROR]: (state, { payload }) => {
    state.testDataFileUploadLoading = false
    state.testDataFileUploadError = payload.error
  },
  [DELETE_TEST_DATA_FILE_REQUEST_SUCCESS]: (state, { payload }) => {
    state.uploadsStatusList = state.uploadsStatusList.filter(
      (item) => item.feedId !== payload.feedId
    )
  },
  [DELETE_TEST_DATA_FILE_REQUEST_ERROR]: (state, { payload }) => {
    state.testDataFileDeleteError = payload.error
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
  [GET_FEED_TYPES_REQUEST]: (state) => {
    state.feedTypesLoader = true
  },
  [GET_FEED_TYPES_REQUEST_ERROR]: (state, { payload }) => {
    state.feedTypesLoader = false
    state.feedTypesError = payload.error
  },
  [GET_FEED_TYPES_REQUEST_SUCCESS]: (state, { payload }) => {
    state.feedTypesLoader = false
    state.feedTypes = payload
  },
})

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

export function* fetchUploadsStatusListSaga() {
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

export function* uploadTestDataFileSaga({
  payload: {
    file,
    feedType,
    handleUploadProgress,
    setCancelUpload,
    termId,
    feedName,
    versionYear,
    feedId,
    _id,
  },
}) {
  const districtId = yield select(getUserOrgId)
  try {
    notification({
      msg: 'File upload in progress.',
      type: 'info',
    })
    const result = yield uploadToS3({
      file,
      folder: dataWarehouse.S3_DATA_WAREHOUSE_FOLDER,
      subFolder: `${districtId}/input`,
      feedType,
      progressCallback: (progressData) =>
        handleUploadProgress({ progressData }),
      cancelUpload: setCancelUpload,
      termId,
      feedName,
      versionYear,
      feedId,
      _id,
    })
    yield put(
      handleUploadProgress({ progressData: { loaded: 100, total: 100 } })
    )
    yield put({
      type: UPLOAD_TEST_DATA_FILE_REQUEST_SUCCESS,
      payload: result,
    })
    notification({
      msg: 'Import Successful.',
      type: 'success',
    })
  } catch (error) {
    let msg = ''
    if (error?.message) {
      msg = error.message
      notification({ type: 'error', exact: true, msg })
    } else {
      msg = 'Error uploading the file. Please try again after a few minutes.'
      notification({ type: 'error', msg })
    }
    yield put({
      type: UPLOAD_TEST_DATA_FILE_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* deleteTestDataFileSaga({ payload: { feedId } }) {
  try {
    notification({
      msg: 'File delete in progress.',
      type: 'info',
    })
    const response = yield call(dataWarehouseApi.deleteUploadLog, { feedId })
    if (response.error) {
      throw new Error(response.message)
    }
    yield put({
      type: DELETE_TEST_DATA_FILE_REQUEST_SUCCESS,
      payload: { feedId },
    })
    notification({
      msg: 'File deleted successfully.',
      type: 'success',
    })
  } catch (error) {
    let msg = ''
    if (error?.message) {
      msg = error.message
      notification({ type: 'error', exact: true, msg })
    } else {
      msg = 'Error deleting the file. Please try again after a few minutes.'
      notification({ type: 'error', msg })
    }
    yield put({
      type: DELETE_TEST_DATA_FILE_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* fetchFeedTypes() {
  try {
    const feedTypes = yield call(dataWarehouseApi.getFeedTypes)
    yield put({
      type: GET_FEED_TYPES_REQUEST_SUCCESS,
      payload: feedTypes,
    })
  } catch (error) {
    const msg =
      'Error getting feed types. Please try again after a few minutes.'
    notification({ msg })
    yield put({
      type: GET_FEED_TYPES_REQUEST_ERROR,
      payload: { error: msg },
    })
  }
}

export function* resetUploadResponseSaga() {
  yield put({
    type: GET_RESET_TEST_DATA_UPLOAD_RESPONSE_SUCCESS,
  })
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //

export function* dataWarehouseSaga() {
  yield all([
    takeLatest(UPLOAD_TEST_DATA_FILE_REQUEST, uploadTestDataFileSaga),
    takeLatest(DELETE_TEST_DATA_FILE_REQUEST, deleteTestDataFileSaga),
    takeLatest(GET_UPLOADS_STATUS_LIST_REQUEST, fetchUploadsStatusListSaga),
    takeLatest(GET_RESET_TEST_DATA_UPLOAD_RESPONSE, resetUploadResponseSaga),
    takeLatest(GET_FEED_TYPES_REQUEST, fetchFeedTypes),
  ])
}
