import { takeEvery, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";

const GET_REPORTS_SAR_FILTER_DATA_REQUEST = "[reports] get reports sar filter data request";
const GET_REPORTS_SAR_FILTER_DATA_REQUEST_SUCCESS = "[reports] get reports sar filter data request success";
const GET_REPORTS_SAR_FILTER_DATA_REQUEST_ERROR = "[reports] get reports sar filter data request error";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getSARFilterDataRequestAction = createAction(GET_REPORTS_SAR_FILTER_DATA_REQUEST);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportSARFilterDataReducer;

export const getReportsSARFilterData = createSelector(
  stateSelector,
  state => state.SARFilterData
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  SARFilterData: {}
};

export const reportSARFilterDataReducer = createReducer(initialState, {
  [GET_REPORTS_SAR_FILTER_DATA_REQUEST]: (state, { payload }) => {
    state.loading = true;
  },
  [GET_REPORTS_SAR_FILTER_DATA_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.SARFilterData = payload.SARFilterData;
  },
  [GET_REPORTS_SAR_FILTER_DATA_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  }
});

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsSARFilterDataRequest({ payload }) {
  try {
    const SARFilterData = yield call(reportsApi.fetchSARFilterData, payload);

    yield put({
      type: GET_REPORTS_SAR_FILTER_DATA_REQUEST_SUCCESS,
      payload: { SARFilterData }
    });
  } catch (error) {
    let msg = "Failed to fetch filter data Please try again...";
    yield call(message.error, msg);
    yield put({
      type: GET_REPORTS_SAR_FILTER_DATA_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

export function* reportSARFilterDataSaga() {
  yield all([yield takeEvery(GET_REPORTS_SAR_FILTER_DATA_REQUEST, getReportsSARFilterDataRequest)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
