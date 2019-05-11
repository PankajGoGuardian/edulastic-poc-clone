import { createAction, createReducer } from "redux-starter-kit";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { settingsApi } from "@edulastic/api";
import { message } from "antd";

// action types
const RECEIVE_INTERESTED_STANDARDS_REQUEST = "[interested standards] receive data request";
const RECEIVE_INTERESTED_STANDARDS_SUCCESS = "[interested standards] receive data success";
const RECEIVE_INTERESTED_STANDARDS_ERROR = "[interested standards] receive data error";
const UPDATE_INTERESTED_STANDARDS_REQUEST = "[interested standards] update data request";
const UPDATE_INTERESTED_STANDARDS_SUCCESS = "[interested standards] update data success";
const UPDATE_INTERESTED_STANDARDS_ERROR = "[interested standards] update data error";
const SAVE_INTERESTED_STANDARDS_REQUEST = "[interested standards] save data request";
const SAVE_INTERESTED_STANDARDS_SUCCESS = "[interested standards] save data success";
const SAVE_INTERESTED_STANDARDS_ERROR = "[interested standards] save data error";

const DELETE_STANDARD = "[interested standards] delete standard";

export const receiveInterestedStandardsAction = createAction(RECEIVE_INTERESTED_STANDARDS_REQUEST);
export const receiveInterestedStandardsSuccessAction = createAction(RECEIVE_INTERESTED_STANDARDS_SUCCESS);
export const receiveInterestedStandardsErrorAction = createAction(RECEIVE_INTERESTED_STANDARDS_ERROR);
export const updateInterestedStandardsAction = createAction(UPDATE_INTERESTED_STANDARDS_REQUEST);
export const updateInterestedStandardsSuccessAction = createAction(UPDATE_INTERESTED_STANDARDS_SUCCESS);
export const updateInterestedStandardsErrorAction = createAction(UPDATE_INTERESTED_STANDARDS_ERROR);
export const saveInterestedStandardsAction = createAction(SAVE_INTERESTED_STANDARDS_REQUEST);
export const saveInterestedStandardsSuccessAction = createAction(SAVE_INTERESTED_STANDARDS_SUCCESS);
export const saveInterestedStandardsErrorAction = createAction(SAVE_INTERESTED_STANDARDS_ERROR);
export const deleteStandardAction = createAction(DELETE_STANDARD);

// reducers
const initialState = {
  data: {},
  error: null,
  loading: false,
  updating: false,
  update: null,
  updateError: null,
  save: null,
  saving: false,
  saveError: null
};

export const reducer = createReducer(initialState, {
  [RECEIVE_INTERESTED_STANDARDS_REQUEST]: state => {
    state.loading = true;
  },
  [RECEIVE_INTERESTED_STANDARDS_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.data = payload;
  },
  [RECEIVE_INTERESTED_STANDARDS_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },
  [UPDATE_INTERESTED_STANDARDS_REQUEST]: state => {
    state.updating = true;
  },
  [UPDATE_INTERESTED_STANDARDS_SUCCESS]: (state, { payload }) => {
    state.updating = false;
    state.data = payload;
  },
  [UPDATE_INTERESTED_STANDARDS_ERROR]: (state, { payload }) => {
    state.updating = false;
    state.updateError = payload.error;
  },
  [SAVE_INTERESTED_STANDARDS_REQUEST]: state => {
    state.saving = true;
  },
  [SAVE_INTERESTED_STANDARDS_SUCCESS]: (state, { payload }) => {
    state.saving = false;
    state.save = payload;
  },
  [SAVE_INTERESTED_STANDARDS_ERROR]: (state, { payload }) => {
    state.saving = false;
    state.saveError = payload.error;
  },
  [DELETE_STANDARD]: (state, { payload }) => {
    let interstedStandards = { ...state.data };
    const curriculums = interstedStandards.curriculums.filter(item => item._id !== payload);
    interstedStandards.curriculums = curriculums;
    state.data = interstedStandards;
  }
});

// saga
function* receiveInterestedStandardsSaga({ payload }) {
  try {
    const interestedStandards = yield call(settingsApi.getInterestedStandards, payload);
    yield put(receiveInterestedStandardsSuccessAction(interestedStandards));
  } catch (err) {
    const errorMessage = "Receive Interested Standards is failing";
    yield call(message.error, errorMessage);
    yield put(receiveInterestedStandardsErrorAction({ error: errorMessage }));
  }
}

function* updateInterestedStandardsSaga({ payload }) {
  try {
    const updateInterestedStandards = yield call(settingsApi.updateInterestedStandards, payload);
    yield put(updateInterestedStandardsSuccessAction(updateInterestedStandards));
  } catch (err) {
    const errorMessage = "Update Interested Standards is failing";
    yield call(message.error, errorMessage);
    yield put(updateInterestedStandardsErrorAction({ error: errorMessage }));
  }
}

function* saveInterestedStandardsSaga({ payload }) {
  try {
    const saveInterestedStandards = yield call(settingsApi.saveInterestedStandards, payload);
    yield put(saveInterestedStandardsSuccessAction(saveInterestedStandards));
  } catch (err) {
    const errorMessage = "Save Interested Standards is failing";
    yield call(message.error, errorMessage);
    yield put(saveInterestedStandardsErrorAction({ error: errorMessage }));
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_INTERESTED_STANDARDS_REQUEST, receiveInterestedStandardsSaga)]);
  yield all([yield takeEvery(SAVE_INTERESTED_STANDARDS_REQUEST, saveInterestedStandardsSaga)]);
  yield all([yield takeEvery(UPDATE_INTERESTED_STANDARDS_REQUEST, updateInterestedStandardsSaga)]);
}
