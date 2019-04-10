import { createSelector } from "reselect";
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

// selectors
const statePerformanceBandSelector = state => state.performanceBandReducer;

export const getPerformanceBandSelector = createSelector(
  statePerformanceBandSelector,
  state => state.data
);

export const getPerformanceBandLoadingSelector = createSelector(
  statePerformanceBandSelector,
  state => state.loading
);

export const getPerformanceBandUpdatingSelector = createSelector(
  statePerformanceBandSelector,
  state => state.updating
);

export const getCreatedPerformanceBandSelector = createSelector(
  statePerformanceBandSelector,
  state => ({ data: state.create })
);

export const getPerformanceBandCreatingSelector = createSelector(
  statePerformanceBandSelector,
  state => state.creating
);

// reducers
const initialState = {
  data: {},
  error: null,
  loading: false,
  updating: false,
  updateError: null
};

const receivePerformanceBandRequest = state => ({
  ...state,
  loading: true
});

const receivePerformanceBandSuccess = (state, { payload }) => ({
  ...state,
  loading: false,
  data: payload
});

const receivePerformanceBandError = (state, { payload }) => ({
  ...state,
  loading: false,
  error: payload.error
});

const updatePerformanceBandRequest = state => ({
  ...state,
  updating: true
});

const updatePerformanceBandSucess = (state, { payload }) => ({
  ...state,
  data: payload,
  updating: false
});

const updatePerformanceBandError = (state, { payload }) => ({
  ...state,
  updating: false,
  updateError: payload.error
});

export const reducer = createReducer(initialState, {
  [RECEIVE_PERFORMANCE_BAND_REQUEST]: receivePerformanceBandRequest,
  [RECEIVE_PERFORMANCE_BAND_SUCCESS]: receivePerformanceBandSuccess,
  [RECEIVE_PERFORMANCE_BAND_ERROR]: receivePerformanceBandError,
  [UPDATE_PERFORMANCE_BAND_REQUEST]: updatePerformanceBandRequest,
  [UPDATE_PERFORMANCE_BAND_SUCCESS]: updatePerformanceBandSucess,
  [UPDATE_PERFORMANCE_BAND_ERROR]: updatePerformanceBandError
});

// sagas
function* receivePerformanceBandSaga({ payload }) {
  try {
    const performanceBand = yield call(settingsApi.getPerformanceBand, payload);
    yield put(receivePerformanceBandSuccessAction(performanceBand));
  } catch (err) {
    const errorMessage = "Receive PerformanceBand is failing";
    yield call(message.error, errorMessage);
    yield put(receivePerformanceBandError({ error: errorMessage }));
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
