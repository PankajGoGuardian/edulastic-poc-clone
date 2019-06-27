import { takeEvery, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";

const GET_REPORTS_PERFORMANCE_BY_STUDENTS_REQUEST = "[reports] get reports performance by students request";
const GET_REPORTS_PERFORMANCE_BY_STUDENTS_REQUEST_SUCCESS = "[reports] get reports performance by students success";
const GET_REPORTS_PERFORMANCE_BY_STUDENTS_REQUEST_ERROR = "[reports] get reports performance by students error";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getPerformanceByStudentsRequestAction = createAction(GET_REPORTS_PERFORMANCE_BY_STUDENTS_REQUEST);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportPerformanceByStudentsReducer;

export const getReportsPerformanceByStudents = createSelector(
  stateSelector,
  state => state.performanceByStudents
);

export const getReportsPerformanceByStudentsLoader = createSelector(
  stateSelector,
  state => state.loading
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  performanceByStudents: {},
  loading: true
};

export const reportPerformanceByStudentsReducer = createReducer(initialState, {
  [GET_REPORTS_PERFORMANCE_BY_STUDENTS_REQUEST]: (state, { payload }) => {
    state.loading = true;
  },
  [GET_REPORTS_PERFORMANCE_BY_STUDENTS_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.performanceByStudents = payload.performanceByStudents;
  },
  [GET_REPORTS_PERFORMANCE_BY_STUDENTS_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  }
});

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsPerformanceByStudentsRequest({ payload }) {
  try {
    const performanceByStudents = yield call(reportsApi.fetchPerformanceByStudentsReport, payload);

    yield put({
      type: GET_REPORTS_PERFORMANCE_BY_STUDENTS_REQUEST_SUCCESS,
      payload: { performanceByStudents }
    });
  } catch (error) {
    console.log("err", error.stack);
    let msg = "Failed to fetch performance by students Please try again...";

    yield call(message.error, msg);
    yield put({
      type: GET_REPORTS_PERFORMANCE_BY_STUDENTS_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

export function* reportPerformanceByStudentsSaga() {
  yield all([yield takeEvery(GET_REPORTS_PERFORMANCE_BY_STUDENTS_REQUEST, getReportsPerformanceByStudentsRequest)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
