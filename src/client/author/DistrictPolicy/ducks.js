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

export const receiveDistrictPolicyAction = createAction(RECEIVE_DISTRICT_POLICY_REQUEST);
export const receiveDistrictPolicySuccessAction = createAction(RECEIVE_DISTRICT_POLICY_SUCCESS);
export const receiveDistrictPolicyErrorAction = createAction(RECEIVE_DISTRICT_POLICY_ERROR);
export const updateDistrictPolicyAction = createAction(UPDATE_DISTRICT_POLICY_REQUEST);
export const updateDistrictPolicySuccessAction = createAction(UPDATE_DISTRICT_POLICY_SUCCESS);
export const updateDistrictPolicyErrorAction = createAction(UPDATE_DISTRICT_POLICY_ERROR);

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

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_DISTRICT_POLICY_REQUEST, receiveDistrictPolicySaga)]);
  yield all([yield takeEvery(UPDATE_DISTRICT_POLICY_REQUEST, updateDictrictPolicySaga)]);
}
