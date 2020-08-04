import { createSelector } from "reselect";
import { createAction, createReducer } from "redux-starter-kit";

import { RESET_ALL_REPORTS } from "../../common/reportsRedux";

const SET_SPR_SETTINGS = "[SPR settings] set spr settings";

export const setSPRSettingsAction = createAction(SET_SPR_SETTINGS);

export const stateSelector = state => state.reportReducer.reportSPRSettingsReducer;

export const getReportsSPRSettings = createSelector(
  stateSelector,
  state => state
);

const defaultStudent = { key: "", title: "" };
const defaultFilters = {
  termId: "",
  courseId: "",
  grade: "",
  subject: "",
  performanceBandProfileId: "",
  standardsProficiencyProfileId: ""
};

const initialState = {
  selectedStudent: { ...defaultStudent },
  requestFilters: { ...defaultFilters }
};

export const reportSPRSettingsReducer = createReducer(initialState, {
  [SET_SPR_SETTINGS]: (state, { payload }) => {
    state.selectedStudent = payload.selectedStudent;
    state.requestFilters = payload.requestFilters;
  },
  // eslint-disable-next-line no-unused-vars
  [RESET_ALL_REPORTS]: state => {
    state.selectedStudent = { ...defaultStudent };
    state.requestFilters = { ...defaultFilters };
  }
});
