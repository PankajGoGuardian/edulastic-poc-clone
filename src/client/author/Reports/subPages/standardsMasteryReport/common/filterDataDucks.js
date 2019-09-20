import { takeEvery, takeLatest, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";

import { RESET_ALL_REPORTS } from "../../../ducks";

const GET_REPORTS_STANDARDS_BROWSESTANDARDS_REQUEST = "[reports] get reports standards browse standards request";
const GET_REPORTS_STANDARDS_BROWSESTANDARDS_REQUEST_SUCCESS =
  "[reports] get reports standards browse standards success";
const GET_REPORTS_STANDARDS_BROWSESTANDARDS_REQUEST_ERROR = "[reports] get reports standards browse standards error";
const SET_REPORTS_PREV_STANDARDS_BROWSESTANDARDS = "[reports] get reports prev standards browse standards";

const GET_REPORTS_STANDARDS_FILTERS_REQUEST = "[reports] get reports standards filters request";
const GET_REPORTS_STANDARDS_FILTERS_REQUEST_SUCCESS = "[reports] get reports standards filters success";
const GET_REPORTS_STANDARDS_FILTERS_REQUEST_ERROR = "[reports] get reports standards filters error";
const SET_REPORTS_PREV_STANDARDS_FILTERS = "[reports] get reports prev standards filters";

const SET_FILTERS = "[reports] set standards filters";
const SET_TEST_ID = "[reports] set standards testId";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

// export const getStandardsProcessRequestsAction = createAction(GET_REPORTS_STANDARDS_PROCESS_REQUESTS);
export const getStandardsBrowseStandardsRequestAction = createAction(GET_REPORTS_STANDARDS_BROWSESTANDARDS_REQUEST);
export const getStandardsFiltersRequestAction = createAction(GET_REPORTS_STANDARDS_FILTERS_REQUEST);
export const setPrevBrowseStandardsAction = createAction(SET_REPORTS_PREV_STANDARDS_BROWSESTANDARDS);
export const setPrevStandardsFiltersAction = createAction(SET_REPORTS_PREV_STANDARDS_FILTERS);

export const setFiltersAction = createAction(SET_FILTERS);
export const setTestIdAction = createAction(SET_TEST_ID);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportStandardsFilterDataReducer;

export const getReportsStandardsBrowseStandards = createSelector(
  stateSelector,
  state => state.browseStandards
);

export const getReportsStandardsFilters = createSelector(
  stateSelector,
  state => state.standardsFilters
);

export const getFiltersSelector = createSelector(
  stateSelector,
  state => state.filters
);

export const getTestIdSelector = createSelector(
  stateSelector,
  state => state.testId
);

export const getPrevBrowseStandardsSelector = createSelector(
  stateSelector,
  state => state.prevBrowseStandards
);

export const getPrevStandardsFiltersSelector = createSelector(
  stateSelector,
  state => state.prevStandardsFilters
);

export const getSelectedStandardProficiency = createSelector(
  getFiltersSelector,
  getReportsStandardsFilters,
  (filters, filtersData) => {
    const scales = filtersData?.data?.result?.scaleInfo || [];
    return (scales.find(s => s._id === filters.profileId) || scales[0])?.scale;
  }
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  browseStandards: {},
  standardsFilters: {},
  prevBrowseStandards: null,
  prevStandardsFilters: null,
  filters: {
    termId: "",
    subject: "All",
    grades: ["K"],
    domainIds: ["All"],
    profileId: ""
  },
  testId: ""
};

const setFiltersReducer = (state, { payload }) => {
  state.filters = { ...payload };
};

const setTestIdReducer = (state, { payload }) => {
  state.testId = payload;
};

export const reportStandardsFilterDataReducer = createReducer(initialState, {
  [GET_REPORTS_STANDARDS_BROWSESTANDARDS_REQUEST]: (state, { payload }) => {
    state.loading = true;
  },
  [GET_REPORTS_STANDARDS_BROWSESTANDARDS_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.browseStandards = payload.browseStandards;
  },
  [GET_REPORTS_STANDARDS_BROWSESTANDARDS_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },

  [GET_REPORTS_STANDARDS_FILTERS_REQUEST]: (state, { payload }) => {
    state.loading = true;
  },
  [GET_REPORTS_STANDARDS_FILTERS_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.standardsFilters = payload.standardsFilters;
  },
  [GET_REPORTS_STANDARDS_FILTERS_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },
  [SET_FILTERS]: setFiltersReducer,
  [SET_TEST_ID]: setTestIdReducer,
  [RESET_ALL_REPORTS]: (state, { payload }) => (state = initialState),
  [SET_REPORTS_PREV_STANDARDS_BROWSESTANDARDS]: (state, { payload }) => {
    state.prevBrowseStandards = payload;
  },
  [SET_REPORTS_PREV_STANDARDS_FILTERS]: (state, { payload }) => {
    state.prevStandardsFilters = payload;
  }
});

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsStandardsBrowseStandardsRequest({ payload }) {
  try {
    const browseStandards = yield call(reportsApi.fetchStandardMasteryBrowseStandards, payload);
    yield put({
      type: GET_REPORTS_STANDARDS_BROWSESTANDARDS_REQUEST_SUCCESS,
      payload: { browseStandards }
    });
  } catch (error) {
    console.log("err", error.stack);
    let msg = "Failed to fetch standards Please try again...";
    yield call(message.error, msg);
    yield put({
      type: GET_REPORTS_STANDARDS_BROWSESTANDARDS_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

function* getReportsStandardsFiltersRequest({ payload }) {
  try {
    const standardsFilters = yield call(reportsApi.fetchStandardMasteryFilter, payload);
    yield put({
      type: GET_REPORTS_STANDARDS_FILTERS_REQUEST_SUCCESS,
      payload: { standardsFilters }
    });
  } catch (error) {
    console.log("err", error.stack);
    let msg = "Failed to fetch standards Please try again...";
    yield call(message.error, msg);
    yield put({
      type: GET_REPORTS_STANDARDS_FILTERS_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

export function* reportStandardsFilterSaga() {
  yield all([
    yield takeEvery(GET_REPORTS_STANDARDS_BROWSESTANDARDS_REQUEST, getReportsStandardsBrowseStandardsRequest),
    yield takeEvery(GET_REPORTS_STANDARDS_FILTERS_REQUEST, getReportsStandardsFiltersRequest)
  ]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
