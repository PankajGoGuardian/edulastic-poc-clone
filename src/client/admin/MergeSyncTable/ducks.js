import { createReducer, createAction } from "redux-starter-kit";
import { createSelector } from "reselect";
import { put, takeEvery, call, all } from "redux-saga/effects";
import { notification } from "@edulastic/common";
import { adminApi } from "@edulastic/api";
import _get from "lodash.get";
import { omit } from "lodash";
import * as Sentry from "@sentry/browser";

// CONSTANTS
export const SEARCH_EXISTING_DATA_API = "[admin] SEARCH_EXISTING_DATA_API";
export const APPLY_DELTA_SYNC_CHANGES = "[admin] APPLY_DELTA_SYNC_CHANGES";
export const SYNC_SCHOOLS = "[admin] SYNC_SCHOOLS";
export const APPLY_CLASSNAMES_SYNC = "[admin] APPLY_CLASSNAMES_SYNC";
export const ENABLE_DISABLE_SYNC_ACTION = "[admin] ENABLE_DISABLE_SYNC_ACTION";
export const FETCH_CURRICULUM_DATA_ACTION = "[admin] FETCH_CURRICULUM_DATA_ACTION";
export const UPDATE_SUBJECT_ACTION = "[admin] UPDATE_OTHER_SUBJECT_ACTION";
export const UPDATE_EDULASTIC_SUBJECT_ACTION = "[admin] UPDATE_EDULASTIC_SUBJECT_ACTION";
export const UPDATE_EDULASTIC_STANDARD_ACTION = "[admin] UPDATE_EDULASTIC_STANDARD_ACTION";
export const ADD_SUBJECT_STANDARD_ROW_ACTION = "[admin] ADD_SUBJECT_STANDARD_ROW_ACTION";
export const UPLOAD_CSV = "[admin] uploading csv file";
export const UPDATE_SUBJECT_STANDARD_MAP = "[admin] UPDATE_SUBJECT_STANDARD_MAP";
export const FETCH_LOGS_DATA = "[admin] FETCH_LOGS_DATA";
export const DELETE_SUBJECT_STANDARD_ROW = "[admin] DELETE_SUBJECT_STANDARD_ROW";

export const FETCH_EXISTING_DATA_SUCCESS = "[admin] FETCH_EXISTING_DATA_SUCCESS";
export const FETCH_CURRICULUM_DATA_SUCCESS = "[admin] FETCH_CURRICULUM_DATA_SUCCESS";
export const LOGS_DATA_SUCCESS = "[admin] LOGS_DATA_SUCCESS";
export const LOGS_DATA_FAILED = "[admin] LOGS_DATA_FAILED";
export const RECEIVE_MERGED_ID = "[admin] merg ids to edulastic";
export const CLOSE_MERGE_RESPONSE_TABLE = "[admin] close merge response table";
export const CLEAR_MERGE_DATA = "[admin] clear merge data";

// ACTION CREATORS
export const searchExistingDataApi = createAction(SEARCH_EXISTING_DATA_API);
export const fetchExistingDataSuccess = createAction(FETCH_EXISTING_DATA_SUCCESS);
export const applyDeltaSyncChanges = createAction(APPLY_DELTA_SYNC_CHANGES);
export const syncSchools = createAction(SYNC_SCHOOLS);
export const applyClassNamesSync = createAction(APPLY_CLASSNAMES_SYNC);
export const enableDisableSyncAction = createAction(ENABLE_DISABLE_SYNC_ACTION);
export const fetchCurriculumDataAction = createAction(FETCH_CURRICULUM_DATA_ACTION);
export const fetchCurriculumDataSuccess = createAction(FETCH_CURRICULUM_DATA_SUCCESS);
export const updateSubjectAction = createAction(UPDATE_SUBJECT_ACTION);
export const updateEdulasticSubjectAction = createAction(UPDATE_EDULASTIC_SUBJECT_ACTION);
export const updateEdulasticStandardAction = createAction(UPDATE_EDULASTIC_STANDARD_ACTION);
export const addSubjectStandardRowAction = createAction(ADD_SUBJECT_STANDARD_ROW_ACTION);
export const updateSubjectStdMapAction = createAction(UPDATE_SUBJECT_STANDARD_MAP);
export const fetchLogsDataAction = createAction(FETCH_LOGS_DATA);
export const logsDataSuccessAction = createAction(LOGS_DATA_SUCCESS);
export const logsDataFailedAction = createAction(LOGS_DATA_FAILED);
export const deleteSubjectStdMapAction = createAction(DELETE_SUBJECT_STANDARD_ROW);
export const clearMergeDataAction = createAction(CLEAR_MERGE_DATA);

export const uploadCSVAction = createAction(UPLOAD_CSV);
export const receiveMergeIdsAction = createAction(RECEIVE_MERGED_ID);
export const closeMergeResponseAction = createAction(CLOSE_MERGE_RESPONSE_TABLE);

// REDUCERS

const initialState = {
  searchData: {},
  subStandardMapping: {
    rows: [],
    subjectStandardMap: {},
    curriculum: {},
    logs: []
  },
  mergeResponse: {
    data: [],
    showData: false
  }
};

const fetchExistingDataReducer = createReducer(initialState, {
  [CLEAR_MERGE_DATA]: () => initialState,
  [FETCH_EXISTING_DATA_SUCCESS]: (state, { payload }) => {
    const { isClasslink, ...dataPayload } = payload;
    const subjectStandardMap = _get(
      dataPayload.data,
      ["rosterSyncConfig", isClasslink ? "subjectStandardMap" : "cleverSubjectStandardMap"],
      {}
    );
    state.searchData = dataPayload;
    state.subStandardMapping.subjectStandardMap = subjectStandardMap;
    state.subStandardMapping.rows = Object.keys(subjectStandardMap).map(key => ({ subject: key }));
  },
  [FETCH_CURRICULUM_DATA_SUCCESS]: (state, { payload }) => {
    const obj = payload.result.reduce((accumulator, currentValue) => {
      const { subject } = currentValue;
      if (accumulator[subject]) {
        accumulator[subject].list.push(currentValue.curriculum);
      } else {
        accumulator[subject] = {};
        accumulator[subject].list = [currentValue.curriculum];
      }
      return accumulator;
    }, {});

    state.subStandardMapping.curriculum = obj;
  },
  [UPDATE_SUBJECT_ACTION]: (state, { payload: { index, value, prevValue } }) => {
    const {
      subStandardMapping: { rows, subjectStandardMap }
    } = state;
    rows[index].subject = value;
    subjectStandardMap[value] = {
      subject: "",
      standard: ""
    };
    delete subjectStandardMap[prevValue];
  },
  [UPDATE_EDULASTIC_SUBJECT_ACTION]: (state, { payload: { subject, value } }) => {
    const {
      subStandardMapping: { subjectStandardMap }
    } = state;
    subjectStandardMap[subject].subject = value;
  },
  [UPDATE_EDULASTIC_STANDARD_ACTION]: (state, { payload: { subject, value } }) => {
    const {
      subStandardMapping: { subjectStandardMap }
    } = state;
    subjectStandardMap[subject].standard = value;
  },
  [ADD_SUBJECT_STANDARD_ROW_ACTION]: state => {
    const {
      subStandardMapping: { rows }
    } = state;
    rows.push({ subject: "" });
  },
  [DELETE_SUBJECT_STANDARD_ROW]: (state, { payload: { index, subject } }) => {
    const {
      subStandardMapping: { rows, subjectStandardMap }
    } = state;
    rows.splice(index, 1);
    delete subjectStandardMap[subject];
  },
  [FETCH_LOGS_DATA]: state => {
    state.subStandardMapping.logsLoading = true;
  },
  [LOGS_DATA_SUCCESS]: (state, { payload }) => {
    state.subStandardMapping.logs = payload.result;
    state.subStandardMapping.logsLoading = false;
  },
  [LOGS_DATA_FAILED]: state => {
    state.subStandardMapping.logsLoading = false;
  },
  [RECEIVE_MERGED_ID]: (state, { payload: { data, mergeType } }) => {
    state.mergeResponse = {
      data,
      mergeType,
      showData: true
    };
  },
  [CLOSE_MERGE_RESPONSE_TABLE]: state => {
    state.mergeResponse = {
      data: [],
      showData: false
    };
  }
});

// SELECTORS
const adminStateSelector = state => state.admin;

export const getSearchData = createSelector(
  adminStateSelector,
  ({ mergeData }) => mergeData.searchData
);

export const getSubStandardMapping = createSelector(
  adminStateSelector,
  ({ mergeData }) => mergeData.subStandardMapping
);

export const mergeResponseSelector = createSelector(
  adminStateSelector,
  ({ mergeData }) => mergeData.mergeResponse
);

// SAGAS
const {
  fetchExistingDataMergeClever,
  fetchExistingDataMergeClasslink,
  applyDeltaSyncApi,
  applyAtlasDeltaSyncApi,
  selectedSchoolSyncApi,
  completeDistrictSync,
  fetchCleverClassNamesSyncApi,
  fetchAtlasClassNamesSyncApi,
  enableDisableCleverSyncApi,
  enableDisableClasslinkSyncApi,
  fetchCurriculumDataApi,
  uploadCSVtoClever,
  uploadCSVtoAtlas,
  updateCleverSubjectStandardApi,
  updateAtlasSubjectStandardApi,
  logsDataApi,
  logsAtlasDataApi,
  selectedAtlasSchoolSyncApi,
  completeAtlasDistrictSync
} = adminApi;

function* fetchExistingData({ payload }) {
  const { isClasslink } = payload;
  try {
    let item;
    if (isClasslink) {
      item = yield call(fetchExistingDataMergeClasslink, payload);
    } else {
      item = yield call(fetchExistingDataMergeClever, payload);
    }
    if (item.message) {
      notification({ msg: item.message });
    } else {
      yield put(fetchExistingDataSuccess({ ...item, isClasslink }));
    }
  } catch (err) {
    console.error(err);
    notification({ msg: err?.data?.message || err.message });
  }
}

function* fetchApplyDeltaSync({ payload }) {
  const { isClasslink, ...data } = payload;
  try {
    let item;
    if (isClasslink) {
      item = yield call(applyAtlasDeltaSyncApi, data);
    } else {
      item = yield call(applyDeltaSyncApi, data);
    }
    if (item.data) {
      notification({ type: "success", messageKey: "deltaSyncSucc" });
    }
  } catch (err) {
    console.error(err);
  }
}

function* fetchSchoolsSync({ payload }) {
  let item;
  const SYNC_SELECTED_SCHOOLS = "syncSelectedSchools";
  try {
    const { selectedSyncOption, isClasslink, cleverId, atlasId, schoolIds } = payload;
    if (isClasslink) {
      const dataPayload = {
        atlasId,
        atlasSchoolIds: schoolIds
      };
      if (selectedSyncOption === SYNC_SELECTED_SCHOOLS) {
        item = yield call(selectedAtlasSchoolSyncApi, dataPayload);
      } else {
        item = yield call(completeAtlasDistrictSync, dataPayload);
      }
    } else {
      const dataPayload = {
        cleverId,
        schoolCleverIds: schoolIds
      };
      if (selectedSyncOption === SYNC_SELECTED_SCHOOLS) {
        item = yield call(selectedSchoolSyncApi, dataPayload);
      } else {
        item = yield call(completeDistrictSync, dataPayload);
      }
    }
    const {
      result: { success, message: infoMessage }
    } = item;
    const messageKey = success ? "success" : "error";
    notification({ msg: infoMessage, type: messageKey });
  } catch (err) {
    const {
      data: { message: errMsg }
    } = err.response;
    Sentry.captureException(err);
    notification({ msg: errMsg });
  }
}

function* fetchClassNamesSync({ payload }) {
  try {
    const { isClasslink, ...dataPayload } = payload;
    if (isClasslink) {
      yield call(fetchAtlasClassNamesSyncApi, dataPayload);
    } else {
      yield call(fetchCleverClassNamesSyncApi, dataPayload);
    }
    notification({ type: "success", messageKey: "classSyncSucc" });
  } catch (err) {
    console.error(err);
  }
}

function* fetchEnableDisableSync({ payload }) {
  try {
    const { syncEnabled, districtName = "", districtId, cleverId, atlasId, isClasslink = false } = payload;
    let item;
    const newPayload = omit(payload, ["districtName", "cleverId", "atlasId", "isClasslink"]);
    if (isClasslink) {
      item = yield call(enableDisableClasslinkSyncApi, newPayload);
    } else {
      item = yield call(enableDisableCleverSyncApi, newPayload);
    }
    const searchPayload = { districtId, cleverId, atlasId, isClasslink };
    if (item.success) {
      yield call(fetchExistingData, { payload: searchPayload });
      if (syncEnabled) {
        notification({
          type: "success",
          msg: `Enabled ${isClasslink ? "classlink" : "clever"} sync for ${districtName}`
        });
      } else {
        notification({
          type: "success",
          msg: `Disabled ${isClasslink ? "classlink" : "clever"} sync for ${districtName}`
        });
      }
    } else {
      notification({ msg: item.message });
    }
  } catch (err) {
    console.error(err);
  }
}

function* fetchCurriculumData({ payload }) {
  try {
    const item = yield call(fetchCurriculumDataApi, payload);
    yield put(fetchCurriculumDataSuccess(item));
  } catch (err) {
    console.error(err);
  }
}

function* uploadCSVSaga({ payload }) {
  try {
    const { isClasslink, ...dataPayload } = payload;
    let response;
    if (isClasslink) {
      response = yield call(uploadCSVtoAtlas, dataPayload);
    } else {
      response = yield call(uploadCSVtoClever, dataPayload);
    }
    const { status = "", message: responseMsg = "", data = [] } = response || {};
    if (status !== "success") {
      return notification({ msg: responseMsg });
    }
    notification({ type: "success", msg: responseMsg });
    const { cleverId, atlasId, districtId, mergeType } = payload;
    yield put(receiveMergeIdsAction({ data, mergeType }));
    yield put(
      searchExistingDataApi({
        isClasslink,
        districtId,
        atlasId,
        cleverId
      })
    );
  } catch (err) {
    notification({ messageKey: "uploadCsvErr" });
  }
}

function* updateSubjectStandardSaga({ payload }) {
  try {
    const { isClasslink, subjectStandardMap, ...dataPayload } = payload;
    let item;
    if (isClasslink) {
      item = yield call(updateAtlasSubjectStandardApi, { ...dataPayload, subjectStandardMap });
    } else {
      item = yield call(updateCleverSubjectStandardApi, {
        ...dataPayload,
        cleverSubjectStandardMap: subjectStandardMap
      });
    }
    if (item.data) {
      notification({ type: "success", messageKey: "subjectStandardMapping" });
    }
  } catch (err) {
    console.error(err);
  }
}

function* fetchLogsData({ payload }) {
  try {
    const { isClasslink, districtId } = payload;
    let item;
    if (isClasslink) {
      item = yield call(logsAtlasDataApi, districtId);
    } else {
      item = yield call(logsDataApi, districtId);
    }
    yield put(logsDataSuccessAction(item));
  } catch (err) {
    yield put(logsDataFailedAction());
    console.error(err);
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(SEARCH_EXISTING_DATA_API, fetchExistingData),
    yield takeEvery(APPLY_DELTA_SYNC_CHANGES, fetchApplyDeltaSync),
    yield takeEvery(SYNC_SCHOOLS, fetchSchoolsSync),
    yield takeEvery(APPLY_CLASSNAMES_SYNC, fetchClassNamesSync),
    yield takeEvery(ENABLE_DISABLE_SYNC_ACTION, fetchEnableDisableSync),
    yield takeEvery(FETCH_CURRICULUM_DATA_ACTION, fetchCurriculumData),
    yield takeEvery(UPLOAD_CSV, uploadCSVSaga),
    yield takeEvery(UPDATE_SUBJECT_STANDARD_MAP, updateSubjectStandardSaga),
    yield takeEvery(FETCH_LOGS_DATA, fetchLogsData)
  ]);
}

export const sagas = [watcherSaga()];

// ALWAYS EXPORT DEFAULT A REDUCER
export default fetchExistingDataReducer;
