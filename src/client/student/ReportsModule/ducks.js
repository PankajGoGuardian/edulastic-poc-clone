import { createAction, createReducer } from 'redux-starter-kit';
import { schema } from 'normalizr';
import { createSelector } from 'reselect';

// reports schema
export const reportSchema = new schema.Entity(
  'reports',
  {},
  { idAttribute: '_id' }
);

// types
export const SET_REPORTS = '[studentReport] fetch reports';
export const UPDATE_TEST_ACTIVITY = '[studentReport] update reports';
export const SET_CURRENT_REPORT = '[studentReport] set current testActivityId';

// actions
export const setReportsAction = createAction(SET_REPORTS);
export const updateTestActivityAction = createAction(UPDATE_TEST_ACTIVITY);
export const setCurrentReportAction = createAction(SET_CURRENT_REPORT);
// initialState
const initialState = {
  byId: {},
  allIds: [],
  current: ''
};

// reducers

// load reports to store.
const setReports = (state, { payload }) => {
  state.byId = payload.reportsObj;
  state.allIds = payload.allReports;
};

const updateReports = (state, { payload }) => {
  for (let id of Object.keys(payload)) {
    state.byId[id] = payload[id];
  }
};

// load current report to store
const setCurrentReport = (state, { payload }) => {
  state.current = payload.testActivityId;
};

export default createReducer(initialState, {
  [SET_REPORTS]: setReports,
  [SET_CURRENT_REPORT]: setCurrentReport,
  [UPDATE_TEST_ACTIVITY]: updateReports
});

//selector
const stateSelector = state => state.studentReport;

const getAllReportsSelector = createSelector(
  stateSelector,
  state => state.byId
);

export const getReportByIdSelector = id =>
  createSelector(
    getAllReportsSelector,
    reportsobj => reportsobj[id]
  );
