import * as moment from "moment";
import { createSelector } from "reselect";

export const FETCH_ASSIGNMENTS = "[assignments] fetch assignments";

export const fetchAssignmentsAction = payload => ({
  type: FETCH_ASSIGNMENTS,
  payload
});

// selectors
const module = "authorTestAssignments";
const currentSelector = state => state[module].current;

export const testsSelector = state => state.tests;

export const getAssignmentsSelector = state => state[module].assignments;
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
      class: [],
      specificStudents: false
    };
  }
);

export const getTestEntitySelector = createSelector(
  testsSelector,
  state => state.entity
);
