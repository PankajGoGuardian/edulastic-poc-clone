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
const UPDATE_TEST_SETTING_ERROR = "[testSetting] receive data error";

export const receiveTestSettingAction = createAction(RECEIVE_TEST_SETTING_REQUEST);
export const receiveTestSettingSuccessAction = createAction(RECEIVE_TEST_SETTING_SUCCESS);
export const receiveTestSettingErrorAction = createAction(RECEIVE_TEST_SETTING_ERROR);
export const updateTestSettingAction = createAction(UPDATE_TEST_SETTING_REQUEST);
export const updateTestSettingSuccessAction = createAction(UPDATE_TEST_SETTING_SUCCESS);
export const updaetTestSettingErrorAction = createAction(UPDATE_TEST_SETTING_ERROR);

// selectors
const stateTestSettingSelector = state => state.testSettingReducer;

export const getTestSettingSelector = createSelector(
  stateTestSettingSelector,
  state => state.data
);

export const getTestSettingLoadingSelector = createSelector(
  stateTestSettingSelector,
  state => state.loading
);

export const getTestSettingUpdatingSelector = createSelector(
  stateTestSettingSelector,
  state => state.updating
);

// reducers
const initialState = {
  data: {},
  error: null,
  loading: false,
  updating: false,
  update: null,
  updateError: null
};

const receiveTestSettingRequest = state => ({
  ...state,
  loading: true
});

const receiveTestSettingSuccess = (state, { payload }) => ({
  ...state,
  loading: false,
  data: payload
});

const receiveTestSettingError = (state, { payload }) => ({
  ...state,
  loading: false,
  error: payload.error
});

const updateTestSettingRequest = state => ({
  ...state,
  updating: true
});

const updateTestSettingSuccess = (state, { payload }) => ({
  ...state,
  data: payload,
  updating: false
});

const updateTestSettingError = (state, { payload }) => ({
  ...state,
  updateError: payload.error,
  updating: false
});

export const reducer = createReducer(initialState, {
  [RECEIVE_TEST_SETTING_REQUEST]: receiveTestSettingRequest,
  [RECEIVE_TEST_SETTING_SUCCESS]: receiveTestSettingSuccess,
  [RECEIVE_TEST_SETTING_ERROR]: receiveTestSettingError,
  [UPDATE_TEST_SETTING_REQUEST]: updateTestSettingRequest,
  [UPDATE_TEST_SETTING_SUCCESS]: updateTestSettingSuccess,
  [UPDATE_TEST_SETTING_ERROR]: updateTestSettingError
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
    const successMessage = "Update succeeded";
    yield call(message.success, successMessage);
    yield put(updateTestSettingSuccessAction(updateTestSetting));
  } catch (err) {
    const errorMessage = "Update Test Setting is failing";
    yield call(message.error, errorMessage);
    yield put(updateTestSettingErrorAction({ error: errorMessage }));
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_TEST_SETTING_REQUEST, receiveTestSettingeSaga)]);
  yield all([yield takeEvery(UPDATE_TEST_SETTING_REQUEST, updateTestSettingSaga)]);
}
