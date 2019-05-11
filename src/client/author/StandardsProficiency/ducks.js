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
  [RECEIVE_STANDARDS_PROFICIENCY_REQUEST]: state => {
    state.loading = true;
  },
  [RECEIVE_STANDARDS_PROFICIENCY_SUCCESS]: (state, { payload }) => {
    state.data = payload;
    state.loading = false;
  },
  [RECEIVE_STANDARDS_PROFICIENCY_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },
  [UPDATE_STANDARDS_PROFICIENCY_REQUEST]: state => {
    state.updating = true;
  },
  [UPDATE_STANDARDS_PROFICIENCY_SUCCESS]: (state, { payload }) => {
    state.updating = false;
    state.data = payload;
  },
  [UPDATE_STANDARDS_PROFICIENCY_ERROR]: (state, { payload }) => {
    state.updating = false;
    state.updateError = payload.error;
  }
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
