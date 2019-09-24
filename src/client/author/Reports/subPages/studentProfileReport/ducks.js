import { takeEvery, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";
import { groupBy } from "lodash";

import { RESET_ALL_REPORTS } from "../../common/reportsRedux";

const SET_SPR_SETTINGS = "[SPR settings] get spr settings";

export const setSPRSettingsAction = createAction(SET_SPR_SETTINGS);

export const stateSelector = state => state.reportReducer.reportSPRSettingsReducer;

export const getReportsSPRSettings = createSelector(
  stateSelector,
  state => state
);

const initialState = {
  selectedStudent: { key: "", title: "" },
  requestFilters: {
    termId: "",
    courseId: "",
    performanceBandProfileId: "",
    standardsProficiencyProfileId: ""
  }
};

export const reportSPRSettingsReducer = createReducer(initialState, {
  [SET_SPR_SETTINGS]: (state, { payload }) => (state = { ...payload }),
  [RESET_ALL_REPORTS]: (state, { payload }) => (state = initialState)
});
