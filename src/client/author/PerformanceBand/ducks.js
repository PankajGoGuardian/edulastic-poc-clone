import { takeEvery, call, put, all } from "redux-saga/effects";
import { settingsApi } from "@edulastic/api";
import { createSelector } from "reselect";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";

const RECEIVE_PERFORMANCE_BAND_REQUEST = "[Performance Band] receive data request";
const RECEIVE_PERFORMANCE_BAND_SUCCESS = "[Performance Band] receive data success";
const RECEIVE_PERFORMANCE_BAND_ERROR = "[Performance Band] receive data error";
const UPDATE_PERFORMANCE_BAND_REQUEST = "[Performance Band] update data request";
const UPDATE_PERFORMANCE_BAND_SUCCESS = "[Performance Band] update data success";
const UPDATE_PERFORMANCE_BAND_ERROR = "[Performance Band] update data error";
const CREATE_PERFORMANCE_BAND_REQUEST = "[Performance Band] create data request";
const CREATE_PERFORMANCE_BAND_SUCCESS = "[Performance Band] create data success";
const CREATE_PERFORMANCE_BAND_ERROR = "[Performance Band] create data error";

const SET_PERFORMANCE_BAND_CHANGES = "[Performance Band] set data changes";

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
  error: null,
  loading: false,
  updating: false,
  updateError: null,
  creating: false,
  createError: null
};

export const reducer = createReducer(initialState, {
  [RECEIVE_PERFORMANCE_BAND_REQUEST]: state => {
    state.loading = true;
  },
  [RECEIVE_PERFORMANCE_BAND_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    if (payload != null && Object.keys(payload).length >= 0) {
      payload.performanceBand.map((row, index) => {
        row.key = index;
      });
    }
    state.data = payload;
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
  }
});

// sagas
function* receivePerformanceBandSaga({ payload }) {
  try {
    const performanceBand = yield call(settingsApi.getPerformanceBand, payload);
    yield put(receivePerformanceBandSuccessAction(performanceBand));
  } catch (err) {
    const errorMessage = "Receive PerformanceBand is failing";
    yield call(message.error, errorMessage);
    yield put(receivePerformanceBandErrorAction({ error: errorMessage }));
  }
}

function* updatePerformanceBandSaga({ payload }) {
  try {
    const updatePerformanceBand = yield call(settingsApi.updatePerformanceBand, payload);
    yield put(updatePerformanceBandSuccessAction(updatePerformanceBand));
  } catch (err) {
    const errorMessage = "Update PerformanceBand is failing";
    yield call(message.error, errorMessage);
    yield put(updatePerformanceBandErrorAction({ error: errorMessage }));
  }
}

function* createPerformanceBandSaga({ payload }) {
  try {
    const createPerformanceBand = yield call(settingsApi.createPerformanceBand, payload);
    yield put(createPerformanceBandSuccessAction(createPerformanceBand));
  } catch (err) {
    const errorMessage = "Create PerformanceBand is failing";
    yield call(message.error, errorMessage);
    yield put(createPerformanceBandErrorAction({ error: errorMessage }));
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_PERFORMANCE_BAND_REQUEST, receivePerformanceBandSaga)]);
  yield all([yield takeEvery(UPDATE_PERFORMANCE_BAND_REQUEST, updatePerformanceBandSaga)]);
  yield all([yield takeEvery(CREATE_PERFORMANCE_BAND_REQUEST, createPerformanceBandSaga)]);
}
