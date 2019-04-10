import { createSelector } from "reselect";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { settingsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";

const RECEIVE_STANDARDS_PROFICIENCY_REQUEST = "[Standards Proficiency] receive data request";
const RECEIVE_STANDARDS_PROFICIENCY_SUCCESS = "[Standards Proficiency] receive data success";
const RECEIVE_STANDARDS_PROFICIENCY_ERROR = "[Standards Proficiency] receive data error";
const UPDATE_STANDARDS_PROFICIENCY_REQUEST = "[Standards Proficiency] update data request";
const UPDATE_STANDARDS_PROFICIENCY_SUCCESS = "[Standards Proficiency] update data success";
const UPDATE_STANDARDS_PROFICIENCY_ERROR = "[Standards Proficiency] update data error";

export const receiveStandardsProficiencyAction = createAction(RECEIVE_STANDARDS_PROFICIENCY_REQUEST);
export const receiveStandardsProficiencySuccessAction = createAction(RECEIVE_STANDARDS_PROFICIENCY_SUCCESS);
export const receiveStandardsProficiencyErrorAction = createAction(RECEIVE_STANDARDS_PROFICIENCY_ERROR);
export const updateStandardsProficiencyAction = createAction(UPDATE_STANDARDS_PROFICIENCY_REQUEST);
export const updateStandardsProficiencySuccessAction = createAction(UPDATE_STANDARDS_PROFICIENCY_SUCCESS);
export const updateStandardsProficiencyErrorAction = createAction(UPDATE_STANDARDS_PROFICIENCY_ERROR);

// selectors
const stateStandardsProficiencySelector = state => state.standardsProficiencyReducer;

export const getStandardsProficiencySelector = createSelector(
  stateStandardsProficiencySelector,
  state => state.data
);

export const getStandardsProficiencyLoadingSelector = createSelector(
  stateStandardsProficiencySelector,
  state => state.loading
);

export const getStandardsProficiencyUpdatingSelector = createSelector(
  stateStandardsProficiencySelector,
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

const receiveStandardProficiencyRequest = state => ({
  ...state,
  loading: true
});

const receiveStandardsProficiencySuccess = (state, { payload }) => ({
  ...state,
  loading: false,
  data: payload
});

const receiveStandardsProficiencyError = (state, { payload }) => ({
  ...state,
  error: payload.error
});

const updateStandardsProficiencyRequest = state => ({
  ...state,
  updating: true
});

const updateStandardsProficiencySuccess = (state, { payload }) => ({
  ...state,
  data: payload,
  updating: false
});

const updateStandardsProficiencyError = (state, { payload }) => ({
  ...state,
  updating: false,
  updateError: payload.error
});

export const reducer = createReducer(initialState, {
  [RECEIVE_STANDARDS_PROFICIENCY_REQUEST]: receiveStandardProficiencyRequest,
  [RECEIVE_STANDARDS_PROFICIENCY_SUCCESS]: receiveStandardsProficiencySuccess,
  [RECEIVE_STANDARDS_PROFICIENCY_ERROR]: receiveStandardsProficiencyError,
  [UPDATE_STANDARDS_PROFICIENCY_REQUEST]: updateStandardsProficiencyRequest,
  [UPDATE_STANDARDS_PROFICIENCY_SUCCESS]: updateStandardsProficiencySuccess,
  [UPDATE_STANDARDS_PROFICIENCY_ERROR]: updateStandardsProficiencyError
});

// sagas
function* receiveStandardsProficiencySaga({ payload }) {
  try {
    const standardsProficiency = yield call(settingsApi.getStandardsProficiency, payload);
    yield put(receiveStandardsProficiencySuccessAction(standardsProficiency));
  } catch (err) {
    const errorMessage = "Receive StandardsProficiency is failing";
    yield call(message.error, errorMessage);
    yield put(receiveStandardsProficiencyErrorAction({ error: errorMessage }));
  }
}

function* updateStandardsProficiencySaga({ payload }) {
  try {
    const updateStandardsProficiency = yield call(settingsApi.updateStandardsProficiency, payload);
    const successMessage = "StandardsProficiency Saved Successfully!";
    yield call(message.success, successMessage);
    yield put(updateStandardsProficiencySuccessAction(updateStandardsProficiency));
  } catch (err) {
    const errorMessage = "Update StandardsProficiency is failing";
    yield call(message.error, errorMessage);
    yield put(updateStandardsProficiencyErrorAction({ error: errorMessage }));
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_STANDARDS_PROFICIENCY_REQUEST, receiveStandardsProficiencySaga)]);
  yield all([yield takeEvery(UPDATE_STANDARDS_PROFICIENCY_REQUEST, updateStandardsProficiencySaga)]);
}
