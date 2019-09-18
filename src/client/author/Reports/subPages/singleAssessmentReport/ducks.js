import { takeEvery, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";
import { groupBy } from "lodash";

const SET_SAR_SETTINGS = "[SAR settings] get sar settings";
const RESET_SAR_SETTINGS = "[SAR settings] reset sar settings";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const setSARSettingsAction = createAction(SET_SAR_SETTINGS);
export const resetSARSettingsAction = createAction(RESET_SAR_SETTINGS);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportSARSettingsReducer;

export const getReportsSARSettings = createSelector(
  stateSelector,
  state => state
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  selectedTest: { key: "", title: "" },
  requestFilters: {
    termId: "",
    subject: "",
    grade: "",
    courseId: "",
    groupId: "",
    schoolId: "",
    teacherId: "",
    assessmentType: ""
  }
};

export const reportSARSettingsReducer = createReducer(initialState, {
  [SET_SAR_SETTINGS]: (state, { payload }) => (state = { ...payload }),
  [RESET_SAR_SETTINGS]: (state, { payload }) => {
    state = initialState;
    return state;
  }
});

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
