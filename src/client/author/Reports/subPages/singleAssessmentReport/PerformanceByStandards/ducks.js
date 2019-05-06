import { createAction, createReducer } from "redux-starter-kit";
import { all, takeLatest, call, put } from "redux-saga/effects";
import { createSelector } from "reselect";
import { message } from "antd";
import { isEmpty } from "lodash";

import { reportsApi } from "@edulastic/api";

const GET_PERFORMANCE_BY_STANDARDS_REQUEST = "[reports] get performance by standards request";
const GET_PERFORMANCE_BY_STANDARDS_SUCCESS = "[reports] get performance by standards success";
const GET_PERFORMANCE_BY_STANDARDS_ERROR = "[reports] get performance by standards error";

export const getPerformanceByStandardsAction = createAction(GET_PERFORMANCE_BY_STANDARDS_REQUEST);
export const getPerformanceByStandardsSuccessAction = createAction(GET_PERFORMANCE_BY_STANDARDS_SUCCESS);
export const getPerformanceByStandardsErrorAction = createAction(GET_PERFORMANCE_BY_STANDARDS_ERROR);

export const defaultReport = {
  teacherInfo: [],
  scaleInfo: [],
  skillInfo: [],
  metricInfo: [],
  studInfo: [],
  standardsMap: {},
  defaultStandardId: 0
};

const initialState = {
  report: defaultReport,
  loading: false,
  error: undefined
};

const getPerformanceByStandardsRequest = state => ({
  ...state,
  loading: true
});

const getPerformanceByStandardsSuccess = (state, { payload }) => ({
  ...state,
  loading: false,
  error: undefined,
  report: payload
});

const getPerformanceByStandardsError = (state, { payload: { error } }) => ({
  ...state,
  loading: false,
  error
});

export const reportPerformanceByStandardsReducer = createReducer(initialState, {
  [GET_PERFORMANCE_BY_STANDARDS_REQUEST]: getPerformanceByStandardsRequest,
  [GET_PERFORMANCE_BY_STANDARDS_SUCCESS]: getPerformanceByStandardsSuccess,
  [GET_PERFORMANCE_BY_STANDARDS_ERROR]: getPerformanceByStandardsError
});

const stateSelector = state => state.reportPerformanceByStandards;

export const getPerformanceByStandardsLoadingSelector = createSelector(
  stateSelector,
  state => state.loading
);

export const getPerformanceByStandardsErrorSelector = createSelector(
  stateSelector,
  state => state.error
);

export const getPerformanceByStandardsReportSelector = createSelector(
  stateSelector,
  state => state.report
);

function* getPerformanceByStandardsSaga({ payload }) {
  const errorMessage = "Failed to fetch performance by standards, please try again";

  try {
    const {
      data: { result }
    } = yield call(reportsApi.fetchPerformanceByStandard, payload);

    const report = isEmpty(result) ? defaultReport : result;

    yield put(getPerformanceByStandardsSuccessAction(report));
  } catch (error) {
    yield call(message.error, errorMessage);
    yield put(getPerformanceByStandardsErrorAction({ error: errorMessage }));
  }
}

export function* performanceByStandardsSaga() {
  yield all([yield takeLatest(GET_PERFORMANCE_BY_STANDARDS_REQUEST, getPerformanceByStandardsSaga)]);
}
