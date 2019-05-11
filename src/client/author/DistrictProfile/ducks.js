import { createSelector } from "reselect";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { settingsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";

const RECEIVE_DISTRICT_PROFILE_REQUEST = "[districtProfile] receive data request";
const RECEIVE_DISTRICT_PROFILE_SUCCESS = "[districtProfile] receive data success";
const RECEIVE_DISTRICT_PROFILE_ERROR = "[districtProfile] receive data error";
const UPDATE_DISTRICT_PROFILE_REQUEST = "[districtProfile] update data request";
const UPDATE_DISTRICT_PROFILE_SUCCESS = "[districtProfile] update data success";
const UPDATE_DISTRICT_PROFILE_ERROR = "[districtProfile] update data error";

export const receiveDistrictProfileAction = createAction(RECEIVE_DISTRICT_PROFILE_REQUEST);
export const receiveDistrictProfileSuccessAction = createAction(RECEIVE_DISTRICT_PROFILE_SUCCESS);
export const receiveDistrictProfileErrorAction = createAction(RECEIVE_DISTRICT_PROFILE_ERROR);
export const updateDistrictProfileAction = createAction(UPDATE_DISTRICT_PROFILE_REQUEST);
export const updateDistrictProfileSuccessAction = createAction(UPDATE_DISTRICT_PROFILE_SUCCESS);
export const updateDistrictProfileErrorAction = createAction(UPDATE_DISTRICT_PROFILE_ERROR);

const initialState = {
  data: {},
  error: null,
  loading: false,
  updating: false,
  updateError: null
};

export const reducer = createReducer(initialState, {
  [RECEIVE_DISTRICT_PROFILE_REQUEST]: state => {
    state.loading = true;
  },
  [RECEIVE_DISTRICT_PROFILE_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.data = payload;
  },
  [RECEIVE_DISTRICT_PROFILE_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },
  [UPDATE_DISTRICT_PROFILE_REQUEST]: state => {
    state.updating = true;
  },
  [UPDATE_DISTRICT_PROFILE_SUCCESS]: (state, { payload }) => {
    state.updating = false;
    state.update = payload;
  },
  [UPDATE_DISTRICT_PROFILE_ERROR]: state => {
    state.updating = false;
    state.updateError = payload.error;
  }
});

function* receiveDistrictProfileSaga({ payload }) {
  try {
    const districtProfile = yield call(settingsApi.getDistrictProfile, payload);
    yield put(receiveDistrictProfileSuccessAction(districtProfile));
  } catch (err) {
    const errorMessage = "Receive District Profile is failing";
    yield call(message.error, errorMessage);
    yield put(receiveDistrictProfileErrorAction({ error: errorMessage }));
  }
}

function* updateDictrictProfileSaga({ payload }) {
  try {
    const updateDistrictProfile = yield call(settingsApi.updateDistrictProfie, payload);
    yield put(updateDistrictProfileSuccessAction(updateDistrictProfile));
  } catch (err) {
    const errorMessage = "Update District Profile is failing";
    yield call(message.error, errorMessage);
    yield put(updateDistrictProfileErrorAction({ error: errorMessage }));
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_DISTRICT_PROFILE_REQUEST, receiveDistrictProfileSaga)]);
  yield all([yield takeEvery(UPDATE_DISTRICT_PROFILE_REQUEST, updateDictrictProfileSaga)]);
}
