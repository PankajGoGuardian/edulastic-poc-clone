import { takeEvery, takeLatest, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";

const GET_REPORTS_STANDARDS_GRADEBOOK_REQUEST = "[reports] get reports standards gradebook request";
const GET_REPORTS_STANDARDS_GRADEBOOK_REQUEST_SUCCESS = "[reports] get reports standards gradebook success";
const GET_REPORTS_STANDARDS_GRADEBOOK_REQUEST_ERROR = "[reports] get reports standards gradebook error";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

// export const getStandardsGradebookProcessRequestsAction = createAction(GET_REPORTS_STANDARDS_GRADEBOOK_PROCESS_REQUESTS);
export const getStandardsGradebookRequestAction = createAction(GET_REPORTS_STANDARDS_GRADEBOOK_REQUEST);
// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportStandardsGradebookReducer;

export const getReportsStandardsGradebook = createSelector(
  stateSelector,
  state => state.standardsGradebook
);

export const getReportsStandardsGradebookLoader = createSelector(
  stateSelector,
  state => state.loading
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  loader: true,
  standardsGradebook: {},
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

export const reportStandardsGradebookReducer = createReducer(initialState, {
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
  }
});

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

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
  yield all([yield takeEvery(GET_REPORTS_STANDARDS_GRADEBOOK_REQUEST, getReportsStandardsGradebookRequest)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
