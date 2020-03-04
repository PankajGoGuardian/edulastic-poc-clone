import { createAction, createReducer } from "redux-starter-kit";
import { uniq } from "lodash";
import { schema } from "normalizr";
import { createSelector } from "reselect";

// reports schema
export const reportSchema = new schema.Entity("reports", {}, { idAttribute: "_id" });

// types
export const SET_REPORTS = "[studentReport] fetch reports";
export const UPDATE_TEST_ACTIVITY = "[studentReport] update reports";
export const SET_CURRENT_REPORT = "[studentReport] set current testActivityId";
export const SET_FILTER = "[studentReport] set filter";
export const ADD_REPORT_REALTIME = "[studentAssignment] add report realtime";
export const SET_TESTACTIVITY = "[studentReport] set current testActivity";
export const SET_PASSAGES_DATA = "[studentReport] set passages data";

// actions
export const setReportsAction = createAction(SET_REPORTS);
export const updateTestActivityAction = createAction(UPDATE_TEST_ACTIVITY);
export const setCurrentReportAction = createAction(SET_CURRENT_REPORT);
export const setFilterAction = createAction(SET_FILTER);
export const addRealtimeReportAction = createAction(ADD_REPORT_REALTIME);
export const setTestActivityAction = createAction(SET_TESTACTIVITY);
export const setPassagesDataAction = createAction(SET_PASSAGES_DATA);

// initialState
const initialState = {
  byId: {},
  allIds: [],
  current: "",
  testActivity: {},
  passages: [],
  filter: "all"
};

// reducers

// load reports to store.
const setReports = (state, { payload }) => {
  if (payload.reportsObj) {
    state.byId = payload.reportsObj;
  }
  if (payload.allReports) {
    state.allIds = payload.allReports;
  }

  if (payload.allReports?.length === 0 && !payload.reportsObj) {
    state.byId = {};
  }
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

// filtering reports
const setFilter = (state, { payload }) => {
  state.filter = payload;
};

const setTestActivity = (state, { payload }) => {
  state.testActivity = payload;
};

const setPassagesData = (state, { payload }) => {
  state.passages = payload;
};

export default createReducer(initialState, {
  [SET_REPORTS]: setReports,
  [SET_CURRENT_REPORT]: setCurrentReport,
  [UPDATE_TEST_ACTIVITY]: updateReports,
  [SET_FILTER]: setFilter,
  [SET_TESTACTIVITY]: setTestActivity,
  [SET_PASSAGES_DATA]: setPassagesData,
  [ADD_REPORT_REALTIME]: (state, { payload: report }) => {
    if (Array.isArray(report)) {
      for (let el of report) {
        state.byId[el._id] = el;
      }
      if (report.length === 1) {
        // a tiny common usecase performance optimisation
        if (!state.allIds.includes(report[0]._id)) {
          state.allIds.push(report[0]._id);
        }
      } else {
        state.allIds.push(...report.map(x => x._id));
        state.allIds = uniq(state.allIds);
      }
    } else {
      state.byId[report._id] = report;
      if (!state.allIds.includes(report._id)) {
        state.allIds.push(report._id);
      }
    }
  }
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
