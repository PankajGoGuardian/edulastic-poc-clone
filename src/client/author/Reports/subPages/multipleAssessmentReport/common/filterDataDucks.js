import { takeEvery, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import { notification } from "@edulastic/common";
import { createAction, createReducer } from "redux-starter-kit";
import { groupBy } from "lodash";

import { RESET_ALL_REPORTS } from "../../../common/reportsRedux";

const GET_REPORTS_MAR_FILTER_DATA_REQUEST = "[reports] get reports mar filter data request";
const GET_REPORTS_MAR_FILTER_DATA_REQUEST_SUCCESS = "[reports] get reports mar filter data request success";
const GET_REPORTS_MAR_FILTER_DATA_REQUEST_ERROR = "[reports] get reports mar filter data request error";
const SET_REPORTS_PREV_MAR_FILTER_DATA = "[reports] set reports prev mar filter data";

const SET_FILTERS = "[reports] set mar filters";
const SET_TEST_ID = "[reports] set mar testId";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getMARFilterDataRequestAction = createAction(GET_REPORTS_MAR_FILTER_DATA_REQUEST);
export const setPrevMARFilterDataAction = createAction(SET_REPORTS_PREV_MAR_FILTER_DATA);

export const setFiltersAction = createAction(SET_FILTERS);
export const setTestIdAction = createAction(SET_TEST_ID);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportReducer.reportMARFilterDataReducer;

export const getReportsMARFilterData = createSelector(
  stateSelector,
  state => state.MARFilterData
);

export const getReportsMARSelectedPerformanceBandProfile = createSelector(
  stateSelector,
  state => {
    const availableProfiles = state?.MARFilterData?.data?.result?.bandInfo || [];
    const selectedProfileId = state?.filters?.profileId;
    return availableProfiles.find(x => x._id === selectedProfileId) || availableProfiles[0];
  }
);

export const getFiltersSelector = createSelector(
  stateSelector,
  state => state.filters
);

export const getTestIdSelector = createSelector(
  stateSelector,
  state => state.testId
);

export const getReportsPrevMARFilterData = createSelector(
  stateSelector,
  state => state.prevMARFilterData
);

export const getReportsMARFilterLoadingState = createSelector(
  stateSelector,
  state => state.loading
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  MARFilterData: {},
  prevMARFilterData: null,
  filters: {
    termId: "",
    subject: "All",
    grade: "All",
    courseId: "All",
    classId: "All",
    groupId: "All",
    schoolId: "All",
    teacherId: "All",
    assessmentType: "All",
    /**
     * performanceBandProfile
     */
    profileId: ""
  },
  testId: "",
  loading: false
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
    // map filtered class ids & custom group ids by group type
    let classIds = [],
      groupIds = [];
    Object.keys(byGroupId).forEach(item => {
      const key = byGroupId[item][0].groupId,
        groupType = byGroupId[item][0].groupType;
      groupType === "class" ? classIds.push(key) : groupIds.push(key);
    });
    // set default filters for missing class id & group id
    if (!classIds.includes(payload.filters.classId)) {
      payload.filters.classId = "All";
    }
    if (!groupIds.includes(payload.filters.groupId)) {
      payload.filters.groupId = "All";
    }
    // update state
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
  [SET_TEST_ID]: setTestIdReducer,
  [RESET_ALL_REPORTS]: (state, { payload }) => (state = initialState),
  [SET_REPORTS_PREV_MAR_FILTER_DATA]: (state, { payload }) => {
    state.prevMARFilterData = payload;
  }
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
    notification({msg:msg});
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
