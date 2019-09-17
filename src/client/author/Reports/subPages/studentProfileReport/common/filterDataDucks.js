import { takeEvery, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";
import { groupBy } from "lodash";

const GET_REPORTS_SPR_FILTER_DATA_REQUEST = "[reports] get reports spr filter data request";
const GET_REPORTS_SPR_FILTER_DATA_REQUEST_SUCCESS = "[reports] get reports spr filter data request success";
const GET_REPORTS_SPR_FILTER_DATA_REQUEST_ERROR = "[reports] get reports spr filter data request error";
const RESET_REPORTS_SPR_FILTER_DATA = "[reports] reset reports spr filter data";
const RESET_REPORTS_SPR_FILTERS = "[reports] reset reports spr filters";

const SET_REPORTS_PREV_SPR_FILTER_DATA = "[reports] set reports prev spr filter data";

const SET_FILTERS = "[reports] set spr filters";
const SET_STUDENT_ID = "[reports] set spr student";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getSPRFilterDataRequestAction = createAction(GET_REPORTS_SPR_FILTER_DATA_REQUEST);

export const setPrevSPRFilterDataAction = createAction(SET_REPORTS_PREV_SPR_FILTER_DATA);

export const resetSPRFiltersAction = createAction(RESET_REPORTS_SPR_FILTERS);

export const setFiltersAction = createAction(SET_FILTERS);
export const setStudentAction = createAction(SET_STUDENT_ID);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportSPRFilterDataReducer;

export const getReportsSPRFilterData = createSelector(
  stateSelector,
  state => state.SPRFilterData
);

export const getFiltersSelector = createSelector(
  stateSelector,
  state => state.filters
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

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  SPRFilterData: {},
  studentList: [],
  prevSPRFilterData: null,
  filters: {
    termId: "",
    courseId: ""
  },
  student: {
    key: "5d11b3a138a00c59ea7be6db"
  },
  loading: false
};

const setFiltersReducer = (state, { payload }) => {
  state.filters = { ...payload };
};

const setStudentReducer = (state, { payload }) => {
  state.student = payload;
};

export const reportSPRFilterDataReducer = createReducer(initialState, {
  [GET_REPORTS_SPR_FILTER_DATA_REQUEST]: (state, { payload }) => {
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
  [SET_FILTERS]: setFiltersReducer,
  [SET_STUDENT_ID]: setStudentReducer,

  [SET_REPORTS_PREV_SPR_FILTER_DATA]: (state, { payload }) => {
    state.prevSPRFilterData = payload;
  },
  [RESET_REPORTS_SPR_FILTER_DATA]: (state, { payload }) => {
    state.SPRFilterData = {};
  },
  [RESET_REPORTS_SPR_FILTERS]: (state, { payload }) => (state = initialState)
});

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsSPRFilterDataRequest({ payload }) {
  try {
    yield put({ type: RESET_REPORTS_SPR_FILTER_DATA });
    const SPRFilterData = yield call(reportsApi.fetchSPRFilterData, payload);

    yield put({
      type: GET_REPORTS_SPR_FILTER_DATA_REQUEST_SUCCESS,
      payload: { SPRFilterData }
    });
  } catch (error) {
    let msg = "Failed to fetch filter data Please try again...";
    yield call(message.error, msg);
    yield put({
      type: GET_REPORTS_SPR_FILTER_DATA_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

export function* reportSPRFilterDataSaga() {
  yield all([yield takeEvery(GET_REPORTS_SPR_FILTER_DATA_REQUEST, getReportsSPRFilterDataRequest)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
