import { takeEvery, call, put, all } from "redux-saga/effects";
import { settingsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";

const RECEIVE_PERFORMANCE_BAND_REQUEST = "[Performance Band] receive data request";
const RECEIVE_PERFORMANCE_BAND_SUCCESS = "[Performance Band] receive data success";
const RECEIVE_PERFORMANCE_BAND_ERROR = "[Performance Band] receive data error";
const UPDATE_PERFORMANCE_BAND_REQUEST = "[Performance Band] update data request";
const UPDATE_PERFORMANCE_BAND_SUCCESS = "[Performance Band] update data success";
const UPDATE_PERFORMANCE_BAND_ERROR = "[Performance Band] update data error";

export const receivePerformanceBandAction = createAction(RECEIVE_PERFORMANCE_BAND_REQUEST);
export const receivePerformanceBandSuccessAction = createAction(RECEIVE_PERFORMANCE_BAND_SUCCESS);
export const receivePerformanceBandErrorAction = createAction(RECEIVE_PERFORMANCE_BAND_ERROR);
export const updatePerformanceBandAction = createAction(UPDATE_PERFORMANCE_BAND_REQUEST);
export const updatePerformanceBandSuccessAction = createAction(UPDATE_PERFORMANCE_BAND_SUCCESS);
export const updatePerformanceBandErrorAction = createAction(UPDATE_PERFORMANCE_BAND_ERROR);

// reducers
const initialState = {
  data: {},
  error: null,
  loading: false,
  updating: false,
  updateError: null
};

export const reducer = createReducer(initialState, {
  [RECEIVE_PERFORMANCE_BAND_REQUEST]: state => {
    state.loading = true;
  },
  [RECEIVE_PERFORMANCE_BAND_SUCCESS]: (state, { payload }) => {
    state.loading = false;
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
    state.data = payload;
    state.updating = false;
  },
  [UPDATE_PERFORMANCE_BAND_ERROR]: (state, { payload }) => {
    state.updating = false;
    state.updateError = payload.error;
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
    const successMessage = "PerformanceBand Saved Successfully!";
    yield call(message.success, successMessage);
    yield put(updatePerformanceBandSuccessAction(updatePerformanceBand));
  } catch (err) {
    const errorMessage = "Update PerformanceBand is failing";
    yield call(message.error, errorMessage);
    yield put(updatePerformanceBandErrorAction({ error: errorMessage }));
  }
}

export function* watcherSaga() {
  yield all([yield takeEvery(RECEIVE_PERFORMANCE_BAND_REQUEST, receivePerformanceBandSaga)]);
  yield all([yield takeEvery(UPDATE_PERFORMANCE_BAND_REQUEST, updatePerformanceBandSaga)]);
}
