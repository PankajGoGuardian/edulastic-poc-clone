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
export const ENABLE_DISABLE_SYNC_ACTION = "[admin] ENABLE_DISABLE_SYNC_ACTION";
export const FETCH_CURRICULUM_DATA_ACTION = "[admin] FETCH_CURRICULUM_DATA_ACTION";
export const UPDATE_CLEVER_SUBJECT_ACTION = "[admin] UPDATE_CLEVER_SUBJECT_ACTION";
export const UPDATE_EDULASTIC_SUBJECT_ACTION = "[admin] UPDATE_EDULASTIC_SUBJECT_ACTION";
export const UPDATE_EDULASTIC_STANDARD_ACTION = "[admin] UPDATE_EDULASTIC_STANDARD_ACTION";
export const ADD_SUBJECT_STANDARD_ROW_ACTION = "[admin] ADD_SUBJECT_STANDARD_ROW_ACTION";
export const UPLOAD_CSV_TO_CLEVER = "[admin] uploading csv file to clever";
export const UPDATE_SUBJECT_STANDARD_MAP = "[admin] UPDATE_SUBJECT_STANDARD_MAP";
export const FETCH_LOGS_DATA = "[admin] FETCH_LOGS_DATA";
export const DELETE_SUBJECT_STANDARD_ROW = "[admin] DELETE_SUBJECT_STANDARD_ROW";

export const FETCH_EXISTING_DATA_SUCCESS = "[admin] FETCH_EXISTING_DATA_SUCCESS";
export const FETCH_CURRICULUM_DATA_SUCCESS = "[admin] FETCH_CURRICULUM_DATA_SUCCESS";
export const LOGS_DATA_SUCCESS = "[admin] LOGS_DATA_SUCCESS";
export const RECEIVE_MERGED_CLEVER_ID = "[admin] merge clever ids to edulastic";
export const CLOSE_MERGE_RESPONSE_TABLE = "[admin] close merge response table";

// ACTION CREATORS
export const searchExistingDataApi = createAction(SEARCH_EXISTING_DATA_API);
export const fetchExistingDataSuccess = createAction(FETCH_EXISTING_DATA_SUCCESS);
export const applyDeltaSyncChanges = createAction(APPLY_DELTA_SYNC_CHANGES);
export const syncSchools = createAction(SYNC_SCHOOLS);
export const applyClassNamesSync = createAction(APPLY_CLASSNAMES_SYNC);
export const enableDisableSyncAction = createAction(ENABLE_DISABLE_SYNC_ACTION);
export const fetchCurriculumDataAction = createAction(FETCH_CURRICULUM_DATA_ACTION);
export const fetchCurriculumDataSuccess = createAction(FETCH_CURRICULUM_DATA_SUCCESS);
export const updateCleverSubjectAction = createAction(UPDATE_CLEVER_SUBJECT_ACTION);
export const updateEdulasticSubjectAction = createAction(UPDATE_EDULASTIC_SUBJECT_ACTION);
export const updateEdulasticStandardAction = createAction(UPDATE_EDULASTIC_STANDARD_ACTION);
export const addSubjectStandardRowAction = createAction(ADD_SUBJECT_STANDARD_ROW_ACTION);
export const updateSubjectStdMapAction = createAction(UPDATE_SUBJECT_STANDARD_MAP);
export const fetchLogsDataAction = createAction(FETCH_LOGS_DATA);
export const logsDataSuccessAction = createAction(LOGS_DATA_SUCCESS);
export const deleteSubjectStdMapAction = createAction(DELETE_SUBJECT_STANDARD_ROW);

export const uploadCSVtoCleverAction = createAction(UPLOAD_CSV_TO_CLEVER);
export const receiveMergeCleverIdsAction = createAction(RECEIVE_MERGED_CLEVER_ID);
export const closeMergeResponseAction = createAction(CLOSE_MERGE_RESPONSE_TABLE);

// REDUCERS

const initialState = {
  searchData: {},
  subStandardMapping: {
    rows: [],
    cleverSubjectStandardMap: {},
    curriculum: {},
    logs: []
  },
  mergeResponse: {
    data: [],
    showData: false
  }
};

const fetchExistingDataReducer = createReducer(initialState, {
  [FETCH_EXISTING_DATA_SUCCESS]: (state, { payload }) => {
    const {
      rosterSyncConfig: { cleverSubjectStandardMap }
    } = payload.data;

    state.searchData = payload;
    state.subStandardMapping.cleverSubjectStandardMap = cleverSubjectStandardMap;
    state.subStandardMapping.rows = Object.keys(cleverSubjectStandardMap).map(key => ({ subject: key }));
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
  [UPDATE_CLEVER_SUBJECT_ACTION]: (state, { payload: { index, value, prevValue } }) => {
    const {
      subStandardMapping: { rows, cleverSubjectStandardMap }
    } = state;
    rows[index].subject = value;
    cleverSubjectStandardMap[value] = {
      subject: "",
      standard: ""
    };
    delete cleverSubjectStandardMap[prevValue];
  },
  [UPDATE_EDULASTIC_SUBJECT_ACTION]: (state, { payload: { subject, value } }) => {
    const {
      subStandardMapping: { cleverSubjectStandardMap }
    } = state;
    cleverSubjectStandardMap[subject].subject = value;
  },
  [UPDATE_EDULASTIC_STANDARD_ACTION]: (state, { payload: { subject, value } }) => {
    const {
      subStandardMapping: { cleverSubjectStandardMap }
    } = state;
    cleverSubjectStandardMap[subject].standard = value;
  },
  [ADD_SUBJECT_STANDARD_ROW_ACTION]: (state, _) => {
    const {
      subStandardMapping: { rows }
    } = state;
    rows.push({ subject: "" });
  },
  [DELETE_SUBJECT_STANDARD_ROW]: (state, { payload: { index, subject } }) => {
    const {
      subStandardMapping: { rows, cleverSubjectStandardMap }
    } = state;
    rows.splice(index, 1);
    delete cleverSubjectStandardMap[subject];
  },
  [LOGS_DATA_SUCCESS]: (state, { payload }) => {
    state.subStandardMapping.logs = payload.result;
  },
  [RECEIVE_MERGED_CLEVER_ID]: (state, { payload: { data, mergeType } }) => {
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
  fetchExistingDataMergeClever: fetchExistingDataApi,
  applyDeltaSyncApi,
  selectedSchoolSyncApi,
  completeDistrictSync,
  fetchClassNamesSyncApi,
  enableDisableSyncApi,
  fetchCurriculumDataApi,
  uploadCSVtoClever,
  updateSubjectStandardApi,
  logsDataApi
} = adminApi;

function* fetchExistingData({ payload }) {
  try {
    const item = yield call(fetchExistingDataApi, payload);
    if (item.message) {
      message.error(item.message);
    } else {
      yield put(fetchExistingDataSuccess(item));
    }
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
  let item;
  try {
    if (payload.selectedSyncOption === "syncSelectedSchools") {
      item = yield call(selectedSchoolSyncApi, payload);
    } else {
      item = yield call(completeDistrictSync, payload);
    }
    const {
      result: { success, message: infoMessage }
    } = item;
    const messageKey = success ? "success" : "error";
    message[messageKey](infoMessage);
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

function* fetchEnableDisableSync({ payload }) {
  try {
    const item = yield call(enableDisableSyncApi, payload);
    if (item.success) {
      message.success(item.message);
    } else {
      message.error(item.message);
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

function* uploadCSVtoCleverSaga({ payload }) {
  try {
    const response = yield call(uploadCSVtoClever, payload);
    const { status = "", message: responseMsg = "", data = [] } = response || {};
    if (status !== "success") {
      return message.error(responseMsg);
    }
    message.success(responseMsg);
    const { cleverId, districtId: cleverDistrict, mergeType } = payload;
    yield put(receiveMergeCleverIdsAction({ data, mergeType }));
    yield put(
      searchExistingDataApi({
        cleverDistrict,
        cleverId
      })
    );
  } catch (err) {
    message.error("Uploading failed");
  }
}

function* updateSubjectStandardSaga({ payload }) {
  try {
    const item = yield call(updateSubjectStandardApi, payload);
    if (item.data) {
      message.success("Subject Standard Mapping Successfully completed!");
    }
  } catch (err) {
    console.error(err);
  }
}

function* fetchLogsData({ payload }) {
  try {
    const item = yield call(logsDataApi, payload);
    yield put(logsDataSuccessAction(item));
  } catch (err) {
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
    yield takeEvery(UPLOAD_CSV_TO_CLEVER, uploadCSVtoCleverSaga),
    yield takeEvery(UPDATE_SUBJECT_STANDARD_MAP, updateSubjectStandardSaga),
    yield takeEvery(FETCH_LOGS_DATA, fetchLogsData)
  ]);
}

export const sagas = [watcherSaga()];

// ALWAYS EXPORT DEFAULT A REDUCER
export default fetchExistingDataReducer;
