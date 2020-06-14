import { takeEvery, takeLatest, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import  {notification} from "@edulastic/common";
import { createAction, createReducer } from "redux-starter-kit";

import { RESET_ALL_REPORTS } from "../../../common/reportsRedux";

const GET_REPORTS_STANDARDS_GRADEBOOK_REQUEST = "[reports] get reports standards gradebook request";
const GET_REPORTS_STANDARDS_GRADEBOOK_REQUEST_SUCCESS = "[reports] get reports standards gradebook success";
const GET_REPORTS_STANDARDS_GRADEBOOK_REQUEST_ERROR = "[reports] get reports standards gradebook error";
const GET_STUDENT_STANDARDS_REQUEST = "[reports] standard gradebook get student standards request ";
const GET_STUDENT_STANDARDS_SUCCESS = "[reports] standard gradebook get student standards success";
const GET_STUDENT_STANDARDS_FAILED = "[reports] standard gradebook get student standards failed";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

// export const getStandardsGradebookProcessRequestsAction = createAction(GET_REPORTS_STANDARDS_GRADEBOOK_PROCESS_REQUESTS);
export const getStandardsGradebookRequestAction = createAction(GET_REPORTS_STANDARDS_GRADEBOOK_REQUEST);
export const getStudentStandardsAction = createAction(GET_STUDENT_STANDARDS_REQUEST);
// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportReducer.reportStandardsGradebookReducer;

export const getReportsStandardsGradebook = createSelector(
  stateSelector,
  state => state.standardsGradebook
);

export const getReportsStandardsGradebookLoader = createSelector(
  stateSelector,
  state => state.loading
);

export const getStudentStandardData = createSelector(
  stateSelector,
  state => state.studentStandard
);

export const getStudentStandardLoader = createSelector(
  stateSelector,
  state => state.loadingStudentStandard
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
  testIds: "",
  studentStandard: [],
  loadingStudentStandard: false
};

export const reportStandardsGradebookReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state, { payload }) => (state = initialState),
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
  [GET_STUDENT_STANDARDS_REQUEST]: state => {
    state.loadingStudentStandard = true;
  },
  [GET_STUDENT_STANDARDS_SUCCESS]: (state, { payload }) => {
    state.studentStandard = payload.data.result;
    state.loadingStudentStandard = false;
  },
  [GET_STUDENT_STANDARDS_FAILED]: state => {
    state.loadingStudentStandard = "failed";
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
    const msg = "Failed to fetch standards gradebook Please try again...";
    notification({ msg });
    yield put({
      type: GET_REPORTS_STANDARDS_GRADEBOOK_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

function* getStudentStandardsSaga({ payload }) {
  try {
    const studentStandard = yield call(reportsApi.fetchStudentStandards, payload);
    yield put({
      type: GET_STUDENT_STANDARDS_SUCCESS,
      payload: studentStandard
    });
  } catch (error) {
    console.error("err", error.stack);
    notification({messageKey:"failedToFetchStudentStandard"});
    yield put({
      type: GET_STUDENT_STANDARDS_FAILED
    });
  }
}

export function* reportStandardsGradebookSaga() {
  yield all([
    yield takeLatest(GET_REPORTS_STANDARDS_GRADEBOOK_REQUEST, getReportsStandardsGradebookRequest),
    yield takeLatest(GET_STUDENT_STANDARDS_REQUEST, getStudentStandardsSaga)
  ]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
