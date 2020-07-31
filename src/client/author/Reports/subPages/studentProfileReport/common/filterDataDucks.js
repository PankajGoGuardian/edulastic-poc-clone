import { takeEvery, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { notification } from "@edulastic/common";
import { createAction, createReducer } from "redux-starter-kit";
import { get } from "lodash";

import { RESET_ALL_REPORTS } from "../../../common/reportsRedux";

const GET_REPORTS_SPR_FILTER_DATA_REQUEST = "[reports] get reports spr filter data request";
const GET_REPORTS_SPR_FILTER_DATA_REQUEST_SUCCESS = "[reports] get reports spr filter data request success";
const GET_REPORTS_SPR_FILTER_DATA_REQUEST_ERROR = "[reports] get reports spr filter data request error";
const RESET_REPORTS_SPR_FILTER_DATA = "[reports] reset reports spr filter data";
const SET_REPORTS_PREV_SPR_FILTER_DATA = "[reports] set reports prev spr filter data";

const GET_REPORTS_SPR_STUDENT_DATA_REQUEST = "[reports] get reports spr student data request";
const GET_REPORTS_SPR_STUDENT_DATA_REQUEST_SUCCESS = "[reports] get reports spr student data request success";
const GET_REPORTS_SPR_STUDENT_DATA_REQUEST_ERROR = "[reports] get reports spr student data request error";

const SET_FILTERS = "[reports] set spr filters";
const SET_STUDENT_ID = "[reports] set spr student";
const SET_SELECTED_CLASS = "[reports] set selected class";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getSPRFilterDataRequestAction = createAction(GET_REPORTS_SPR_FILTER_DATA_REQUEST);
export const setPrevSPRFilterDataAction = createAction(SET_REPORTS_PREV_SPR_FILTER_DATA);

export const setFiltersAction = createAction(SET_FILTERS);
export const setStudentAction = createAction(SET_STUDENT_ID);
export const setSelectedClassAction = createAction(SET_SELECTED_CLASS);

export const getSPRStudentDataRequestAction = createAction(GET_REPORTS_SPR_STUDENT_DATA_REQUEST);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportReducer.reportSPRFilterDataReducer;

export const getReportsSPRFilterData = createSelector(
  stateSelector,
  state => state.SPRFilterData
);

export const selectedPerformanceBand = createSelector(
  stateSelector,
  state => state?.filters?.performanceBandProfileId || ""
);

export const selectedStandardProficiency = createSelector(
  stateSelector,
  state => state?.filters?.standardsProficiencyProfileId || ""
);

export const getBandInfoSelected = createSelector(
  getReportsSPRFilterData,
  selectedPerformanceBand,
  (SPRFData, selected) => {
    const bands = SPRFData?.data?.result?.bandInfo || [];
    return (bands.find(x => x._id === selected) || bands[0])?.performanceBand;
  }
);

export const getSelectedStandardProficiency = createSelector(
  getReportsSPRFilterData,
  selectedStandardProficiency,
  (SPRFData, selected) => {
    const scales = SPRFData?.data?.result?.scaleInfo || [];
    return (scales.find(x => x._id === selected) || scales[0])?.scale;
  }
);

export const getFiltersSelector = createSelector(
  stateSelector,
  state => state.filters
);

export const getSelectedClassSelector = createSelector(
  stateSelector,
  state => state.selectedClass
);

export const getStudentSelector = createSelector(
  stateSelector,
  state => state.student
);

export const getReportsPrevSPRFilterData = createSelector(
  stateSelector,
  state => state.prevSPRFilterData
);

export const getReportsSPRFilterLoadingState = createSelector(
  stateSelector,
  state => state.loading
);

export const getStudentsListSelector = createSelector(
  stateSelector,
  state => state.studentList
);

export const getStudentsLoading = createSelector(
  stateSelector,
  state => state.loading
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  SPRFilterData: {},
  studentList: [],
  prevSPRFilterData: null,
  filters: {
    termId: "",
    courseId: "",
    grade: "All",
    subject: "All",
    performanceBandProfileId: "",
    standardsProficiencyProfileId: ""
  },
  student: {
    key: "",
    title: ""
  },
  selectedClass: {
    key: "",
    title: ""
  },
  loading: false
};

export const reportSPRFilterDataReducer = createReducer(initialState, {
  [GET_REPORTS_SPR_FILTER_DATA_REQUEST]: state => {
    state.loading = true;
  },
  [GET_REPORTS_SPR_FILTER_DATA_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.SPRFilterData = payload.SPRFilterData;
  },
  [GET_REPORTS_SPR_FILTER_DATA_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },
  [SET_FILTERS]: (state, { payload }) => {
    state.filters = { ...payload };
  },
  [SET_STUDENT_ID]: (state, { payload }) => {
    state.student = payload;
  },
  [SET_SELECTED_CLASS]: (state, { payload }) => {
    state.selectedClass = payload;
  },
  [SET_REPORTS_PREV_SPR_FILTER_DATA]: (state, { payload }) => {
    state.prevSPRFilterData = payload;
  },
  [RESET_REPORTS_SPR_FILTER_DATA]: state => {
    state.SPRFilterData = {};
  },
  // eslint-disable-next-line no-unused-vars
  [RESET_ALL_REPORTS]: state => {
    state = initialState;
  },
  [GET_REPORTS_SPR_STUDENT_DATA_REQUEST]: state => {
    state.loading = true;
  },
  [GET_REPORTS_SPR_STUDENT_DATA_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.studentList = payload.studentList;
  },
  [GET_REPORTS_SPR_STUDENT_DATA_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  }
});

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsSPRFilterDataRequest({ payload }) {
  try {
    const SPRFilterData = yield call(reportsApi.fetchSPRFilterData, payload);

    yield put({
      type: GET_REPORTS_SPR_FILTER_DATA_REQUEST_SUCCESS,
      payload: { SPRFilterData }
    });
  } catch (error) {
    const msg = "Failed to fetch filter data Please try again...";
    notification({ msg });
    yield put({
      type: GET_REPORTS_SPR_FILTER_DATA_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

function* receiveStudentsListSaga({ payload }) {
  try {
    const result = yield call(reportsApi.fetchStudentList, payload);
    yield put({
      type: GET_REPORTS_SPR_STUDENT_DATA_REQUEST_SUCCESS,
      payload: { studentList: get(result, "data.result", []) }
    });
  } catch (err) {
    const msg = "Receive Students is failing!";
    notification({ msg });
    yield put({
      type: GET_REPORTS_SPR_STUDENT_DATA_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

export function* reportSPRFilterDataSaga() {
  yield all([yield takeEvery(GET_REPORTS_SPR_FILTER_DATA_REQUEST, getReportsSPRFilterDataRequest)]);
  yield all([yield takeEvery(GET_REPORTS_SPR_STUDENT_DATA_REQUEST, receiveStudentsListSaga)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
