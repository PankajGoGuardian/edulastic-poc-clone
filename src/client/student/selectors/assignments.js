import { keyBy, values } from 'lodash';
import { createSelector } from 'reselect';

const stateSelector = state => state.studentAssignments;

const assignmentsSelector = createSelector(
  stateSelector,
  state => state.assignments
);

const reportsSelector = state => state.studentReports.reports;

export const getAssignmentsSelector = createSelector(
  reportsSelector,
  assignmentsSelector,
  (reportsArray, assignmentsArray) => {
    // remove assignments with
    let assignments = assignmentsArray.filter(
      ({ endDate }) => new Date(endDate) > new Date()
    );
    assignments = keyBy(assignments, '_id');

    reportsArray.forEach(({ assignmentId, ...report }) => {
      if (assignments[assignmentId]) {
        assignments[assignmentId].reports = assignments[assignmentId].reports
          ? [...assignments[assignmentId].reports, report]
          : [report];
      }
    });
    return values(assignments);
  }
);
