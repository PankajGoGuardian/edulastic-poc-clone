import { createReducer, createAction } from "redux-starter-kit";
import { createSelector } from "reselect";
import { put, takeEvery, call, all } from "redux-saga/effects";
import { message } from "antd";
import { adminApi } from "@edulastic/api";

// CONSTANTS
export const SEARCH_EXISTING_DATA_API = "[admin] SEARCH_EXISTING_DATA_API";
export const APPLY_DELTA_SYNC_CHANGES = "[admin] APPLY_DELTA_SYNC_CHANGES";
export const SYNC_SCHOOLS = "[admin] SYNC_SCHOOLS";
export const APPLY_CLASSNAMES_SYNC = "[admin] APPLY_CLASSNAMES_SYNC";
export const UPLOAD_CSV_TO_CLEVER = "[admin] uploading csv file to clever";

export const FETCH_EXISTING_DATA_SUCCESS = "[admin] FETCH_EXISTING_DATA_SUCCESS";

// ACTION CREATORS
export const searchExistingDataApi = createAction(SEARCH_EXISTING_DATA_API);
export const fetchExistingDataSuccess = createAction(FETCH_EXISTING_DATA_SUCCESS);
export const applyDeltaSyncChanges = createAction(APPLY_DELTA_SYNC_CHANGES);
export const syncSchools = createAction(SYNC_SCHOOLS);
export const applyClassNamesSync = createAction(APPLY_CLASSNAMES_SYNC);
export const uploadCSVtoCleverAction = createAction(UPLOAD_CSV_TO_CLEVER);
// REDUCERS
const initialState = {};

const fetchExistingDataReducer = createReducer(initialState, {
  [FETCH_EXISTING_DATA_SUCCESS]: (_, action) => action.payload
});

// SELECTORS
const adminStateSelector = state => state.admin;

export const getMergeData = createSelector(
  adminStateSelector,
  ({ mergeData }) => mergeData
);

// SAGAS
const {
  fetchExistingDataMergeClever: fetchExistingDataApi,
  applyDeltaSyncApi,
  selectedSchoolSyncApi,
  completeDistrictSync,
  fetchClassNamesSyncApi,
  uploadCSVtoClever
} = adminApi;

function* fetchExistingData({ payload }) {
  try {
    const item = yield call(fetchExistingDataApi, payload);
    yield put(fetchExistingDataSuccess(item));
  } catch (err) {
    console.error(err);
    message.error(err.message);
  }
}

function* fetchApplyDeltaSync({ payload }) {
  try {
    const item = yield call(applyDeltaSyncApi, payload);
    if (item.data) {
      message.success("Your data is synced");
    }
  } catch (err) {
    console.error(err);
  }
}

function* fetchSchoolsSync({ payload }) {
  try {
    if (payload.selectedSyncOption === "syncSelectedSchools") {
      const item = yield call(selectedSchoolSyncApi, payload);
    } else {
      const item = yield call(completeDistrictSync, payload);
    }
    message.success("Sync in progress");
  } catch (err) {
    console.error(err);
  }
}

function* fetchClassNamesSync({ payload }) {
  try {
    const item = yield call(fetchClassNamesSyncApi, payload);
    message.success("Your data is synced");
  } catch (err) {
    console.error(err);
  }
}

function* uploadCSVtoCleverSaga({ payload }) {
  try {
    const response = yield call(uploadCSVtoClever, payload);
    if (Array.isArray(response)) {
      const { status = "", message: responseMsg = "" } = response[0] || {};
      if (status !== "success") {
        return message.error(responseMsg);
      }
      const { cleverId, districtId: cleverDistrict } = payload;
      yield put(
        searchExistingDataApi({
          cleverDistrict,
          cleverId
        })
      );
      return message.success(responseMsg);
    }
    return message.error(response);
  } catch (err) {
    message.error("Uploading failed");
    console.error(err);
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(SEARCH_EXISTING_DATA_API, fetchExistingData),
    yield takeEvery(APPLY_DELTA_SYNC_CHANGES, fetchApplyDeltaSync),
    yield takeEvery(SYNC_SCHOOLS, fetchSchoolsSync),
    yield takeEvery(APPLY_CLASSNAMES_SYNC, fetchClassNamesSync),
    yield takeEvery(UPLOAD_CSV_TO_CLEVER, uploadCSVtoCleverSaga)
  ]);
}

export const sagas = [watcherSaga()];

// ALWAYS EXPORT DEFAULT A REDUCER
export default fetchExistingDataReducer;
