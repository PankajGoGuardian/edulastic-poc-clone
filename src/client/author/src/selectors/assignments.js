import { createSelector } from "reselect";
import { groupBy } from "lodash";

export const stateSelector = state => state.author_assignments;

export const getEntitiesSelector = createSelector(
  stateSelector,
  state => state.entities
);

export const getAssignmentsByTestSelector = createSelector(
  getEntitiesSelector,
  state => groupBy(state.assignments, item => item.testId)
);

export const getTestsSelector = createSelector(
  getEntitiesSelector,
  getAssignmentsByTestSelector,
  (state, assignmentsById) => {
    const { tests = [] } = state;
    tests.forEach((item, i) => {
      const createdDateArray = assignmentsById[item._id].map(item => item.createdAt);
      const lastAssigned = Math.max.apply(null, createdDateArray);
      tests[i] = { ...tests[i], lastAssigned };
    });
    return tests.sort((a, b) => b.lastAssigned - a.lastAssigned);
  }
);

export const getAssignmentsLoadingSelector = createSelector(
  stateSelector,
  state => state.loading
);

export const getCurrentAssignmentSelector = createSelector(
  stateSelector,
  state => state.currentAssignment
);

export const getToggleReleaseGradeStateSelector = createSelector(
  stateSelector,
  state => state.toggleReleaseGradeSettings
);
