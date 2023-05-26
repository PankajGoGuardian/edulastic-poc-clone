import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { all, call, takeLatest, put } from 'redux-saga/effects'
import { contentImportApi } from '@edulastic/api'
import { uploadToS3, notification } from '@edulastic/common'
import { aws } from '@edulastic/constants'
import { groupBy } from 'lodash'

export const UPLOAD_STATUS = {
  STANDBY: 'STANDBY',
  INITIATE: 'INITIATE',
  DONE: 'DONE',
}

export const JOB_STATUS = {
  PROGRESS: 'progress',
  FAILED: 'failed',
  SUCCESS: 'success',
}

const contentFolders = {
  qti: aws.s3Folders.QTI_IMPORT,
  webct: aws.s3Folders.WEBCT_IMPORT,
}

const UPLOAD_TEST_REQUEST = '[import test] upload test request'
const UPLOAD_TEST_SUSSESS = '[import test] upload test success'
const UPLOAD_TEST_ERROR = '[import test] upload test error'
const SET_UPLOAD_TEST_STATUS = '[import test] set upload test status'
const SET_JOB_IDS = '[import test] test job ids'
const GET_IMPORT_PROGRESS = '[import test] get import progress action'
const SET_JOBS_DATA = '[import test] set jobs response data'
const SET_SUCCESS_MESSAGE = '[import test] set success message'
const SET_IS_IMPORTING = '[import test] set is importing'

export const uploadTestRequestAction = createAction(UPLOAD_TEST_REQUEST)
export const uploadTestSuccessAction = createAction(UPLOAD_TEST_SUSSESS)
export const uploadTestErrorAction = createAction(UPLOAD_TEST_ERROR)
export const uploadTestStatusAction = createAction(SET_UPLOAD_TEST_STATUS)
export const setJobIdsAction = createAction(SET_JOB_IDS)
export const qtiImportProgressAction = createAction(GET_IMPORT_PROGRESS)
export const setJobsDataAction = createAction(SET_JOBS_DATA)
export const setSuccessMessageAction = createAction(SET_SUCCESS_MESSAGE)
export const setIsImportingAction = createAction(SET_IS_IMPORTING)

const initialState = {
  testDetail: {},
  error: {},
  status: 'STANDBY',
  jobIds: [],
  jobsData: [],
  successMessage: '',
  isSuccess: true,
  importing: false,
}

const testUploadStatus = (state, { payload }) => {
  sessionStorage.setItem('testUploadStatus', payload)
  state.status = payload
}

const uploadTestSuccess = (state, { payload }) => ({ ...state, ...payload })

const uploadTestError = (state, { payload }) => {
  state.error = payload
  state.isSuccess = false
}

const setJobIds = (state, { payload }) => {
  sessionStorage.setItem('jobIds', JSON.stringify(payload))
  state.jobIds = payload
}

const setJobsData = (state, { payload }) => {
  state.jobsData = payload
}

const setSuccessMessage = (state, { payload }) => {
  state.successMessage = payload
  state.isSuccess = true
}

const setIsImporting = (state, { payload }) => {
  state.importing = payload
}

export const reducers = createReducer(initialState, {
  [SET_UPLOAD_TEST_STATUS]: testUploadStatus,
  [UPLOAD_TEST_SUSSESS]: uploadTestSuccess,
  [UPLOAD_TEST_ERROR]: uploadTestError,
  [SET_JOB_IDS]: setJobIds,
  [SET_JOBS_DATA]: setJobsData,
  [SET_SUCCESS_MESSAGE]: setSuccessMessage,
  [SET_IS_IMPORTING]: setIsImporting,
})

export function* uploadTestStaga({ payload }) {
  const { fileList, contentType: type, tags: testItemTags } = payload
  try {
    yield put(uploadTestStatusAction(UPLOAD_STATUS.INITIATE))
    let responseFiles = []
    try {
      yield put(setSuccessMessageAction('Started creating signed URLS'))
      ;[responseFiles] = yield all([
        fileList.map((file) =>
          call(uploadToS3, file.originFileObj, contentFolders[type])
        ),
      ])
      yield put(setSuccessMessageAction('Done creating signed URLs'))
    } catch (e) {
      yield put(uploadTestErrorAction(e?.data || {}))
      console.log(e)
    }

    try {
      yield put(setSuccessMessageAction('Started creating the items'))
      yield put(setIsImportingAction(true))
      const response = yield call(contentImportApi.contentImport, {
        files: responseFiles,
        type,
        testItemTags,
      })
      if (response?.jobIds?.length) {
        yield put(setJobIdsAction(response.jobIds))
      } else {
        yield put(uploadTestError('Failed uploading'))
      }
      yield put(setSuccessMessageAction('Completed creating the items'))
    } catch (e) {
      yield put(uploadTestErrorAction(e?.data || {}))
      console.log(e)
    }
  } catch (e) {
    yield put(uploadTestErrorAction(e?.data || {}))
    console.log(e, 'eee')
  }
}

function* getImportProgressSaga({ payload: jobIds }) {
  try {
    const response = yield all(
      jobIds.map((jobId) => call(contentImportApi.qtiImportStatus, jobId))
    )
    yield put(setJobsDataAction(response))
    if (response.every(({ status }) => status !== JOB_STATUS.PROGRESS)) {
      yield put(uploadTestStatusAction(UPLOAD_STATUS.DONE))
      yield put(setIsImportingAction(false))
    }
  } catch (e) {
    console.log({ e })
    return notification({ messageKey: 'failedToFetchProgress' })
  }
}

export function* importTestWatcher() {
  yield all([
    yield takeLatest(UPLOAD_TEST_REQUEST, uploadTestStaga),
    yield takeLatest(GET_IMPORT_PROGRESS, getImportProgressSaga),
  ])
}

export const stateSelector = (state) => state.admin.importTest

export const getJobsDataSelector = createSelector(
  stateSelector,
  (state) => state.jobsData
)
export const getCompletedJobsByStatus = createSelector(
  getJobsDataSelector,
  (jobsData) => groupBy(jobsData, 'status')
)

export const getUploadStatusSelector = createSelector(
  stateSelector,
  (state) => state.status
)

export const getJobIdsSelector = createSelector(
  stateSelector,
  (state) => state.jobIds
)

export const getSuccessMessageSelector = createSelector(
  stateSelector,
  (state) => state.successMessage
)

export const getIsSuccessSelector = createSelector(
  stateSelector,
  (state) => state.isSuccess
)

export const getErrorDetailsSelector = createSelector(
  stateSelector,
  (state) => state.error
)

export const getIsImportingselector = createSelector(
  stateSelector,
  (state) => state.importing
)
