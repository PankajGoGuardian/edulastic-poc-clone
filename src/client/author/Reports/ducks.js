import { createSelector } from "reselect";
import { createAction, createReducer } from "redux-starter-kit";

const SET_PRINTING_STATE = "[reports] set printing state";
const SET_CSV_DOWNLOADING_STATE = "[reports] set csv download state";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const setPrintingStateAction = createAction(SET_PRINTING_STATE);
export const setCsvDownloadingStateAction = createAction(SET_CSV_DOWNLOADING_STATE);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportReducer;

export const getPrintingState = createSelector(
  stateSelector,
  state => state.isPrinting
);

export const getCsvDownloadingState = createSelector(
  stateSelector,
  state => state.isCsvDownloading
);

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  isPrinting: false
};

export const reportReducer = createReducer(initialState, {
  [SET_PRINTING_STATE]: (state, { payload }) => {
    state.isPrinting = payload;
  },
  [SET_CSV_DOWNLOADING_STATE]: (state, { payload }) => {
    state.isCsvDownloading = payload;
  }
});
