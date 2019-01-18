import { createAction, createReducer } from 'redux-starter-kit';
import { schema } from 'normalizr';

// reports schema
export const reportSchema = new schema.Entity(
  'reports',
  {},
  { idAttribute: '_id' }
);

// types
export const SET_REPORTS = '[studentReport] fetch reports';

// actions
export const setReportsAction = createAction(SET_REPORTS);

// initialState
const initialState = {
  byId: {},
  allIds: []
};

// reducers

// load reports to store.
const setReports = (state, { payload }) => {
  state.byId = payload.reportsObj;
  state.allIds = payload.allReports;
};

export default createReducer(initialState, {
  [SET_REPORTS]: setReports
});
