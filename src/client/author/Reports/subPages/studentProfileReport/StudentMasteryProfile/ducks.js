import { call, put, all, takeLatest } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import  {notification} from "@edulastic/common";
import { createAction, createReducer } from "redux-starter-kit";

import { RESET_ALL_REPORTS } from "../../../common/reportsRedux";

const GET_REPORTS_STUDENT_MASTERY_PROFILE_REQUEST = "[reports] get reports student mastery profile request";
const GET_REPORTS_STUDENT_MASTERY_PROFILE_REQUEST_SUCCESS = "[reports] get reports student mastery profile success";
const GET_REPORTS_STUDENT_MASTERY_PROFILE_REQUEST_ERROR = "[reports] get reports student mastery profile error";
const GET_STUDENT_STANDARDS_REQUEST = "[reports] student mastery profile get student standards request";
const GET_STUDENT_STANDARDS_SUCCESS = "[reports] student mastery profile get student standards success";
const GET_STUDENT_STANDARDS_FAILED = "[reports] student mastery profile get student standards failed";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getStudentMasteryProfileRequestAction = createAction(GET_REPORTS_STUDENT_MASTERY_PROFILE_REQUEST);
export const getStudentStandardsAction = createAction(GET_STUDENT_STANDARDS_REQUEST);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportReducer.reportStudentMasteryProfileReducer;

export const getReportsStudentMasteryProfile = createSelector(
  stateSelector,
  state => state.studentMasteryProfile
);

export const getReportsStudentMasteryProfileLoader = createSelector(
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
  studentMasteryProfile: {},
  studentStandard: [],
  loading: true,
  loadingStudentStandard: false
};

export const reportStudentMasteryProfileReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state, { payload }) => (state = initialState),
  [GET_REPORTS_STUDENT_MASTERY_PROFILE_REQUEST]: (state, { payload }) => {
    state.loading = true;
  },
  [GET_REPORTS_STUDENT_MASTERY_PROFILE_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.studentMasteryProfile = payload.studentMasteryProfile;
  },
  [GET_REPORTS_STUDENT_MASTERY_PROFILE_REQUEST_ERROR]: (state, { payload }) => {
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

function* getReportsStudentMasteryProfileRequest({ payload }) {
  try {
    const studentMasteryProfile = yield call(reportsApi.fetchStudentMasteryProfileReport, payload);

    yield put({
      type: GET_REPORTS_STUDENT_MASTERY_PROFILE_REQUEST_SUCCESS,
      payload: { studentMasteryProfile }
    });
  } catch (error) {
    console.log("err", error.stack);
    let msg = "Failed to fetch student mastery profile Please try again...";
    notification({msg:msg});
    yield put({
      type: GET_REPORTS_STUDENT_MASTERY_PROFILE_REQUEST_ERROR,
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
    notification({ messageKey:"faildedToFetchStudentsStandard" });
    yield put({
      type: GET_STUDENT_STANDARDS_FAILED
    });
  }
}

export function* reportStudentMasteryProfileSaga() {
  yield all([
    yield takeLatest(GET_REPORTS_STUDENT_MASTERY_PROFILE_REQUEST, getReportsStudentMasteryProfileRequest),
    yield takeLatest(GET_STUDENT_STANDARDS_REQUEST, getStudentStandardsSaga)
  ]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
