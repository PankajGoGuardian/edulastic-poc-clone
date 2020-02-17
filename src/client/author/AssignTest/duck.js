import * as moment from "moment";
import { get } from "lodash";
import { createSelector } from "reselect";
import { createReducer } from "redux-starter-kit";

export const FETCH_ASSIGNMENTS = "[assignments] fetch assignments";
export const UPDATE_ASSIGNMENT_SETTINGS = "[assignment settings] update assignment settings";

export const fetchAssignmentsAction = payload => ({
  type: FETCH_ASSIGNMENTS,
  payload
});

export const updateAssingnmentSettingsAction = payload => ({
  type: UPDATE_ASSIGNMENT_SETTINGS,
  payload
});

// selectors
const module = "authorTestAssignments";
const currentSelector = state => state[module].current;

export const testsSelector = state => state.tests;

export const getAssignmentsSelector = state => state[module].assignments;

const classesData = state => state.classesReducer.data;

export const getClassListSelector = createSelector(
  classesData,
  classes =>
    Object.values(classes || {}).map(item => ({
      _id: item._id,
      ...item._source
    }))
);

export const getCurrentAssignmentSelector = createSelector(
  currentSelector,
  getAssignmentsSelector,
  (current, assignments) => {
    if (current && current !== "new") {
      const assignment = assignments.filter(item => item._id === current)[0];
      return assignment;
    }
    return {
      startDate: moment(),
      endDate: moment().add("days", 7),
      openPolicy: "Automatically on Start Date",
      closePolicy: "Automatically on Due Date",
      class: []
    };
  }
);

export const getTestEntitySelector = createSelector(
  testsSelector,
  state => state.entity
);

const statePerformanceBandSelector = state => state.performanceBandReducer;

export const performanceBandSelector = createSelector(
  statePerformanceBandSelector,
  performanceBandDistrict => {
    return get(performanceBandDistrict, "profiles", []);
  }
);

// ======================assingnment settings========================//

const initialState = {};

const updateAssignmentSettings = (state, { payload }) => {
  return { ...state, ...payload };
};

export const assignmentSettings = createReducer(initialState, {
  [UPDATE_ASSIGNMENT_SETTINGS]: updateAssignmentSettings
});
