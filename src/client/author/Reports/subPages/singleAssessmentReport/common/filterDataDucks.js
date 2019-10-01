import { takeEvery, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";
import { groupBy, set, get } from "lodash";
import { push } from "connected-react-router";

import { RESET_ALL_REPORTS } from "../../../common/reportsRedux";

const GET_REPORTS_SAR_FILTER_DATA_REQUEST = "[reports] get reports sar filter data request";
const GET_REPORTS_SAR_FILTER_DATA_REQUEST_SUCCESS = "[reports] get reports sar filter data request success";
const GET_REPORTS_SAR_FILTER_DATA_REQUEST_ERROR = "[reports] get reports sar filter data request error";
const RESET_REPORTS_SAR_FILTER_DATA = "[reports] reset reports sar filter data";
const RESET_REPORTS_SAR_FILTERS = "[reports] reset reports sar filters";
const SET_REPORTS_PREV_SAR_FILTER_DATA = "[reports] set reports prev sar filter data";
const SET_REPORTS_FILTER_PB_PROFILE = "[reports] set performance band profile filter";
const SET_REPORTS_FILTER_SP_PROFILE = "[reports] set standards proficiency profile filter";

const SET_FILTERS = "[reports] set sar filters";
const SET_TEST_ID = "[reports] set sar testId";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const getSARFilterDataRequestAction = createAction(GET_REPORTS_SAR_FILTER_DATA_REQUEST);
export const resetSARFiltersAction = createAction(RESET_REPORTS_SAR_FILTERS);
export const setPrevSARFilterDataAction = createAction(SET_REPORTS_PREV_SAR_FILTER_DATA);

export const setFiltersAction = createAction(SET_FILTERS);
export const setTestIdAction = createAction(SET_TEST_ID);
export const setPerformanceBandProfileFilterAction = createAction(SET_REPORTS_FILTER_PB_PROFILE);
export const setStandardsProficiencyProfileFilterAction = createAction(SET_REPORTS_FILTER_SP_PROFILE);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportReducer.reportSARFilterDataReducer;

export const getReportsSARFilterData = createSelector(
  stateSelector,
  state => state.SARFilterData
);

export const getFiltersSelector = createSelector(
  stateSelector,
  state => state.filters
);

export const getTestIdSelector = createSelector(
  stateSelector,
  state => state.testId
);

export const getReportsPrevSARFilterData = createSelector(
  stateSelector,
  state => state.prevSARFilterData
);

export const getReportsSARFilterLoadingState = createSelector(
  stateSelector,
  state => state.loading
);

export const getSAFFilterSelectedPerformanceBandProfile = createSelector(
  stateSelector,
  state => state.filters.performanceBandProfile
);

export const getSAFFilterPerformanceBandProfiles = createSelector(
  stateSelector,
  state => get(state, "SARFilterData.data.result.bandInfo", [])
);

export const getSAFFilterSelectedStandardsProficiencyProfile = createSelector(
  stateSelector,
  state => state.filters.standardsProficiencyProfile
);

export const getSAFFilterStandardsProficiencyProfiles = createSelector(
  stateSelector,
  state => get(state, "SARFilterData.data.result.scaleInfo", [])
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  SARFilterData: {},
  prevSARFilterData: null,
  filters: {
    termId: "",
    subject: "All",
    grade: "All",
    courseId: "All",
    groupId: "All",
    schoolId: "All",
    teacherId: "All",
    assessmentType: "All",
    performanceBandProfile: "",
    standardsProficiencyProfile: ""
  },
  testId: "",
  loading: false
};

const setFiltersReducer = (state, { payload }) => {
  /**
   * FIXME: need to refactor for simplicity
   */
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

export const reportSARFilterDataReducer = createReducer(initialState, {
  [GET_REPORTS_SAR_FILTER_DATA_REQUEST]: (state, { payload }) => {
    state.loading = true;
  },
  [GET_REPORTS_SAR_FILTER_DATA_REQUEST_SUCCESS]: (state, { payload }) => {
    state.loading = false;
    state.SARFilterData = payload.SARFilterData;
  },
  [GET_REPORTS_SAR_FILTER_DATA_REQUEST_ERROR]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },
  [SET_FILTERS]: setFiltersReducer,
  [SET_REPORTS_FILTER_PB_PROFILE]: (state, { payload }) => {
    set(state, "filters.performanceBandProfile", payload);
  },
  [SET_REPORTS_FILTER_SP_PROFILE]: (state, { payload }) => {
    set(state, "filters.standardsProficiencyProfile", payload);
  },
  [SET_TEST_ID]: setTestIdReducer,
  [RESET_REPORTS_SAR_FILTER_DATA]: (state, { payload }) => {
    state.SARFilterData = {};
  },
  [RESET_ALL_REPORTS]: (state, { payload }) => (state = initialState),
  [SET_REPORTS_PREV_SAR_FILTER_DATA]: (state, { payload }) => {
    state.prevSARFilterData = payload;
  }
});

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* getReportsSARFilterDataRequest({ payload }) {
  try {
    yield put({ type: RESET_REPORTS_SAR_FILTER_DATA });
    const SARFilterData = yield call(reportsApi.fetchSARFilterData, payload);

    yield put({
      type: GET_REPORTS_SAR_FILTER_DATA_REQUEST_SUCCESS,
      payload: { SARFilterData }
    });
  } catch (error) {
    let msg = "Failed to fetch filter data Please try again...";
    yield call(message.error, msg);
    yield put({
      type: GET_REPORTS_SAR_FILTER_DATA_REQUEST_ERROR,
      payload: { error: msg }
    });
  }
}

export function* reportSARFilterDataSaga() {
  yield all([yield takeEvery(GET_REPORTS_SAR_FILTER_DATA_REQUEST, getReportsSARFilterDataRequest)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
