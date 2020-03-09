import { createSelector } from "reselect";
import { takeEvery, call, put, all, takeLatest } from "redux-saga/effects";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";
import { collectionsApi, contentImportApi, extractContent } from "@edulastic/api";
import { uploadToS3 } from "@edulastic/common";
import { aws } from "@edulastic/constants";

// constants
export const CREATE_NEW_COLLECTION_REQUEST = "[collection] create new collection request";
export const CREATE_NEW_COLLECTION_SUCCESS = "[collection] create new collection success";
export const CREATE_NEW_COLLECTION_FAILED = "[collection] create new collection failed";
export const EDIT_COLLECTION_REQUEST = "[collection] edit collection request";
export const EDIT_COLLECTION_SUCCESS = "[collection] edit collection success";
export const FETCH_COLLECTIONS_LIST_REQUEST = "[collection] fetch collection list request";
export const FETCH_COLLECTIONS_LIST_SUCCESS = "[collection] fetch collection list success";
export const FETCH_COLLECTIONS_LIST_FAILED = "[collection] fetch collection list failed";
export const ADD_PERMISSION_REQUEST = "[collection] add permission request";
export const EDIT_PERMISSION_REQUEST = "[collection] edit permission request";
export const FETCH_PERMISSIONS_REQUEST = "[collection] fetch permissions request";
export const FETCH_PERMISSIONS_SUCCESS = "[collection] fetch permissions success";
export const FETCH_PERMISSIONS_FAILED = "[collection] fetch permissions failed";
export const SEARCH_ORGANIZATION_REQUEST = "[collection] search organization request";
export const SEARCH_ORGANIZATION_SUCCESS = "[collection] search organization success";
export const SEARCH_ORGANIZATION_FAILED = "[collection] search organization failed";
export const DELETE_PERMISSION_REQUEST = "[collection] delete permission request";
export const DELETE_PERMISSION_SUCCESS = "[collection] delete permission success";
const GET_SIGNED_URL_REQUEST = "[collection] get signed url request";
const GET_SIGNED_URL_SUCCESS = "[collection] get signed url success";
const GET_SIGNED_URL_ERROR = "[collection] get signed url error";
const IMPORT_TEST_REQUEST = "[collection] import test to collection request";
const IMPORT_TEST_SUCCESS = "[collection] import test to collection success";
const IMPORT_TEST_ERROR = "[collection] import test to collection error";

// actions
export const createCollectionRequestAction = createAction(CREATE_NEW_COLLECTION_REQUEST);
export const createCollectionSuccessAction = createAction(CREATE_NEW_COLLECTION_SUCCESS);
export const createCollectionFailedAction = createAction(CREATE_NEW_COLLECTION_FAILED);
export const editCollectionRequestAction = createAction(EDIT_COLLECTION_REQUEST);
export const editCollectionSuccessAction = createAction(EDIT_COLLECTION_SUCCESS);
export const fetchCollectionListRequestAction = createAction(FETCH_COLLECTIONS_LIST_REQUEST);
export const fetchCollectionListSuccessAction = createAction(FETCH_COLLECTIONS_LIST_SUCCESS);
export const fetchCollectionListFailedAction = createAction(FETCH_COLLECTIONS_LIST_FAILED);
export const addPermissionRequestAction = createAction(ADD_PERMISSION_REQUEST);
export const editPermissionRequestAction = createAction(EDIT_PERMISSION_REQUEST);
export const fetchPermissionsRequestAction = createAction(FETCH_PERMISSIONS_REQUEST);
export const fetchPermissionsSuccessAction = createAction(FETCH_PERMISSIONS_SUCCESS);
export const fetchPermissionsFailedAction = createAction(FETCH_PERMISSIONS_FAILED);
export const searchOrgaizationRequestAction = createAction(SEARCH_ORGANIZATION_REQUEST);
export const searchOrgaizationSuccessAction = createAction(SEARCH_ORGANIZATION_SUCCESS);
export const searchOrgaizationFailedAction = createAction(SEARCH_ORGANIZATION_FAILED);
export const deletePermissionRequestAction = createAction(DELETE_PERMISSION_REQUEST);
export const deletePermissionSuccessAction = createAction(DELETE_PERMISSION_SUCCESS);
export const getSignedUrlRequestAction = createAction(GET_SIGNED_URL_REQUEST);
export const getSignedUrlSuccessAction = createAction(GET_SIGNED_URL_SUCCESS);
export const getSignedUrlFailedAction = createAction(GET_SIGNED_URL_ERROR);
export const importTestToCollectionRequestAction = createAction(IMPORT_TEST_REQUEST);
export const importTestToCollectionSuccessAction = createAction(IMPORT_TEST_SUCCESS);
export const importTestToCollectionFailedAction = createAction(IMPORT_TEST_ERROR);

const initialState = {
  creating: false,
  fetchingCollections: false,
  fetchingPermissions: false,
  fetchingOrganization: false,
  collectionList: [],
  permissions: [],
  schools: [],
  users: [],
  districts: [],
  signedUrl: "",
  signedUrlFetching: false,
  importStatus: "",
  importing: false
};

// reducer

export const reducer = createReducer(initialState, {
  [CREATE_NEW_COLLECTION_REQUEST]: state => {
    state.creating = true;
  },
  [CREATE_NEW_COLLECTION_SUCCESS]: state => {
    state.creating = false;
  },
  [CREATE_NEW_COLLECTION_FAILED]: state => {
    state.creating = false;
  },
  [EDIT_COLLECTION_SUCCESS]: (state, { payload }) => {
    state.collectionList = state.collectionList.map(collection => {
      if (collection._id === payload._id) {
        return {
          ...collection,
          ...payload
        };
      }
      return collection;
    });
  },
  [FETCH_COLLECTIONS_LIST_REQUEST]: state => {
    state.fetchingCollections = true;
  },
  [FETCH_COLLECTIONS_LIST_SUCCESS]: (state, { payload }) => {
    state.fetchingCollections = false;
    state.collectionList = payload;
  },
  [FETCH_COLLECTIONS_LIST_FAILED]: state => {
    state.fetchingCollections = false;
  },
  [FETCH_PERMISSIONS_REQUEST]: state => {
    state.fetchingPermissions = true;
  },
  [FETCH_PERMISSIONS_SUCCESS]: (state, { payload }) => {
    state.fetchingPermissions = false;
    state.permissions = payload.itemBankPermissions;
  },
  [FETCH_PERMISSIONS_FAILED]: state => {
    state.fetchingPermissions = false;
  },
  [SEARCH_ORGANIZATION_REQUEST]: state => {
    state.fetchingOrganization = true;
  },
  [SEARCH_ORGANIZATION_SUCCESS]: (state, { payload }) => {
    if (payload.orgType === "SCHOOL") {
      state.schools = payload.result;
    } else if (payload.orgType === "USER") {
      state.users = payload.result;
    } else {
      state.districts = payload.result;
    }
    state.fetchingOrganization = false;
  },
  [SEARCH_ORGANIZATION_FAILED]: state => {
    state.fetchingOrganization = false;
  },
  [DELETE_PERMISSION_SUCCESS]: (state, { payload }) => {
    state.permissions = state.permissions.filter(p => p._id !== payload);
  },
  [GET_SIGNED_URL_REQUEST]: state => {
    state.signedUrlFetching = true;
  },
  [GET_SIGNED_URL_SUCCESS]: (state, { payload }) => {
    state.signedUrl = payload;
    state.signedUrlFetching = false;
  },
  [GET_SIGNED_URL_ERROR]: state => {
    state.signedUrlFetching = false;
  },
  [IMPORT_TEST_REQUEST]: state => {
    state.importing = true;
  },
  [IMPORT_TEST_SUCCESS]: (state, { payload }) => {
    state.importStatus = payload;
    state.importing = false;
  },
  [GET_SIGNED_URL_ERROR]: state => {
    state.importing = false;
  }
});

// sagas

function* createCollectionRequestSaga({ payload }) {
  try {
    const collection = yield call(collectionsApi.createNewCollection, payload.data);
    yield call(message.success, "Collection created Successfully.");
    yield put(createCollectionSuccessAction(collection));
    yield put(
      fetchCollectionListRequestAction({
        searchString: payload.searchValue
      })
    );
  } catch (err) {
    console.error(err);
    yield put(createCollectionFailedAction());
    let errorMessage = "Failed to create the Collection.";
    if ([403, 422].includes(err.data.statusCode)) errorMessage = err.data.message;
    yield call(message.error, errorMessage);
  }
}

function* editCollectionRequestSaga({ payload }) {
  try {
    yield call(collectionsApi.editCollection, payload);
    yield call(message.success, "Collection updated Successfully.");
    const collection = {
      ...payload.data,
      _id: payload.id
    };
    yield put(editCollectionSuccessAction(collection));
  } catch (err) {
    console.error(err);
    let errorMessage = "Failed to update the Collection.";
    if ([403, 422].includes(err.data.statusCode)) errorMessage = err.data.message;
    yield call(message.error, errorMessage);
  }
}

function* fetchCollectionListRequestSaga() {
  try {
    const collectionList = yield call(collectionsApi.getCollectionList);
    yield put(fetchCollectionListSuccessAction(collectionList));
  } catch (err) {
    yield put(fetchCollectionListFailedAction());
    console.error(err);
  }
}

function* fetchPermissionsRequestSaga({ payload }) {
  try {
    const permissions = yield call(collectionsApi.getPermissions, payload);
    yield put(fetchPermissionsSuccessAction(permissions));
  } catch (err) {
    console.error(err);
    yield call(message.error, "Unable to get permissions.");
    yield put(fetchPermissionsFailedAction());
  }
}

function* addPermissionRequestSaga({ payload }) {
  try {
    yield call(collectionsApi.addPermission, payload);
    yield put(fetchPermissionsRequestAction(payload.bankId));
    yield call(message.success, `Permission added successfully for ${payload.collectionName}.`);
  } catch (err) {
    console.error(err);
    let errorMessage = "Error occured while adding permision.";
    if ([403, 422].includes(err.data.statusCode)) errorMessage = err.data.message;
    yield call(message.error, errorMessage);
  }
}

function* editPermissionRequestSaga({ payload }) {
  try {
    yield call(collectionsApi.editPermission, payload);
    yield put(fetchPermissionsRequestAction(payload.bankId));
    yield call(message.success, "Permission edited successfully.");
  } catch (err) {
    console.error(err);
    let errorMessage = "Unable to edit Permission.";
    if ([403, 422].includes(err.data.statusCode)) errorMessage = err.data.message;
    yield call(message.error, errorMessage);
  }
}

function* searchOrgaizationRequestSaga({ payload }) {
  try {
    const result = yield call(collectionsApi.organizationSearch, payload);
    yield put(searchOrgaizationSuccessAction({ result, orgType: payload.orgType }));
  } catch (err) {
    yield put(searchOrgaizationFailedAction());
    console.error(err);
  }
}

function* deletePermissionRequestSaga({ payload }) {
  try {
    yield call(collectionsApi.deletePermission, payload);
    yield put(deletePermissionSuccessAction(payload.id));
    yield call(message.success, "Permission deactivated successfully");
  } catch (err) {
    console.error(err);
    yield call(message.error, "Unable to deactivate permission");
  }
}

export function* importTestToCollectionSaga({ payload }) {
  try {
    const { selectedCollectionName, selectedBucketId, signedUrl } = payload;
    console.log("pay..", JSON.stringify(payload));
    const response = yield call(contentImportApi.qtiImport, {
      files: [signedUrl],
      collectionName: selectedCollectionName
    });
    if (response?.jobIds?.length) {
      yield put(importTestToCollectionSuccessAction(response.jobIds));
      yield call(message.success, "Successfully uploaded");
    } else {
      yield put(importTestToCollectionFailedAction("Failed uploading"));
      yield call(message.error, "Uploading failed");
    }
  } catch (e) {
    yield put(importTestToCollectionFailedAction(e?.data || {}));
    yield call(message.error, "Error while importing collection data");
  }
}

export function* getSignedUrlSaga({ payload: file }) {
  try {
    const signedUrl = yield call(uploadToS3, file.originFileObj, aws.s3Folders.QTI_IMPORT);
    yield put(getSignedUrlSuccessAction(signedUrl));
  } catch (e) {
    yield put(getSignedUrlFailedAction(e?.data || {}));
    console.log(e);
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(CREATE_NEW_COLLECTION_REQUEST, createCollectionRequestSaga),
    yield takeEvery(EDIT_COLLECTION_REQUEST, editCollectionRequestSaga),
    yield takeEvery(FETCH_COLLECTIONS_LIST_REQUEST, fetchCollectionListRequestSaga),
    yield takeEvery(ADD_PERMISSION_REQUEST, addPermissionRequestSaga),
    yield takeEvery(FETCH_PERMISSIONS_REQUEST, fetchPermissionsRequestSaga),
    yield takeEvery(SEARCH_ORGANIZATION_REQUEST, searchOrgaizationRequestSaga),
    yield takeEvery(EDIT_PERMISSION_REQUEST, editPermissionRequestSaga),
    yield takeEvery(DELETE_PERMISSION_REQUEST, deletePermissionRequestSaga),
    yield takeLatest(GET_SIGNED_URL_REQUEST, getSignedUrlSaga),
    yield takeLatest(IMPORT_TEST_REQUEST, importTestToCollectionSaga)
  ]);
}

// selectors

export const stateSelector = state => state.collectionsReducer;

export const getCreateCollectionStateSelector = createSelector(
  stateSelector,
  state => state.creating
);

export const getFetchCollectionListStateSelector = createSelector(
  stateSelector,
  state => state.fetchingCollections
);

export const getCollectionListSelector = createSelector(
  stateSelector,
  state => state.collectionList
);

export const getFetchPermissionsStateSelector = createSelector(
  stateSelector,
  state => state.fetchingPermissions
);

export const getPermissionsSelector = createSelector(
  stateSelector,
  state => state.permissions
);

export const getSchoolListSelector = createSelector(
  stateSelector,
  state => state.schools
);

export const getUserListSelector = createSelector(
  stateSelector,
  state => state.users
);

export const getDistrictListSelector = createSelector(
  stateSelector,
  state => state.districts
);

export const getFetchOrganizationStateSelector = createSelector(
  stateSelector,
  state => state.fetchingOrganization
);

export const getSignedUrlSelector = createSelector(
  stateSelector,
  state => state.signedUrl
);

export const importStatusSelector = createSelector(
  stateSelector,
  state => state.importStatus
);

export const importingLoaderSelector = createSelector(
  stateSelector,
  state => state.importing
);

export const signedUrlFetchingSelector = createSelector(
  stateSelector,
  state => state.signedUrlFetching
);
