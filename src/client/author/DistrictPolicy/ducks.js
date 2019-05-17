import { createAction, createReducer } from "redux-starter-kit";
import { createSelector } from "reselect";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { settingsApi } from "@edulastic/api";
import { message } from "antd";

// action types
const RECEIVE_DISTRICT_POLICY_REQUEST = "[district policy] receive data request";
const RECEIVE_DISTRICT_POLICY_SUCCESS = "[district policy] receive data success";
const RECEIVE_DISTRICT_POLICY_ERROR = "[district policy] receive data error";
const UPDATE_DISTRICT_POLICY_REQUEST = "[district policy] update data request";
const UPDATE_DISTRICT_POLICY_SUCCESS = "[district policy] update data success";
const UPDATE_DISTRICT_POLICY_ERROR = "[district policy] update data error";
const CREATE_DISTRICT_POLICY_REQUEST = "[district policy] create data request";
const CREATE_DISTRICT_POLICY_SUCCESS = "[district policy] create data success";
const CREATE_DISTRICT_POLICY_ERROR = "[district policy] create data error";

const CHANGE_DISTRICT_POLICY_ACTION = "[district policy] save changed data";

export const receiveDistrictPolicyAction = createAction(RECEIVE_DISTRICT_POLICY_REQUEST);
export const receiveDistrictPolicySuccessAction = createAction(RECEIVE_DISTRICT_POLICY_SUCCESS);
export const receiveDistrictPolicyErrorAction = createAction(RECEIVE_DISTRICT_POLICY_ERROR);
export const updateDistrictPolicyAction = createAction(UPDATE_DISTRICT_POLICY_REQUEST);
export const updateDistrictPolicySuccessAction = createAction(UPDATE_DISTRICT_POLICY_SUCCESS);
export const updateDistrictPolicyErrorAction = createAction(UPDATE_DISTRICT_POLICY_ERROR);
export const createDistrictPolicyAction = createAction(CREATE_DISTRICT_POLICY_REQUEST);
export const createDistrictPolicySuccessAction = createAction(CREATE_DISTRICT_POLICY_SUCCESS);
export const createDistrictPolicyErrorAction = createAction(CREATE_DISTRICT_POLICY_ERROR);

export const changeDistrictPolicyAction = createAction(CHANGE_DISTRICT_POLICY_ACTION);

// reducers
const initialState = {
  data: {},
  error: null,
  loading: false,
  updating: false,
  update: null,
  updateError: null,
  creating: false,
  createError: null
};

export const reducer = createReducer(initialState, {
  [RECEIVE_DISTRICT_POLICY_REQUEST]: state => {
    state.loading = true;
  },
  [RECEIVE_DISTRICT_POLICY_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.data = payload;
  },
  [RECEIVE_DISTRICT_POLICY_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },
  [UPDATE_DISTRICT_POLICY_REQUEST]: state => {
    state.updating = true;
  },
  [UPDATE_DISTRICT_POLICY_SUCCESS]: (state, { payload }) => {
    state.updating = false;
    state.data = payload;
  },
  [UPDATE_DISTRICT_POLICY_ERROR]: (state, { payload }) => {
    state.updating = false;
    state.updateError = payload.error;
  },
  [CREATE_DISTRICT_POLICY_REQUEST]: state => {
    state.creating = true;
  },
  [CREATE_DISTRICT_POLICY_SUCCESS]: (state, { payload }) => {
    state.creating = false;
    state.data = payload;
  },
  [CREATE_DISTRICT_POLICY_ERROR]: (state, { payload }) => {
    state.creating = false;
    state.createError = payload.error;
  },
  [CHANGE_DISTRICT_POLICY_ACTION]: (state, { payload }) => {
    state.data = { ...payload };
  }
});

// saga
function* receiveDistrictPolicySaga({ payload }) {
  try {
    const districtPolicy = yield call(settingsApi.getDistrictPolicy, payload);
    yield put(receiveDistrictPolicySuccessAction(districtPolicy));
  } catch (err) {
    const errorMessage = "Receive District Policy is failing";
    yield call(message.error, errorMessage);
    yield put(receiveDistrictPolicyErrorAction({ error: errorMessage }));
  }
}

function* updateDictrictPolicySaga({ payload }) {
  try {
    const updateDistrictPolicy = yield call(settingsApi.updateDistrictPolicy, payload);
    yield put(updateDistrictPolicySuccessAction(updateDistrictPolicy));
  } catch (err) {
    const errorMessage = "Update District Policy is failing";
    yield call(message.error, errorMessage);
    yield put(updateDistrictPolicyErrorAction({ error: errorMessage }));
  }
}

function* createDictrictPolicySaga({ payload }) {
  try {
    const createDistrictPolicy = yield call(settingsApi.createDistrictPolicy, payload);
    yield put(createDistrictPolicySuccessAction(createDistrictPolicy));
  } catch (err) {
    const errorMessage = "Create District Policy is failing";
    yield call(message.error, errorMessage);
    yield put(createDistrictPolicyErrorAction({ error: errorMessage }));
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_DISTRICT_POLICY_REQUEST, receiveDistrictPolicySaga)]);
  yield all([yield takeEvery(UPDATE_DISTRICT_POLICY_REQUEST, updateDictrictPolicySaga)]);
  yield all([yield takeEvery(CREATE_DISTRICT_POLICY_REQUEST, createDictrictPolicySaga)]);
}
