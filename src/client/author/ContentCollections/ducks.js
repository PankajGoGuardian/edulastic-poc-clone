import { createSelector } from 'reselect'
import { takeEvery, call, put, all, takeLatest } from 'redux-saga/effects'
import { createAction, createReducer } from 'redux-starter-kit'
import { collectionsApi, contentImportApi } from '@edulastic/api'
import { uploadToS3, notification } from '@edulastic/common'
import { push } from 'react-router-redux'
import { aws } from '@edulastic/constants'
import {
  UPLOAD_STATUS,
  JOB_STATUS,
  setJobIdsAction,
  uploadTestStatusAction,
} from '../ImportTest/ducks'

const ContentFolders = {
  qti: aws.s3Folders.QTI_IMPORT,
  webct: aws.s3Folders.WEBCT_IMPORT,
}
// constants
export const CREATE_NEW_COLLECTION_REQUEST =
  '[collection] create new collection request'
export const CREATE_NEW_COLLECTION_SUCCESS =
  '[collection] create new collection success'
export const CREATE_NEW_COLLECTION_FAILED =
  '[collection] create new collection failed'
export const EDIT_COLLECTION_REQUEST = '[collection] edit collection request'
export const EDIT_COLLECTION_SUCCESS = '[collection] edit collection success'
export const FETCH_COLLECTIONS_LIST_REQUEST =
  '[collection] fetch collection list request'
export const FETCH_COLLECTIONS_LIST_SUCCESS =
  '[collection] fetch collection list success'
export const FETCH_COLLECTIONS_LIST_FAILED =
  '[collection] fetch collection list failed'
export const ADD_PERMISSION_REQUEST = '[collection] add permission request'
export const BATCH_ADD_PERMISSION_REQUEST =
  '[collection] batch add permission request'
export const EDIT_PERMISSION_REQUEST = '[collection] edit permission request'
export const FETCH_PERMISSIONS_REQUEST =
  '[collection] fetch permissions request'
export const FETCH_PERMISSIONS_SUCCESS =
  '[collection] fetch permissions success'
export const FETCH_PERMISSIONS_FAILED = '[collection] fetch permissions failed'
export const SEARCH_ORGANIZATION_REQUEST =
  '[collection] search organization request'
export const SEARCH_ORGANIZATION_SUCCESS =
  '[collection] search organization success'
export const SEARCH_ORGANIZATION_FAILED =
  '[collection] search organization failed'
export const DELETE_PERMISSION_REQUEST =
  '[collection] delete permission request'
export const DELETE_PERMISSION_SUCCESS =
  '[collection] delete permission success'
const GET_SIGNED_URL_REQUEST = '[collection] get signed url request'
const GET_SIGNED_URL_SUCCESS = '[collection] get signed url success'
const GET_SIGNED_URL_ERROR = '[collection] get signed url error'
const IMPORT_TEST_REQUEST = '[collection] import test to collection request'
const IMPORT_TEST_SUCCESS = '[collection] import test to collection success'
const IMPORT_TEST_ERROR = '[collection] import test to collection error'
const IMPORT_CONTENT_JOBIDS = '[collection] set import content jobIds'
const SET_CI_SUCCESS_MESSAGE = '[collection] set success message'
const SET_UPLOAD_CONTENT_STATUS = '[collection] set upload test status'
const SET_CI_JOBS_DATA = '[collection] set jobs response data'
const GET_CONTENT_IMPORT_PROGRESS = '[collection] get import progress action'
const SET_IS_CONTENT_IMPORTING = '[collection] is content getting imported'
const SET_IMPORT_TYPE = '[collection] set import type'

// actions
export const createCollectionRequestAction = createAction(
  CREATE_NEW_COLLECTION_REQUEST
)
export const createCollectionSuccessAction = createAction(
  CREATE_NEW_COLLECTION_SUCCESS
)
export const createCollectionFailedAction = createAction(
  CREATE_NEW_COLLECTION_FAILED
)
export const editCollectionRequestAction = createAction(EDIT_COLLECTION_REQUEST)
export const editCollectionSuccessAction = createAction(EDIT_COLLECTION_SUCCESS)
export const fetchCollectionListRequestAction = createAction(
  FETCH_COLLECTIONS_LIST_REQUEST
)
export const fetchCollectionListSuccessAction = createAction(
  FETCH_COLLECTIONS_LIST_SUCCESS
)
export const fetchCollectionListFailedAction = createAction(
  FETCH_COLLECTIONS_LIST_FAILED
)
export const addPermissionRequestAction = createAction(ADD_PERMISSION_REQUEST)
export const batchAddPermissionRequestAction = createAction(
  BATCH_ADD_PERMISSION_REQUEST
)
export const editPermissionRequestAction = createAction(EDIT_PERMISSION_REQUEST)
export const fetchPermissionsRequestAction = createAction(
  FETCH_PERMISSIONS_REQUEST
)
export const fetchPermissionsSuccessAction = createAction(
  FETCH_PERMISSIONS_SUCCESS
)
export const fetchPermissionsFailedAction = createAction(
  FETCH_PERMISSIONS_FAILED
)
export const searchOrgaizationRequestAction = createAction(
  SEARCH_ORGANIZATION_REQUEST
)
export const searchOrgaizationSuccessAction = createAction(
  SEARCH_ORGANIZATION_SUCCESS
)
export const searchOrgaizationFailedAction = createAction(
  SEARCH_ORGANIZATION_FAILED
)
export const deletePermissionRequestAction = createAction(
  DELETE_PERMISSION_REQUEST
)
export const deletePermissionSuccessAction = createAction(
  DELETE_PERMISSION_SUCCESS
)
export const getSignedUrlRequestAction = createAction(GET_SIGNED_URL_REQUEST)
export const getSignedUrlSuccessAction = createAction(GET_SIGNED_URL_SUCCESS)
export const getSignedUrlFailedAction = createAction(GET_SIGNED_URL_ERROR)
export const importTestToCollectionRequestAction = createAction(
  IMPORT_TEST_REQUEST
)
export const importTestToCollectionSuccessAction = createAction(
  IMPORT_TEST_SUCCESS
)
export const importTestToCollectionFailedAction = createAction(
  IMPORT_TEST_ERROR
)
export const setImportContentJobIdsAction = createAction(IMPORT_CONTENT_JOBIDS)
export const setCISuccessMessageAction = createAction(SET_CI_SUCCESS_MESSAGE)
export const uploadContentStatusAction = createAction(SET_UPLOAD_CONTENT_STATUS)
export const setCIJobsDataAction = createAction(SET_CI_JOBS_DATA)
export const contentImportProgressAction = createAction(
  GET_CONTENT_IMPORT_PROGRESS
)
export const setIsContentImportingAction = createAction(
  SET_IS_CONTENT_IMPORTING
)
export const setImportTypeSelectorAction = createAction(SET_IMPORT_TYPE)

export const initialState = {
  creating: false,
  fetchingCollections: false,
  fetchingPermissions: false,
  fetchingOrganization: false,
  collectionList: [],
  permissions: [],
  schools: [],
  users: [],
  districts: [],
  signedUrl: '',
  signedUrlFetching: false,
  importStatus: '',
  importing: false,
  isSuccess: true,
  status: 'INITIATE',
  jobIds: [],
  error: {},
  permissionsTotalCount: 0,
  type: '',
}

// reducer

export const reducer = createReducer(initialState, {
  [CREATE_NEW_COLLECTION_REQUEST]: (state) => {
    state.creating = true
  },
  [CREATE_NEW_COLLECTION_SUCCESS]: (state) => {
    state.creating = false
  },
  [CREATE_NEW_COLLECTION_FAILED]: (state) => {
    state.creating = false
  },
  [EDIT_COLLECTION_SUCCESS]: (state, { payload }) => {
    state.collectionList = state.collectionList.map((collection) => {
      if (collection._id === payload._id) {
        return {
          ...collection,
          ...payload,
        }
      }
      return collection
    })
  },
  [FETCH_COLLECTIONS_LIST_REQUEST]: (state) => {
    state.fetchingCollections = true
  },
  [FETCH_COLLECTIONS_LIST_SUCCESS]: (state, { payload }) => {
    state.fetchingCollections = false
    state.collectionList = payload
  },
  [FETCH_COLLECTIONS_LIST_FAILED]: (state) => {
    state.fetchingCollections = false
  },
  [FETCH_PERMISSIONS_REQUEST]: (state) => {
    state.fetchingPermissions = true
  },
  [FETCH_PERMISSIONS_SUCCESS]: (state, { payload }) => {
    state.fetchingPermissions = false
    state.permissions = payload.itemBankPermissions
    state.permissionsTotalCount = payload.total
  },
  [FETCH_PERMISSIONS_FAILED]: (state) => {
    state.fetchingPermissions = false
  },
  [SEARCH_ORGANIZATION_REQUEST]: (state) => {
    state.fetchingOrganization = true
  },
  [SEARCH_ORGANIZATION_SUCCESS]: (state, { payload }) => {
    if (payload.orgType === 'SCHOOL') {
      state.schools = payload.result
    } else if (payload.orgType === 'USER') {
      state.users = payload.result
    } else {
      state.districts = payload.result
    }
    state.fetchingOrganization = false
  },
  [SEARCH_ORGANIZATION_FAILED]: (state) => {
    state.fetchingOrganization = false
  },
  [DELETE_PERMISSION_SUCCESS]: (state, { payload }) => {
    state.permissions = state.permissions.filter((p) => p._id !== payload)
  },
  [GET_SIGNED_URL_REQUEST]: (state) => {
    state.signedUrlFetching = true
  },
  [GET_SIGNED_URL_SUCCESS]: (state, { payload = '' }) => {
    state.signedUrl = payload.trim()
    state.signedUrlFetching = false
  },
  [GET_SIGNED_URL_ERROR]: (state) => {
    state.signedUrlFetching = false
  },
  [IMPORT_TEST_REQUEST]: (state) => {
    state.importing = true
  },
  [IMPORT_TEST_SUCCESS]: (state, { payload }) => {
    state.importStatus = payload.jobIds
  },
  [GET_SIGNED_URL_ERROR]: (state) => {
    state.importing = false
  },
  [IMPORT_CONTENT_JOBIDS]: (state, { payload }) => {
    state.jobIds = payload
  },
  [SET_CI_SUCCESS_MESSAGE]: (state, { payload }) => {
    state.successMessage = payload
    state.isSuccess = true
  },
  [IMPORT_TEST_ERROR]: (state, { payload }) => {
    state.error = payload
    state.isSuccess = false
  },
  [SET_UPLOAD_CONTENT_STATUS]: (state, { payload }) => {
    state.status = payload
  },
  [SET_CI_JOBS_DATA]: (state, { payload }) => {
    state.jobsData = payload
  },
  [SET_IS_CONTENT_IMPORTING]: (state, { payload }) => {
    state.importing = payload
  },
  [SET_IMPORT_TYPE]: (state, { payload }) => {
    state.type = payload
  },
})

// sagas

function* createCollectionRequestSaga({ payload }) {
  try {
    const collection = yield call(
      collectionsApi.createNewCollection,
      payload.data
    )
    notification({
      type: 'success',
      messageKey: 'collectionCreatedSuccessfully',
    })
    yield put(createCollectionSuccessAction(collection))
    yield put(
      fetchCollectionListRequestAction({
        searchString: payload.searchValue,
      })
    )
  } catch (err) {
    console.error(err)
    yield put(createCollectionFailedAction())
    let errorMessage = 'Failed to create the Collection.'
    if ([403, 422].includes(err.response.data.statusCode))
      errorMessage = err.response.data.message
    notification({ msg: errorMessage })
  }
}

function* editCollectionRequestSaga({ payload }) {
  try {
    yield call(collectionsApi.editCollection, payload)
    notification({
      type: 'success',
      messageKey: 'collectionUpdatedSuccessfully',
    })
    const collection = {
      ...payload.data,
      _id: payload.id,
    }
    yield put(editCollectionSuccessAction(collection))
  } catch (err) {
    console.error(err)
    let errorMessage = 'Failed to update the Collection.'
    if ([403, 422].includes(err.response.data.statusCode))
      errorMessage = err.response.data.message
    notification({ msg: errorMessage })
  }
}

function* fetchCollectionListRequestSaga() {
  try {
    const collectionList = yield call(collectionsApi.getCollectionList)
    yield put(fetchCollectionListSuccessAction(collectionList))
  } catch (err) {
    yield put(fetchCollectionListFailedAction())
    console.error(err)
  }
}

function* fetchPermissionsRequestSaga({ payload }) {
  try {
    const permissions = yield call(collectionsApi.getPermissions, payload)
    yield put(fetchPermissionsSuccessAction(permissions))
  } catch (err) {
    console.error(err)
    notification({ messageKey: 'UnableToGetPersmissions' })
    yield put(fetchPermissionsFailedAction())
  }
}

function* addPermissionRequestSaga({ payload }) {
  try {
    const { data, paginationData } = payload
    yield call(collectionsApi.addPermission, data)

    if (paginationData) {
      yield put(
        fetchPermissionsRequestAction({ _id: data.bankId, paginationData })
      )
    }

    notification({
      type: 'success',
      msg: `Permission added successfully for ${data.collectionName}.`,
    })
  } catch (err) {
    console.error(err)
    let errorMessage = 'Error occured while adding permision.'
    if ([403, 422].includes(err.response.data.statusCode))
      errorMessage = err.response.data.message
    notification({ msg: errorMessage })
  }
}

function* batchAddPermissionRequestSaga({ payload }) {
  try {
    const { data } = payload
    yield call(collectionsApi.batchAddPermission, data)

    notification({
      type: 'success',
      msg: `Permission added successfully.`,
    })
  } catch (err) {
    console.error(err)
    let errorMessage = 'Error occured while adding permision.'
    if ([403, 422].includes(err.response.data.statusCode))
      errorMessage = err.response.data.message
    notification({ msg: errorMessage })
  }
}

function* editPermissionRequestSaga({ payload }) {
  try {
    const { data, paginationData } = payload
    yield call(collectionsApi.editPermission, data)
    yield put(
      fetchPermissionsRequestAction({ _id: data.bankId, paginationData })
    )
    notification({
      type: 'success',
      messageKey: 'persmissionEditedSuccessfully',
    })
  } catch (err) {
    console.error(err)
    let errorMessage = 'Unable to edit Permission.'
    if ([403, 422].includes(err.response.data.statusCode))
      errorMessage = err.response.data.message
    notification({ msg: errorMessage })
  }
}

function* searchOrgaizationRequestSaga({ payload }) {
  try {
    const result = yield call(collectionsApi.organizationSearch, payload)
    yield put(
      searchOrgaizationSuccessAction({ result, orgType: payload.orgType })
    )
  } catch (err) {
    yield put(searchOrgaizationFailedAction())
    console.error(err)
  }
}

function* deletePermissionRequestSaga({ payload }) {
  try {
    yield call(collectionsApi.deletePermission, payload)
    yield put(deletePermissionSuccessAction(payload.id))
    notification({
      type: 'success',
      messageKey: 'persmissionDeactivatedSuccessfully',
    })
  } catch (err) {
    console.error(err)
    notification({ messageKey: 'UnableToDeactivatePermission' })
  }
}

export function* importTestToCollectionSaga({ payload }) {
  try {
    const {
      selectedCollectionName,
      selectedFormat: type,
      signedUrl,
      createTest = true,
      testItemStatus = 'published',
      selectedTags = [],
    } = payload
    yield put(push('/author/import-content'))
    yield put(uploadContentStatusAction(UPLOAD_STATUS.INITIATE))
    sessionStorage.setItem('testUploadStatus', UPLOAD_STATUS.INITIATE)
    yield put(setCISuccessMessageAction('Started creating the items'))
    yield put(setIsContentImportingAction(true))
    yield put(setImportTypeSelectorAction(type))

    const payloadData = {
      files: [signedUrl],
      type,
      collectionName: selectedCollectionName,
      createTest,
      testItemStatus,
      testItemTags: selectedTags,
    }
    let endpoint = contentImportApi.contentImport
    if (type === 'qti') {
      endpoint = contentImportApi.qtiImport
      payloadData.file = signedUrl
      delete payloadData.files
      yield put(uploadTestStatusAction(UPLOAD_STATUS.INITIATE))
    }
    const response = yield call(endpoint, payloadData)
    if (response?.jobIds?.length || response.jobId) {
      const data = type !== 'qti' ? response.jobIds : response.jobId
      yield put(
        importTestToCollectionSuccessAction({
          jobIds: data,
        })
      )
      yield put(setImportContentJobIdsAction(data))
      if (type === 'qti') {
        yield put(setJobIdsAction(data))
      }
      sessionStorage.setItem(
        'jobIds',
        JSON.stringify(type !== 'qti' ? response.jobIds : [response.jobId])
      )
      yield put(setCISuccessMessageAction('Completed creating the items'))
    } else {
      yield put(importTestToCollectionFailedAction('Failed uploading'))
      yield put(setIsContentImportingAction(false))
      notification({ messageKey: 'uploadCsvErr' })
    }
  } catch (e) {
    console.log(e)
    yield put(importTestToCollectionFailedAction(e?.data || {}))
    yield put(setIsContentImportingAction(false))
    notification({ messageKey: 'errorWhileImportingCollectionData' })
  }
}

export function* getSignedUrlSaga({ payload }) {
  const { file, selectedFormat } = payload
  try {
    const signedUrl = yield call(
      uploadToS3,
      file.originFileObj,
      ContentFolders[selectedFormat]
    )
    yield put(getSignedUrlSuccessAction(signedUrl))
  } catch (e) {
    yield put(getSignedUrlFailedAction(e?.data || {}))
    console.log(e)
  }
}

function* getContentImportProgressSaga({ payload }) {
  const { jobIds, interval } = payload
  try {
    const response = yield call(contentImportApi.contentImportProgress, {
      jobIds,
    })
    yield put(setCIJobsDataAction(response))
    if (response.every(({ status }) => status !== JOB_STATUS.PROGRESS)) {
      yield put(uploadContentStatusAction(UPLOAD_STATUS.DONE))
      yield put(setIsContentImportingAction(false))
      clearInterval(interval?.current)
      interval.current = null
    }
  } catch (e) {
    console.log({ e })
    clearInterval(interval?.current)
    interval.current = null
    return notification({ messageKey: 'failedToFetchProgressStatus' })
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(CREATE_NEW_COLLECTION_REQUEST, createCollectionRequestSaga),
    yield takeEvery(EDIT_COLLECTION_REQUEST, editCollectionRequestSaga),
    yield takeEvery(
      FETCH_COLLECTIONS_LIST_REQUEST,
      fetchCollectionListRequestSaga
    ),
    yield takeEvery(ADD_PERMISSION_REQUEST, addPermissionRequestSaga),
    yield takeEvery(
      BATCH_ADD_PERMISSION_REQUEST,
      batchAddPermissionRequestSaga
    ),
    yield takeEvery(FETCH_PERMISSIONS_REQUEST, fetchPermissionsRequestSaga),
    yield takeEvery(SEARCH_ORGANIZATION_REQUEST, searchOrgaizationRequestSaga),
    yield takeEvery(EDIT_PERMISSION_REQUEST, editPermissionRequestSaga),
    yield takeEvery(DELETE_PERMISSION_REQUEST, deletePermissionRequestSaga),
    yield takeLatest(GET_SIGNED_URL_REQUEST, getSignedUrlSaga),
    yield takeLatest(IMPORT_TEST_REQUEST, importTestToCollectionSaga),
    yield takeLatest(GET_CONTENT_IMPORT_PROGRESS, getContentImportProgressSaga),
  ])
}

// selectors

export const stateSelector = (state) => state.collectionsReducer

export const getCreateCollectionStateSelector = createSelector(
  stateSelector,
  (state) => state.creating
)

export const getFetchCollectionListStateSelector = createSelector(
  stateSelector,
  (state) => state.fetchingCollections
)

export const getCollectionListSelector = createSelector(
  stateSelector,
  (state) => state.collectionList
)

export const getFetchPermissionsStateSelector = createSelector(
  stateSelector,
  (state) => state.fetchingPermissions
)

export const getPermissionsSelector = createSelector(
  stateSelector,
  (state) => state.permissions
)

export const getSchoolListSelector = createSelector(
  stateSelector,
  (state) => state.schools
)

export const getUserListSelector = createSelector(
  stateSelector,
  (state) => state.users
)

export const getDistrictListSelector = createSelector(
  stateSelector,
  (state) => state.districts
)

export const getFetchOrganizationStateSelector = createSelector(
  stateSelector,
  (state) => state.fetchingOrganization
)

export const getSignedUrlSelector = createSelector(
  stateSelector,
  (state) => state.signedUrl
)

export const importStatusSelector = createSelector(
  stateSelector,
  (state) => state.importStatus
)

export const contentImportJobIds = createSelector(
  stateSelector,
  (state) => state.jobIds
)

export const contentImportSuccessMessage = createSelector(
  stateSelector,
  (state) => state.successMessage
)

export const contentImportError = createSelector(
  stateSelector,
  (state) => state.error
)

export const uploadContnentStatus = createSelector(
  stateSelector,
  (state) => state.status
)

export const isContentImportSuccess = createSelector(
  stateSelector,
  (state) => state.isSuccess
)

export const contentImportJobsData = createSelector(
  stateSelector,
  (state) => state.jobsData
)

export const importingLoaderSelector = createSelector(
  stateSelector,
  (state) => state.importing
)

export const signedUrlFetchingSelector = createSelector(
  stateSelector,
  (state) => state.signedUrlFetching
)

export const getPermissionsTotalCountSelector = createSelector(
  stateSelector,
  (state) => state.permissionsTotalCount
)

export const importTypeSelector = createSelector(
  stateSelector,
  (state) => state.type
)
