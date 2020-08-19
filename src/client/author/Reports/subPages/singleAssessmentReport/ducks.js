import { createSelector } from "reselect";
import { createAction, createReducer } from "redux-starter-kit";

import { RESET_ALL_REPORTS } from "../../common/reportsRedux";

const SET_SAR_SETTINGS = "[SAR settings] get sar settings";
const RESET_SAR_SETTINGS = "[SAR settings] reset sar settings";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const setSARSettingsAction = createAction(SET_SAR_SETTINGS);
export const resetSARSettingsAction = createAction(RESET_SAR_SETTINGS);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportReducer.reportSARSettingsReducer;

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
  },
  reportType: ""
};

export const reportSARSettingsReducer = createReducer(initialState, {
  [SET_SAR_SETTINGS]: (state, { payload }) => (state = { ...payload }),
  [RESET_ALL_REPORTS]: (state, { payload }) => (state = initialState)
});

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
