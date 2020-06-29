import { takeLatest, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { isEmpty } from "lodash";
import { reportsApi } from "@edulastic/api";
import { notification } from "@edulastic/common";
import { createAction, createReducer } from "redux-starter-kit";

import { RESET_ALL_REPORTS } from "../../../common/reportsRedux";

const GET_REPORTS_RESPONSE_FREQUENCY_REQUEST = "[reports] get reports response frequency request";
const GET_REPORTS_RESPONSE_FREQUENCY_REQUEST_SUCCESS = "[reports] get reports response frequency request success";
const GET_REPORTS_RESPONSE_FREQUENCY_REQUEST_ERROR = "[reports] get reports response frequency request error";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getResponseFrequencyRequestAction = createAction(GET_REPORTS_RESPONSE_FREQUENCY_REQUEST);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportReducer.reportResponseFrequencyReducer;

export const getReportsResponseFrequency = createSelector(
  stateSelector,
  state => state.responseFrequency
);

export const getReportsResponseFrequencyLoader = createSelector(
  stateSelector,
  state => state.loading
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

export const defaultReport = {
  metricInfo: []
};

const initialState = {
  responseFrequency: defaultReport,
  loading: false
};

export const reportResponseFrequencyReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state, { payload }) => (state = initialState),
  [GET_REPORTS_RESPONSE_FREQUENCY_REQUEST]: (state, { payload }) => {
    state.loading = true;
  },
  [GET_REPORTS_RESPONSE_FREQUENCY_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.responseFrequency = payload.responseFrequency;
  },
  [GET_REPORTS_RESPONSE_FREQUENCY_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  }
});

// -----|-----|-----|-----| REDUCER ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsResponseFrequencyRequest({ payload }) {
  try {
    payload.requestFilters.classIds =
      payload.requestFilters?.classIds?.join(",") || payload.requestFilters?.classId || "";
    payload.requestFilters.groupIds =
      payload.requestFilters?.groupIds?.join(",") || payload.requestFilters?.groupId || "";
    const {
      data: { result }
    } = yield call(reportsApi.fetchResponseFrequency, payload);
    const responseFrequency = isEmpty(result) ? defaultReport : result;

    yield put({
      type: GET_REPORTS_RESPONSE_FREQUENCY_REQUEST_SUCCESS,
      payload: { responseFrequency }
    });
  } catch (error) {
    const msg = "Failed to fetch response frequency Please try again...";
    notification({ msg });
    yield put({
      type: GET_REPORTS_RESPONSE_FREQUENCY_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

export function* reportResponseFrequencySaga() {
  yield all([yield takeLatest(GET_REPORTS_RESPONSE_FREQUENCY_REQUEST, getReportsResponseFrequencyRequest)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
