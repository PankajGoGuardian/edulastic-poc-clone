import { takeEvery, takeLatest, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";
import data1 from "./static/json/data1";
import data2 from "./static/json/data2";

const GET_REPORTS_STANDARDS_GRADEBOOK_BROWSESTANDARDS_REQUEST =
  "[reports] get reports standards gradebook browse standards request";
const GET_REPORTS_STANDARDS_GRADEBOOK_BROWSESTANDARDS_REQUEST_SUCCESS =
  "[reports] get reports standards gradebook browse standards success";
const GET_REPORTS_STANDARDS_GRADEBOOK_BROWSESTANDARDS_REQUEST_ERROR =
  "[reports] get reports standards gradebook browse standards error";

const GET_REPORTS_STANDARDS_GRADEBOOK_REQUEST = "[reports] get reports standards gradebook request";
const GET_REPORTS_STANDARDS_GRADEBOOK_REQUEST_SUCCESS = "[reports] get reports standards gradebook success";
const GET_REPORTS_STANDARDS_GRADEBOOK_REQUEST_ERROR = "[reports] get reports standards gradebook error";

const GET_REPORTS_STANDARDS_GRADEBOOK_FILTERS_REQUEST = "[reports] get reports standards gradebook filters request";
const GET_REPORTS_STANDARDS_GRADEBOOK_FILTERS_REQUEST_SUCCESS =
  "[reports] get reports standards gradebook filters success";
const GET_REPORTS_STANDARDS_GRADEBOOK_FILTERS_REQUEST_ERROR = "[reports] get reports standards gradebook filters error";

const SET_FILTERS = "[reports] set standards gradebook filters";
const SET_TEST_ID = "[reports] set standards gradebook testId";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

// export const getStandardsGradebookProcessRequestsAction = createAction(GET_REPORTS_STANDARDS_GRADEBOOK_PROCESS_REQUESTS);
export const getStandardsGradebookBrowseStandardsRequestAction = createAction(
  GET_REPORTS_STANDARDS_GRADEBOOK_BROWSESTANDARDS_REQUEST
);
export const getStandardsGradebookRequestAction = createAction(GET_REPORTS_STANDARDS_GRADEBOOK_REQUEST);
export const getStandardsGradebookFiltersRequestAction = createAction(GET_REPORTS_STANDARDS_GRADEBOOK_FILTERS_REQUEST);

export const setFiltersAction = createAction(SET_FILTERS);
export const setTestIdAction = createAction(SET_TEST_ID);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportStandardsGradebookReducer;

export const getReportsStandardsGradebookBrowseStandards = createSelector(
  stateSelector,
  state => state.browseStandards
);

export const getReportsStandardsGradebook = createSelector(
  stateSelector,
  state => state.standardsGradebook
);

export const getReportsStandardsGradebookFilters = createSelector(
  stateSelector,
  state => state.standardsGradebookFilters
);

export const getReportsStandardsGradebookLoader = createSelector(
  stateSelector,
  state => state.loading
);

export const getFiltersSelector = createSelector(
  stateSelector,
  state => state.filters
);

export const getTestIdSelector = createSelector(
  stateSelector,
  state => state.testId
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  loader: true,
  browseStandards: {},
  standardsGradebook: {},
  standardsGradebookFilters: {},
  filters: {
    termId: "",
    subject: "All",
    grades: ["K"],
    domainIds: ["All"]
    // classSectionId: "All",
    // assessmentType: "All"
  },
  testId: ""
};

const setFiltersReducer = (state, { payload }) => {
  state.filters = { ...payload };
};

const setTestIdReducer = (state, { payload }) => {
  state.testId = payload;
};

export const reportStandardsGradebookReducer = createReducer(initialState, {
  [GET_REPORTS_STANDARDS_GRADEBOOK_BROWSESTANDARDS_REQUEST]: (state, { payload }) => {
    state.loading = true;
  },
  [GET_REPORTS_STANDARDS_GRADEBOOK_BROWSESTANDARDS_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.browseStandards = payload.browseStandards;
  },
  [GET_REPORTS_STANDARDS_GRADEBOOK_BROWSESTANDARDS_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },

  [GET_REPORTS_STANDARDS_GRADEBOOK_REQUEST]: (state, { payload }) => {
    state.loading = true;
  },
  [GET_REPORTS_STANDARDS_GRADEBOOK_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.standardsGradebook = payload.standardsGradebook;
  },
  [GET_REPORTS_STANDARDS_GRADEBOOK_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },

  [GET_REPORTS_STANDARDS_GRADEBOOK_FILTERS_REQUEST]: (state, { payload }) => {
    state.loading = true;
  },
  [GET_REPORTS_STANDARDS_GRADEBOOK_FILTERS_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.standardsGradebookFilters = payload.standardsGradebookFilters;
  },
  [GET_REPORTS_STANDARDS_GRADEBOOK_FILTERS_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },
  [SET_FILTERS]: setFiltersReducer,
  [SET_TEST_ID]: setTestIdReducer
});

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsStandardsGradebookBrowseStandardsRequest({ payload }) {
  try {
    const browseStandards = yield call(reportsApi.fetchStandardMasteryBrowseStandards, payload);
    yield put({
      type: GET_REPORTS_STANDARDS_GRADEBOOK_BROWSESTANDARDS_REQUEST_SUCCESS,
      payload: { browseStandards }
    });
  } catch (error) {
    console.log("err", error.stack);
    let msg = "Failed to fetch standards gradebook Please try again...";
    yield call(message.error, msg);
    yield put({
      type: GET_REPORTS_STANDARDS_GRADEBOOK_BROWSESTANDARDS_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

function* getReportsStandardsGradebookFiltersRequest({ payload }) {
  try {
    const standardsGradebookFilters = yield call(reportsApi.fetchStandardMasteryFilter, payload);
    yield put({
      type: GET_REPORTS_STANDARDS_GRADEBOOK_FILTERS_REQUEST_SUCCESS,
      payload: { standardsGradebookFilters }
    });
  } catch (error) {
    console.log("err", error.stack);
    let msg = "Failed to fetch standards gradebook Please try again...";
    yield call(message.error, msg);
    yield put({
      type: GET_REPORTS_STANDARDS_GRADEBOOK_FILTERS_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

function* getReportsStandardsGradebookRequest({ payload }) {
  try {
    const standardsGradebook = yield call(reportsApi.fetchStandardsGradebookReport, payload);
    yield put({
      type: GET_REPORTS_STANDARDS_GRADEBOOK_REQUEST_SUCCESS,
      payload: { standardsGradebook }
    });
  } catch (error) {
    console.log("err", error.stack);
    let msg = "Failed to fetch standards gradebook Please try again...";
    yield call(message.error, msg);
    yield put({
      type: GET_REPORTS_STANDARDS_GRADEBOOK_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

export function* reportStandardsGradebookSaga() {
  yield all([
    yield takeEvery(
      GET_REPORTS_STANDARDS_GRADEBOOK_BROWSESTANDARDS_REQUEST,
      getReportsStandardsGradebookBrowseStandardsRequest
    ),
    yield takeEvery(GET_REPORTS_STANDARDS_GRADEBOOK_REQUEST, getReportsStandardsGradebookRequest),
    yield takeEvery(GET_REPORTS_STANDARDS_GRADEBOOK_FILTERS_REQUEST, getReportsStandardsGradebookFiltersRequest)
  ]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
