import { createAction, createReducer } from "redux-starter-kit";
import { all, put, takeLatest } from "redux-saga/effects";
import { delay } from "redux-saga";

const UPLOAD_TEST_REQUEST = "[import test] upload test request";
const UPLOAD_TEST_SUSSESS = "[import test] upload test success";
const UPLOAD_TEST_ERROR = "[import test] upload test error";

export const uploadTestRequestAction = createAction(UPLOAD_TEST_REQUEST);
export const uploadTestSuccessAction = createAction(UPLOAD_TEST_SUSSESS);
export const uploadTestErrorAction = createAction(UPLOAD_TEST_ERROR);

const initialState = {
  testDetail: {},
  error: {},
  status: "STANDBY"
};

const uplodTestInitiate = (state, { payload = { status: "INITIATE" } }) => {
  const { status } = payload;
  return { ...state, status };
};

const uploadTestSuccess = (state, { payload }) => ({ ...state, ...payload });

const uploadTestError = (state, { payload }) => {
  const { error } = payload;
  return { ...state, error };
};

export const reducers = createReducer(initialState, {
  [UPLOAD_TEST_REQUEST]: uplodTestInitiate,
  [UPLOAD_TEST_SUSSESS]: uploadTestSuccess,
  [UPLOAD_TEST_ERROR]: uploadTestError
});

export function* uploadTestStaga() {
  yield delay(5000); // make a real request
  console.log("action getting called");
  // example output
  yield put(
    uploadTestSuccessAction({ testDetail: { numberOfFilesUploaded: 100 }, status: "DONE" })
  );
}

export function* importTestWatcher() {
  yield all([yield takeLatest(UPLOAD_TEST_REQUEST, uploadTestStaga)]);
}
