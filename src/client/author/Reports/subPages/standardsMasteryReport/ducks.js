import { createSelector } from "reselect";
import { createAction, createReducer } from "redux-starter-kit";

import { RESET_ALL_REPORTS } from "../../common/reportsRedux";

const SET_SMR_SETTINGS = "[SMR settings] get smr settings";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const setSMRSettingsAction = createAction(SET_SMR_SETTINGS);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportReducer.reportSMRSettingsReducer;

export const getReportsSMRSettings = createSelector(
  stateSelector,
  state => state
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  selectedTest: [],
  requestFilters: {
    termId: "",
    subject: "",
    grades: ["K"],
    domainIds: ["All"]
    // classSectionId: "",
    // assessmentType: ""
  }
};

export const reportSMRSettingsReducer = createReducer(initialState, {
  [SET_SMR_SETTINGS]: (state, { payload }) => (state = { ...payload }),
  [RESET_ALL_REPORTS]: (state, { payload }) => (state = initialState)
});

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
