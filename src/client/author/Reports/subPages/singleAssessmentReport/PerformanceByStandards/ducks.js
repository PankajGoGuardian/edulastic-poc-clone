import { createAction, createReducer } from "redux-starter-kit";
import { all, takeLatest, call, put } from "redux-saga/effects";
import { createSelector } from "reselect";
import { message } from "antd";
import { isEmpty } from "lodash";

import { reportsApi } from "@edulastic/api";

import { RESET_ALL_REPORTS } from "../../../common/reportsRedux";
import { getOrgDataFromSARFilter } from "../common/filterDataDucks";

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
  performanceByStandards: defaultReport,
  loading: true,
  error: undefined
};

export const reportPerformanceByStandardsReducer = createReducer(initialState, {
  [RESET_ALL_REPORTS]: (state, { payload }) => (state = initialState),
  [GET_PERFORMANCE_BY_STANDARDS_REQUEST]: (state, { payload }) => {
    state.loading = true;
  },
  [GET_PERFORMANCE_BY_STANDARDS_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.error = undefined;
    state.performanceByStandards = payload.report;
  },
  [GET_PERFORMANCE_BY_STANDARDS_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  }
});

const stateSelector = state => state.reportReducer.reportPerformanceByStandardsReducer;

export const getPerformanceByStandardsLoadingSelector = createSelector(
  stateSelector,
  state => state.loading
);

export const getPerformanceByStandardsErrorSelector = createSelector(
  stateSelector,
  state => state.error
);

const _getPerformanceByStandardsReportSelector = createSelector(
  stateSelector,
  state => state.performanceByStandards
);

export const getPerformanceByStandardsReportSelector = state => ({
  ..._getPerformanceByStandardsReportSelector(state),
  teacherInfo: getOrgDataFromSARFilter(state)
});

function* getPerformanceByStandardsSaga({ payload }) {
  const errorMessage = "Failed to fetch performance by standards, please try again";

  try {
    payload.requestFilters.classIds =
      payload.requestFilters?.classIds?.join(",") || payload.requestFilters?.classId || "";
    payload.requestFilters.groupIds =
      payload.requestFilters?.groupIds?.join(",") || payload.requestFilters?.groupId || "";
    const {
      data: { result }
    } = yield call(reportsApi.fetchPerformanceByStandard, payload);

    const report = isEmpty(result) ? defaultReport : result;

    yield put(getPerformanceByStandardsSuccessAction({ report }));
  } catch (error) {
    yield call(message.error, errorMessage);
    yield put(getPerformanceByStandardsErrorAction({ error: errorMessage }));
  }
}

export function* performanceByStandardsSaga() {
  yield all([yield takeLatest(GET_PERFORMANCE_BY_STANDARDS_REQUEST, getPerformanceByStandardsSaga)]);
}
