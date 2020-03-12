import { createSelector } from "reselect";
import { groupBy } from "lodash";
import { getUserRole } from "./user";

export const stateSelector = state => state.author_assignments;

export const userSelector = state => state.user;

export const getEntitiesSelector = createSelector(
  stateSelector,
  state => state.entities
);

export const getAssignmentsSelector = createSelector(
  getEntitiesSelector,
  state => state.assignments || []
);

export const getAssignmentsSummary = createSelector(
  stateSelector,
  state => state.summaryEntities
);

export const getAssignmentClassList = createSelector(
  stateSelector,
  state => state.assignmentClassList
);

export const getAssignmentsByTestSelector = createSelector(
  getEntitiesSelector,
  state => groupBy(state.assignments, item => item.testId)
);

export const getTestsSelector = createSelector(
  getEntitiesSelector,
  getAssignmentsByTestSelector,
  (state, assignmentsById = {}) => {
    const { tests = [] } = state;
    tests.forEach((item, i) => {
      const createdDateArray = (assignmentsById?.[item._id] || []).map(item1 => item1.createdAt);
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

export const getDistrictIdSelector = createSelector(
  userSelector,
  state => state.user.orgData.districtId
);

export const getAssignmentViewSelector = createSelector(
  stateSelector,
  getUserRole,
  (state, role) => (role !== "teacher" ? true : false)
  //TODO for some sceneario we may use both advanced and simple views. We should make use of state.isAdvancedView for those cases
);

export const getAssignmentFilterSelector = createSelector(
  stateSelector,
  state => state.filter
);
