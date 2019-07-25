import { takeEvery, call, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { reportsApi } from "@edulastic/api";
import { message } from "antd";
import { createAction, createReducer } from "redux-starter-kit";
import { groupBy } from "lodash";

const SET_SPR_SETTINGS = "[SPR settings] get spr settings";

export const setSPRSettingsAction = createAction(SET_SPR_SETTINGS);

export const stateSelector = state => state.reportSPRSettingsReducer;

export const getReportsSPRSettings = createSelector(
  stateSelector,
  state => state
);

const initialState = {
  selectedStudent: { key: "5d11b3a138a00c59ea7be6db", title: "" },
  requestFilters: {
    termId: "",
    courseId: ""
  }
};

export const reportSPRSettingsReducer = createReducer(initialState, {
  [SET_SPR_SETTINGS]: (state, { payload }) => (state = { ...payload })
});
