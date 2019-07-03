import { createSelector } from "reselect";
import { createAction, createReducer } from "redux-starter-kit";

const SET_PRINTING_STATE = "[reports] set printing state";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const setPrintingStateAction = createAction(SET_PRINTING_STATE);

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = state => state.reportReducer;

export const getPrintingState = createSelector(
  stateSelector,
  state => state.isPrinting
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
  }
});
