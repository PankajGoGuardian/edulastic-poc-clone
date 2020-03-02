import { createAction, createReducer } from "redux-starter-kit";
import { createSelector } from "reselect";
import { all, call, takeLatest, put } from "redux-saga/effects";
import { contentImportApi, extractContent } from "@edulastic/api";
import { uploadToS3 } from "@edulastic/common";
import { aws } from "@edulastic/constants";
import { groupBy } from "lodash";

import { message } from "antd";

export const UPLOAD_STATUS = {
  STANDBY: "STANDBY",
  INITIATE: "INITIATE",
  DONE: "DONE"
};

export const JOB_STATUS = {
  PROGRESS: "progress",
  FAILED: "failed",
  SUCCESS: "success"
};
const UPLOAD_TEST_REQUEST = "[import test] upload test request";
const UPLOAD_TEST_SUSSESS = "[import test] upload test success";
const UPLOAD_TEST_ERROR = "[import test] upload test error";
const SET_UPLOAD_TEST_STATUS = "[import test] set upload test status";
const SET_JOB_IDS = "[import test] test job ids";
const GET_IMPORT_PROGRESS = "[import test] get import progress action";
const SET_JOBS_DATA = "[import test] set jobs response data";

export const uploadTestRequestAction = createAction(UPLOAD_TEST_REQUEST);
export const uploadTestSuccessAction = createAction(UPLOAD_TEST_SUSSESS);
export const uploadTestErrorAction = createAction(UPLOAD_TEST_ERROR);
export const uploadTestStatusAction = createAction(SET_UPLOAD_TEST_STATUS);
export const setJobIdsAction = createAction(SET_JOB_IDS);
export const qtiImportProgressAction = createAction(GET_IMPORT_PROGRESS);
export const setJobsDataAction = createAction(SET_JOBS_DATA);

const initialState = {
  testDetail: {},
  error: {},
  status: "STANDBY",
  jobIds: [],
  jobsData: []
};

const testUploadStatus = (state, { payload }) => {
  sessionStorage.setItem("testUploadStatus", payload);
  state.status = payload;
};

const uploadTestSuccess = (state, { payload }) => ({ ...state, ...payload });

const uploadTestError = (state, { payload }) => {
  state.error = payload;
};

const setJobIds = (state, { payload }) => {
  sessionStorage.setItem("jobIds", JSON.stringify(payload));
  state.jobIds = payload;
};

const setJobsData = (state, { payload }) => {
  state.jobsData = payload;
};

export const reducers = createReducer(initialState, {
  [SET_UPLOAD_TEST_STATUS]: testUploadStatus,
  [UPLOAD_TEST_SUSSESS]: uploadTestSuccess,
  [UPLOAD_TEST_ERROR]: uploadTestError,
  [SET_JOB_IDS]: setJobIds,
  [SET_JOBS_DATA]: setJobsData
});

export function* uploadTestStaga({ payload: fileList = [] }) {
  try {
    const files = [];
    yield put(uploadTestStatusAction(UPLOAD_STATUS.INITIATE));
    for (const file of fileList) {
      const filePath = yield call(uploadToS3, file.originFileObj, aws.s3Folders.QTI_IMPORT);
      files.push(yield call(extractContent.qtiExtract, { files: [filePath] }));
    }
    const response = yield call(contentImportApi.qtiImport, { files });
    if (response?.jobIds?.length) {
      yield put(setJobIdsAction(response.jobIds));
    } else {
      yield put(uploadTestError("Failed uploading"));
    }
  } catch (e) {
    console.log(e, "eee");
  }
}

function* getImportProgressSaga({ payload: jobIds }) {
  try {
    const response = yield call(contentImportApi.qtiImportProgress, { jobIds });
    yield put(setJobsDataAction(response));
    if (response.every(({ status }) => status !== JOB_STATUS.PROGRESS)) {
      yield put(uploadTestStatusAction(UPLOAD_STATUS.DONE));
    }
  } catch (e) {
    console.log({ e });
    return message.error("Failed to fetch progress status");
  }
}

export function* importTestWatcher() {
  yield all([
    yield takeLatest(UPLOAD_TEST_REQUEST, uploadTestStaga),
    yield takeLatest(GET_IMPORT_PROGRESS, getImportProgressSaga)
  ]);
}

export const stateSelector = state => state.admin.importTest;

export const getJobsDataSelector = createSelector(
  stateSelector,
  state => state.jobsData
);
export const getCompletedJobsByStatus = createSelector(
  getJobsDataSelector,
  jobsData => groupBy(jobsData, "status")
);
