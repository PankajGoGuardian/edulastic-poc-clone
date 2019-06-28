import { takeEvery, put, all } from "redux-saga/effects";
import { createSelector } from "reselect";
import { createAction, createReducer } from "redux-starter-kit";

const SET_PRINTING_STATE_REQUEST = "[reports] set printing state request";
const SET_PRINTING_STATE = "[reports] set printing state";

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const setPrintingStateAction = createAction(SET_PRINTING_STATE_REQUEST);

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

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* setPrintingStateWatcher({ payload }) {
  yield put({
    type: SET_PRINTING_STATE,
    payload: payload
  });
}

export function* reportSaga() {
  yield all([yield takeEvery(SET_PRINTING_STATE_REQUEST, setPrintingStateWatcher)]);
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
