import * as moment from "moment";
import { get } from "lodash";
import { createSelector } from "reselect";

export const FETCH_ASSIGNMENTS = "[assignments] fetch assignments";
export const SAVE_ASSIGNMENT = "[assignments] save assignment";

export const fetchAssignmentsAction = payload => ({
  type: FETCH_ASSIGNMENTS,
  payload
});

export const saveAssignmentAction = payload => ({
  type: SAVE_ASSIGNMENT,
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
