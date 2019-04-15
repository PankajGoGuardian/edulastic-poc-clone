import { createAction, createReducer } from "redux-starter-kit";
import { createSelector } from "reselect";
import { takeEvery, call, put, all } from "redux-saga/effects";
import { countryApi } from "@edulastic/api";
import { message } from "antd";

export const RECEIVE_COUNTRY_RESPONSE_REQUEST = "[country] data receive request";
export const RECEIVE_COUNTRY_RESPONSE_SUCCESS = "[country] data receive success";
export const RECEIVE_COUNTRY_RESPONSE_ERROR = "[country] data receive error";

export const receiveCountryListAction = createAction(RECEIVE_COUNTRY_RESPONSE_REQUEST);
export const receiveCountryListSuccessAction = createAction(RECEIVE_COUNTRY_RESPONSE_SUCCESS);
export const receiveCountryListErrorAction = createAction(RECEIVE_COUNTRY_RESPONSE_ERROR);

//selectors
const stateCountrySelector = state => state.countryReducer;
export const getCountryListSelector = createSelector(
  stateCountrySelector,
  state => state.data
);

// reducers
const initialState = {
  data: {},
  error: null,
  loading: false
};

const receiveCountryListRequest = state => ({
  ...state,
  loading: true
});

const receiveCountryListSuccess = (state, { payload }) => ({
  ...state,
  loading: false,
  data: payload
});

const receiveCountryListError = (state, { payload }) => ({
  ...state,
  loading: false,
  error: payload.error
});

export const countryReducer = createReducer(initialState, {
  [RECEIVE_COUNTRY_RESPONSE_REQUEST]: receiveCountryListRequest,
  [RECEIVE_COUNTRY_RESPONSE_SUCCESS]: receiveCountryListSuccess,
  [RECEIVE_COUNTRY_RESPONSE_ERROR]: receiveCountryListError
});

// sagas
function* receiveCountryListSaga() {
  try {
    const countryList = yield call(countryApi.getCountries);
    yield put(receiveCountryListSuccessAction(countryList));
  } catch (err) {
    const errorMessage = "Receive Schools is failing";
    yield call(message.error, errorMessage);
    yield put(receiveCountryListErrorAction({ error: errorMessage }));
  }
}

export function* countryWatcherSaga() {
  yield all([yield takeEvery(RECEIVE_COUNTRY_RESPONSE_REQUEST, receiveCountryListSaga)]);
}
