import { takeEvery, call, put, all, select } from "redux-saga/effects";
import { settingsApi } from "@edulastic/api";
import { createSelector } from "reselect";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";
import { getUserOrgId } from "../src/selectors/user";
import { get, omit } from "lodash";

const RECEIVE_PERFORMANCE_BAND_REQUEST = "[Performance Band] receive data request";
const RECEIVE_PERFORMANCE_BAND_SUCCESS = "[Performance Band] receive data success";
const RECEIVE_PERFORMANCE_BAND_ERROR = "[Performance Band] receive data error";
const UPDATE_PERFORMANCE_BAND_REQUEST = "[Performance Band] update data request";
const UPDATE_PERFORMANCE_BAND_SUCCESS = "[Performance Band] update data success";
const UPDATE_PERFORMANCE_BAND_ERROR = "[Performance Band] update data error";
const CREATE_PERFORMANCE_BAND_REQUEST = "[Performance Band] create data request";
const CREATE_PERFORMANCE_BAND_SUCCESS = "[Performance Band] create data success";
const CREATE_PERFORMANCE_BAND_ERROR = "[Performance Band] create data error";
const SET_LOADING = "[Performance Band] set loading";
const DELETE_PERFORMANCE_BAND_REQUEST = "[Performance Band] delete request";
const SET_PERFORMANCE_BAND_NAME = "[Performance Band] set name";
const SET_PERFORMANCE_BAND_EDITING_INDEX = "[Performance Band] set editing index";

const SET_PERFORMANCE_BAND_CHANGES = "[Performance Band] set data changes";
const SET_PERFORMANCE_BAND_DATA_LOCAL = "[Performance Band] set data local";

export const setPerformanceBandLocalAction = createAction(SET_PERFORMANCE_BAND_DATA_LOCAL);
export const receivePerformanceBandAction = createAction(RECEIVE_PERFORMANCE_BAND_REQUEST);
export const receivePerformanceBandSuccessAction = createAction(RECEIVE_PERFORMANCE_BAND_SUCCESS);
export const receivePerformanceBandErrorAction = createAction(RECEIVE_PERFORMANCE_BAND_ERROR);
export const updatePerformanceBandAction = createAction(UPDATE_PERFORMANCE_BAND_REQUEST);
export const updatePerformanceBandSuccessAction = createAction(UPDATE_PERFORMANCE_BAND_SUCCESS);
export const updatePerformanceBandErrorAction = createAction(UPDATE_PERFORMANCE_BAND_ERROR);
export const createPerformanceBandAction = createAction(CREATE_PERFORMANCE_BAND_REQUEST);
export const createPerformanceBandSuccessAction = createAction(CREATE_PERFORMANCE_BAND_SUCCESS);
export const createPerformanceBandErrorAction = createAction(CREATE_PERFORMANCE_BAND_ERROR);

export const setPerformanceBandChangesAction = createAction(SET_PERFORMANCE_BAND_CHANGES);
export const setEditingIndexAction = createAction(SET_PERFORMANCE_BAND_EDITING_INDEX);

const setLoadingAction = createAction(SET_LOADING);
export const deletePerformanceBandAction = createAction(DELETE_PERFORMANCE_BAND_REQUEST);
export const setPerformanceBandNameAction = createAction(SET_PERFORMANCE_BAND_NAME);

const statePerformanceBandSelector = state => state.performanceBandReducer;
export const getPerformanceBandList = createSelector(
  statePerformanceBandSelector,
  state => {
    if (state.data == null) {
      return [
        { name: "Proficient", aboveOrAtStandard: true, from: 100, to: 70, key: 0 },
        { name: "Basic", aboveOrAtStandard: true, from: 70, to: 50, key: 1 },
        { name: "Below Basic", aboveOrAtStandard: true, from: 50, to: 0, key: 2 }
      ];
    } else if (state.data.hasOwnProperty("performanceBand")) {
      return state.data.performanceBand;
    } else {
      return [];
    }
  }
);

// reducers
const initialState = {
  data: {},
  profiles: [],
  error: null,
  loading: false,
  updating: false,
  updateError: null,
  creating: false,
  createError: null,
  editingIndex: undefined
};

export const reducer = createReducer(initialState, {
  [RECEIVE_PERFORMANCE_BAND_REQUEST]: state => {
    state.loading = true;
  },
  [SET_LOADING]: (state, { payload }) => {
    state.loading = payload;
  },
  [RECEIVE_PERFORMANCE_BAND_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    if (payload != null && payload.length >= 0) {
      payload = payload.map(profile => ({
        ...profile,
        performanceBand: profile.performanceBand.map((row, index) => ({ ...row, key: index }))
      }));
    }
    state.profiles = payload;
  },
  [RECEIVE_PERFORMANCE_BAND_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },
  [UPDATE_PERFORMANCE_BAND_REQUEST]: state => {
    state.updating = true;
  },
  [UPDATE_PERFORMANCE_BAND_SUCCESS]: (state, { payload }) => {
    state.updating = false;
  },
  [UPDATE_PERFORMANCE_BAND_ERROR]: (state, { payload }) => {
    state.updating = false;
    state.updateError = payload.error;
  },
  [CREATE_PERFORMANCE_BAND_REQUEST]: state => {
    state.creating = true;
  },
  [CREATE_PERFORMANCE_BAND_SUCCESS]: (state, { payload }) => {
    state.creating = false;
    payload.performanceBand.map((row, index) => {
      row.key = index;
    });
    state.data = payload;
  },
  [CREATE_PERFORMANCE_BAND_ERROR]: (state, { payload }) => {
    state.creating = false;
    state.createError = payload.error;
  },
  [SET_PERFORMANCE_BAND_CHANGES]: (state, { payload }) => {
    const performanceData = { ...state.data };
    performanceData.performanceBand = [...payload];
    state.data = { ...performanceData };
  },
  [SET_PERFORMANCE_BAND_DATA_LOCAL]: (state, { payload }) => {
    const { _id, data } = payload;
    const ind = state.profiles.findIndex(x => x._id === _id);
    state.profiles[ind].performanceBand = data;
  },
  [SET_PERFORMANCE_BAND_NAME]: (state, { payload }) => {
    const { _id, name } = payload;
    const ind = state.profiles.findIndex(x => x._id === _id);
    if (ind > -1) {
      state.profiles[ind].name = name;
    }
  },
  [SET_PERFORMANCE_BAND_EDITING_INDEX]: (state, { payload }) => {
    const oldIndex = state.editingIndex;
    state.editingIndex = oldIndex != payload ? payload : undefined;
  }
});

// sagas
function* receivePerformanceBandSaga({ payload }) {
  const defaultOrgId = yield select(getUserOrgId);
  payload = payload || { orgId: defaultOrgId };
  try {
    const performanceBand = yield call(settingsApi.getPerformanceBand, payload);
    performanceBand.sort((el1, el2) => (el1._id > el2._id ? -1 : 1));
    yield put(receivePerformanceBandSuccessAction(performanceBand));
  } catch (err) {
    const errorMessage = "Receive PerformanceBand is failing";
    yield call(message.error, errorMessage);
    yield put(receivePerformanceBandErrorAction({ error: errorMessage }));
  }
}

function* updatePerformanceBandSaga({ payload: _id }) {
  try {
    const profile = yield select(state => get(state, "performanceBandReducer.profiles", []).find(x => x._id === _id));
    const data = {
      ...omit(profile, ["institutionIds", "createdBy", "createdAt", "updatedAt", "__v"]),
      performanceBand: profile.performanceBand.map(({ key, ...band }) => band)
    };
    // if (!payload) {
    //   console.warn("no profiles with such _id", _id);
    //   return;
    // }
    const updatePerformanceBand = yield call(settingsApi.updatePerformanceBand, data);
    yield put(updatePerformanceBandSuccessAction(updatePerformanceBand));
    //yield put(receivePerformanceBandAction());
  } catch (err) {
    console.error(err);
    const errorMessage = "Update PerformanceBand is failing";
    yield call(message.error, errorMessage);
    yield put(updatePerformanceBandErrorAction({ error: errorMessage }));
  }
}

function* createPerformanceBandSaga({ payload }) {
  try {
    const createPerformanceBand = yield call(settingsApi.createPerformanceBand, payload);
    yield put(createPerformanceBandSuccessAction(createPerformanceBand));
    yield put(receivePerformanceBandAction());
    yield put(setEditingIndexAction(createPerformanceBand._id));
  } catch (err) {
    const errorMessage = "Create PerformanceBand is failing";
    yield call(message.error, errorMessage);
    yield put(createPerformanceBandErrorAction({ error: errorMessage }));
  }
}

function* deletePerformanceBandSaga({ payload }) {
  yield put(setLoadingAction(true));
  const districtId = yield select(getUserOrgId);
  try {
    const createPerformanceBand = yield call(settingsApi.deletePerformanceBand, payload, districtId);
    yield put(setLoadingAction(false));
    yield put(receivePerformanceBandAction());
  } catch (err) {
    const errorMessage = "deleting PerformanceBand is failing";
    yield call(message.error, errorMessage);
    yield put(createPerformanceBandErrorAction({ error: errorMessage }));
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_PERFORMANCE_BAND_REQUEST, receivePerformanceBandSaga)]);
  yield all([yield takeEvery(UPDATE_PERFORMANCE_BAND_REQUEST, updatePerformanceBandSaga)]);
  yield all([yield takeEvery(CREATE_PERFORMANCE_BAND_REQUEST, createPerformanceBandSaga)]);
  yield all([yield takeEvery(DELETE_PERFORMANCE_BAND_REQUEST, deletePerformanceBandSaga)]);
}
