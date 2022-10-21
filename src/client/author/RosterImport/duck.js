import { takeEvery, call, put, all } from 'redux-saga/effects'
import { get } from 'lodash'
import { onerosterApi } from '@edulastic/api'
import { notification, uploadToS3 } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { aws } from '@edulastic/constants'
import { downloadCSV } from '@edulastic/constants/reportUtils/common'

export const oneRosterSyncStatus = {
  IN_PROGRESS: 1,
  COMPLETED: 2,
  FAILED: 3,
}

const RECEIVE_ROSTER_LOG_REQUEST = '[Roster Log] receive data request'
const RECEIVE_ROSTER_LOG_SUCCESS = '[Roster Log] receive data success'
const GET_UPDATE_UPLOAD_PROGRESS_REQUEST =
  '[Roster Log] upload oneroster zip file request'
const UPLOAD_ONEROSTER_ZIP_FILE_REQUEST =
  '[Roster Log] get update upload progress request'
const UPLOAD_ONEROSTER_ZIP_FILE_SUCCESS =
  '[Roster Log] upload oneroster zip file success'
const UPLOAD_ONEROSTER_ZIP_FILE_ERROR =
  '[Roster Log] upload oneroster zip file error'
const GET_SET_CANCEL_UPLOAD_REQUEST =
  '[Roster Log] get set cancel upload request'
const GET_ABORT_UPLOAD_REQUEST = '[Roster Log] get abort upload request'
const SET_ONEROSTER_SYNC_STATUS_REQUEST =
  '[Roster Log] set oneroster sync status request'
const DOWNLOAD_CSV_ERROR_DATA_REQUEST =
  '[Roster Log] download csv error data request'

export const receiveRosterLogAction = createAction(RECEIVE_ROSTER_LOG_REQUEST)
export const receiveRosterLogSucessAction = createAction(
  RECEIVE_ROSTER_LOG_SUCCESS
)
export const getSetCancelUploadAction = createAction(
  GET_SET_CANCEL_UPLOAD_REQUEST
)
export const getAbortUploadAction = createAction(GET_ABORT_UPLOAD_REQUEST)
export const getUpdateOfZipUploadProgressAction = createAction(
  GET_UPDATE_UPLOAD_PROGRESS_REQUEST
)
export const uploadOneRosterZipFileAction = createAction(
  UPLOAD_ONEROSTER_ZIP_FILE_REQUEST
)
export const setOneRosterSyncStatusAction = createAction(
  SET_ONEROSTER_SYNC_STATUS_REQUEST
)
export const downloadCsvErrorDataAction = createAction(
  DOWNLOAD_CSV_ERROR_DATA_REQUEST
)

const initialState = {
  rosterLog: {},
  rosterStats: {},
  loading: false,
  rosterZipFileUploading: false,
  uploadProgress: 0,
}
export const reducer = createReducer(initialState, {
  [RECEIVE_ROSTER_LOG_REQUEST]: (state) => {
    state.loading = true
  },
  [RECEIVE_ROSTER_LOG_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.rosterImportLog = payload?.rosterImportLog
    state.summary = payload?.summary
    state.syncStatus = payload?.syncStatus
  },
  [GET_SET_CANCEL_UPLOAD_REQUEST]: (state, { payload }) => {
    state.cancelUpload = payload
  },
  [GET_ABORT_UPLOAD_REQUEST]: (state) => {
    state.uploadProgress = 0
    if (state.cancelUpload) {
      state.cancelUpload()
    }
  },
  [GET_UPDATE_UPLOAD_PROGRESS_REQUEST]: (state, { payload }) => {
    const { loaded: uploaded, total } = payload.progressData
    const mulFactor = payload.mulFactor || 100
    const uploadProgress = Number(((mulFactor * uploaded) / total).toFixed(2))
    state.uploadProgress = uploadProgress || 0
  },
  [UPLOAD_ONEROSTER_ZIP_FILE_REQUEST]: (state) => {
    state.rosterZipFileUploading = true
  },
  [UPLOAD_ONEROSTER_ZIP_FILE_SUCCESS]: (state) => {
    state.rosterZipFileUploading = false
  },
  [UPLOAD_ONEROSTER_ZIP_FILE_ERROR]: (state) => {
    state.rosterZipFileUploading = false
  },
  [SET_ONEROSTER_SYNC_STATUS_REQUEST]: (state, { payload }) => {
    state.syncStatus = payload
  },
})

function* receiveRosterLogSaga() {
  try {
    const rosterStatsData = yield call(onerosterApi.fetchRosterLogs)
    yield put(receiveRosterLogSucessAction(rosterStatsData))
  } catch (err) {
    const errorMessage = 'Unable to retrieve roster log for the user.'
    notification({ type: 'error', msg: errorMessage })
  }
}

export function* uploadOneRosterZipFileSaga({
  payload: { file, handleUploadProgress, setCancelUpload },
}) {
  try {
    notification({
      msg: 'File upload in progress.',
      type: 'info',
    })
    yield put(setOneRosterSyncStatusAction(oneRosterSyncStatus.IN_PROGRESS))
    const response = yield uploadToS3(
      file,
      aws.s3Folders.ONEROSTER,
      (progressData) => handleUploadProgress({ progressData }),
      setCancelUpload,
      '',
      true
    )
    yield put(
      handleUploadProgress({ progressData: { loaded: 100, total: 100 } })
    )
    yield put({
      type: UPLOAD_ONEROSTER_ZIP_FILE_SUCCESS,
      payload: response,
    })
    notification({
      msg: 'upload Successful.',
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
    yield put(setOneRosterSyncStatusAction(oneRosterSyncStatus.FAILED))
    yield put({
      type: UPLOAD_ONEROSTER_ZIP_FILE_ERROR,
      payload: { error: msg },
    })
  }
}

export function* downloadCsvErrorDataSaga({
  payload: { entity, timestamp, fileName },
}) {
  try {
    const data = yield call(onerosterApi.downloadEntityError, {
      entity,
      timestamp,
    })
    downloadCSV(fileName, data)
  } catch (error) {
    let msg = ''
    if (error?.message) {
      msg = error.message
      notification({ type: 'error', exact: true, msg, destroyAll: true })
    } else {
      msg = 'Error downloading the file. Please try again after a few minutes.'
      notification({ type: 'error', msg, destroyAll: true })
    }
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_ROSTER_LOG_REQUEST, receiveRosterLogSaga)])
  yield all([
    yield takeEvery(
      UPLOAD_ONEROSTER_ZIP_FILE_REQUEST,
      uploadOneRosterZipFileSaga
    ),
  ])
  yield all([
    yield takeEvery(DOWNLOAD_CSV_ERROR_DATA_REQUEST, downloadCsvErrorDataSaga),
  ])
}

export const stateSelector = (state) => get(state, ['rosterImportReducer'], {})
export const getIsLoading = createSelector(
  stateSelector,
  (state) => state.loading || false
)
export const getRosterImportLog = createSelector(
  stateSelector,
  (state) => state.rosterImportLog || []
)
export const getFileUploadProgress = createSelector(
  stateSelector,
  (state) => state.uploadProgress || 0
)
export const getIsRosterZipFileUploading = createSelector(
  stateSelector,
  (state) => state.rosterZipFileUploading || false
)
export const getOneRosterSyncSummary = createSelector(
  stateSelector,
  (state) => state.summary || []
)
export const getOneRosterSyncStatus = createSelector(
  stateSelector,
  (state) => state.syncStatus
)
