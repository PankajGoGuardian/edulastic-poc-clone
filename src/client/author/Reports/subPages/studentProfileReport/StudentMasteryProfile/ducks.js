import { takeEvery, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";

const RESET_REPORTS_STUDENT_MASTERY_PROFILE = "[reports] reset reports student mastery profile";
const GET_REPORTS_STUDENT_MASTERY_PROFILE_REQUEST = "[reports] get reports student mastery profile request";
const GET_REPORTS_STUDENT_MASTERY_PROFILE_REQUEST_SUCCESS = "[reports] get reports student mastery profile success";
const GET_REPORTS_STUDENT_MASTERY_PROFILE_REQUEST_ERROR = "[reports] get reports student mastery profile error";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const resetStudentMasteryProfileAction = createAction(RESET_REPORTS_STUDENT_MASTERY_PROFILE);
export const getStudentMasteryProfileRequestAction = createAction(GET_REPORTS_STUDENT_MASTERY_PROFILE_REQUEST);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportStudentMasteryProfileReducer;

export const getReportsStudentMasteryProfile = createSelector(
  stateSelector,
  state => state.studentMasteryProfile
);

export const getReportsStudentMasteryProfileLoader = createSelector(
  stateSelector,
  state => state.loading
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  studentMasteryProfile: {},
  loading: true
};

export const reportStudentMasteryProfileReducer = createReducer(initialState, {
  [RESET_REPORTS_STUDENT_MASTERY_PROFILE]: (state, { payload }) => {
    state.loading = false;
    state.studentMasteryProfile = {};
  },
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
    yield call(message.error, msg);
    yield put({
      type: GET_REPORTS_STUDENT_MASTERY_PROFILE_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

export function* reportStudentMasteryProfileSaga() {
  yield all([yield takeEvery(GET_REPORTS_STUDENT_MASTERY_PROFILE_REQUEST, getReportsStudentMasteryProfileRequest)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
