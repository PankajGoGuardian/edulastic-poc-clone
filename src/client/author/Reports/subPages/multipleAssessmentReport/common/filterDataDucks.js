import { takeEvery, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";
import { groupBy } from "lodash";

const GET_REPORTS_MAR_FILTER_DATA_REQUEST = "[reports] get reports mar filter data request";
const GET_REPORTS_MAR_FILTER_DATA_REQUEST_SUCCESS = "[reports] get reports mar filter data request success";
const GET_REPORTS_MAR_FILTER_DATA_REQUEST_ERROR = "[reports] get reports mar filter data request error";

const SET_FILTERS = "[reports] set mar filters";
const SET_TEST_ID = "[reports] set mar testId";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getMARFilterDataRequestAction = createAction(GET_REPORTS_MAR_FILTER_DATA_REQUEST);

export const setFiltersAction = createAction(SET_FILTERS);
export const setTestIdAction = createAction(SET_TEST_ID);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportMARFilterDataReducer;

export const getReportsMARFilterData = createSelector(
  stateSelector,
  state => state.MARFilterData
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
  MARFilterData: {},
  filters: {
    termId: "",
    subject: "All",
    grade: "All",
    courseId: "All",
    groupId: "All",
    schoolId: "All",
    teacherId: "All",
    assessmentType: "All"
  },
  testId: ""
};

const setFiltersReducer = (state, { payload }) => {
  if (payload.filters && payload.orgDataArr) {
    let byGroupId = groupBy(
      payload.orgDataArr.filter((item, index) => {
        if (
          item.groupId &&
          (item.grade === payload.filters.grade || payload.filters.grade === "All") &&
          (item.subject === payload.filters.subject || payload.filters.subject === "All") &&
          (item.courseId === payload.filters.courseId || payload.filters.courseId === "All")
        ) {
          return true;
        }
      }),
      "groupId"
    );
    let groupIdArr = Object.keys(byGroupId).map((item, index) => {
      return {
        key: byGroupId[item][0].groupId,
        title: byGroupId[item][0].groupName
      };
    });
    groupIdArr.unshift({
      key: "All",
      title: "All Classes"
    });

    let isPresent = groupIdArr.find((item, index) => item.key === payload.filters.groupId);
    if (!isPresent) {
      payload.filters.groupId = groupIdArr[0].key;
    }
    state.filters = { ...payload.filters };
  } else {
    state.filters = { ...payload };
  }
};

const setTestIdReducer = (state, { payload }) => {
  state.testId = payload;
};

export const reportMARFilterDataReducer = createReducer(initialState, {
  [GET_REPORTS_MAR_FILTER_DATA_REQUEST]: (state, { payload }) => {
    state.loading = true;
  },
  [GET_REPORTS_MAR_FILTER_DATA_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.MARFilterData = payload.MARFilterData;
  },
  [GET_REPORTS_MAR_FILTER_DATA_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },
  [SET_FILTERS]: setFiltersReducer,
  [SET_TEST_ID]: setTestIdReducer
});

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsMARFilterDataRequest({ payload }) {
  try {
    const MARFilterData = yield call(reportsApi.fetchMARFilterData, payload);

    yield put({
      type: GET_REPORTS_MAR_FILTER_DATA_REQUEST_SUCCESS,
      payload: { MARFilterData }
    });
  } catch (error) {
    let msg = "Failed to fetch filter data Please try again...";
    yield call(message.error, msg);
    yield put({
      type: GET_REPORTS_MAR_FILTER_DATA_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

export function* reportMARFilterDataSaga() {
  yield all([yield takeEvery(GET_REPORTS_MAR_FILTER_DATA_REQUEST, getReportsMARFilterDataRequest)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
