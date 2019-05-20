import { createSelector } from "reselect";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { settingsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";

const RECEIVE_TEST_SETTING_REQUEST = "[testSetting] receive data request";
const RECEIVE_TEST_SETTING_SUCCESS = "[testSetting] receive data success";
const RECEIVE_TEST_SETTING_ERROR = "[testSetting] receive data error";
const UPDATE_TEST_SETTING_REQUEST = "[testSetting] update data request";
const UPDATE_TEST_SETTING_SUCCESS = "[testSetting] update data success";
const UPDATE_TEST_SETTING_ERROR = "[testSetting] update data error";
const CREATE_TEST_SETTING_REQUEST = "[testSetting] create data request";
const CREATE_TEST_SETTING_SUCCESS = "[testSetting] create data success";
const CREATE_TEST_SETTING_ERROR = "[testSetting] create data error";

const SET_TEST_SETTING_VALUE_REQUEST = "[testSetting] set test setting value";

export const receiveTestSettingAction = createAction(RECEIVE_TEST_SETTING_REQUEST);
export const receiveTestSettingSuccessAction = createAction(RECEIVE_TEST_SETTING_SUCCESS);
export const receiveTestSettingErrorAction = createAction(RECEIVE_TEST_SETTING_ERROR);
export const updateTestSettingAction = createAction(UPDATE_TEST_SETTING_REQUEST);
export const updateTestSettingSuccessAction = createAction(UPDATE_TEST_SETTING_SUCCESS);
export const updateTestSettingErrorAction = createAction(UPDATE_TEST_SETTING_ERROR);
export const createTestSettingAction = createAction(CREATE_TEST_SETTING_REQUEST);
export const createTestSettingSuccessAction = createAction(CREATE_TEST_SETTING_SUCCESS);
export const createTestSettingErrorAction = createAction(CREATE_TEST_SETTING_ERROR);

export const setTestSettingValueAction = createAction(SET_TEST_SETTING_VALUE_REQUEST);

// reducers
const initialState = {
  data: {},
  error: null,
  loading: false,
  updating: false,
  update: null,
  updateError: null
};

export const reducer = createReducer(initialState, {
  [RECEIVE_TEST_SETTING_REQUEST]: state => {
    state.loading = true;
  },
  [RECEIVE_TEST_SETTING_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.data = payload;
  },
  [RECEIVE_TEST_SETTING_ERROR]: (state, { payload }) => {
    (state.loading = false), (state.error = payload.error);
  },
  [UPDATE_TEST_SETTING_REQUEST]: state => {
    state.updating = true;
  },
  [UPDATE_TEST_SETTING_SUCCESS]: (state, { payload }) => {
    state.data = payload;
    state.updating = false;
  },
  [UPDATE_TEST_SETTING_ERROR]: (state, { payload }) => {
    state.updateError = payload.error;
    state.updating = false;
  },
  [CREATE_TEST_SETTING_REQUEST]: state => {
    state.creating = true;
  },
  [CREATE_TEST_SETTING_SUCCESS]: (state, { payload }) => {
    state.data = payload;
    state.creating = false;
  },
  [CREATE_TEST_SETTING_ERROR]: (state, { payload }) => {
    state.createError = payload.error;
    state.creating = false;
  },
  [SET_TEST_SETTING_VALUE_REQUEST]: (state, { payload }) => {
    state.data = payload;
  }
});

// sagas
function* receiveTestSettingeSaga({ payload }) {
  try {
    const testSetting = yield call(settingsApi.getTestSetting, payload);
    yield put(receiveTestSettingSuccessAction(testSetting));
  } catch (err) {
    const errorMessage = "Receive Test Setting is failing";
    yield call(message.error, errorMessage);
    yield put(receiveTestSettingErrorAction({ error: errorMessage }));
  }
}

function* updateTestSettingSaga({ payload }) {
  try {
    const updateTestSetting = yield call(settingsApi.updateTestSetting, payload);
    yield put(updateTestSettingSuccessAction(updateTestSetting));
  } catch (err) {
    const errorMessage = "Update Test Setting is failing";
    yield call(message.error, errorMessage);
    yield put(updateTestSettingErrorAction({ error: errorMessage }));
  }
}

function* createTestSettingSaga({ payload }) {
  try {
    const createTestSetting = yield call(settingsApi.createTestSetting, payload);
    yield put(createTestSettingSuccessAction(createTestSetting));
  } catch (err) {
    const errorMessage = "Create Test Setting is failing";
    yield call(message.error, errorMessage);
    yield put(createTestSettingErrorAction({ error: errorMessage }));
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_TEST_SETTING_REQUEST, receiveTestSettingeSaga)]);
  yield all([yield takeEvery(UPDATE_TEST_SETTING_REQUEST, updateTestSettingSaga)]);
  yield all([yield takeEvery(CREATE_TEST_SETTING_REQUEST, createTestSettingSaga)]);
}
