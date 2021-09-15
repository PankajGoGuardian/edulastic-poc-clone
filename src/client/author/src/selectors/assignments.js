import { createSelector } from 'reselect'
import { groupBy, get as _get } from 'lodash'
import { getUserRole } from './user'

export const stateSelector = (state) => state.author_assignments

export const userSelector = (state) => state.user

export const getEntitiesSelector = createSelector(
  stateSelector,
  (state) => state.entities
)

export const getAssignmentsSelector = createSelector(
  getEntitiesSelector,
  (state) => state.assignments || []
)

export const getAssignmentTestsSelector = createSelector(
  getEntitiesSelector,
  (state) => state.tests || []
)

export const getAssignmentsSummary = createSelector(
  stateSelector,
  (state) => state.summaryEntities
)

export const getAssignmentTeacherList = createSelector(
  stateSelector,
  (state) => state.teacherList
)

export const getAssignmentTestList = createSelector(
  stateSelector,
  (state) => state.testsList
)

export const getAssignmentClassList = createSelector(
  stateSelector,
  (state) => state.assignmentClassList
)

export const getCurrentTestSelector = createSelector(
  stateSelector,
  (state) => state.currentTest
)

export const getAssignmentsByTestSelector = createSelector(
  getEntitiesSelector,
  (state) => groupBy(state.assignments, (item) => item.testId)
)

export const getBulkActionStatusSelector = createSelector(
  stateSelector,
  (state) => state.bulkActionInprogress
)

export const getBulkActionTypeSelector = createSelector(
  stateSelector,
  (state) => state.bulkActionType
)

export const getTestsSelector = createSelector(
  getEntitiesSelector,
  getAssignmentsByTestSelector,
  (state, assignmentsById = {}) => {
    const { tests = [] } = state
    tests.forEach((item, i) => {
      const createdDateArray = (assignmentsById?.[item._id] || []).map(
        (item1) => item1.createdAt
      )
      const lastAssigned = Math.max.apply(null, createdDateArray)
      tests[i] = { ...tests[i], lastAssigned }
    })
    return tests.sort((a, b) => b.lastAssigned - a.lastAssigned)
  }
)

export const getAssignmentsLoadingSelector = createSelector(
  stateSelector,
  (state) => state.loading
)

export const getCurrentAssignmentSelector = createSelector(
  stateSelector,
  (state) => state.currentAssignment
)

export const getToggleReleaseGradeStateSelector = createSelector(
  stateSelector,
  (state) => state.toggleReleaseGradeSettings
)

export const getToggleStudentReportCardStateSelector = createSelector(
  stateSelector,
  (state) => state.toggleStudentReportCardSettings
)

export const getAssignmentViewSelector = createSelector(
  stateSelector,
  getUserRole,
  (state, role) => role !== 'teacher'
  // TODO for some sceneario we may use both advanced and simple views. We should make use of state.isAdvancedView for those cases
)

export const getAssignmentFilterSelector = createSelector(
  stateSelector,
  (state) => state.filter
)

export const getAssignmentSyncInProgress = createSelector(
  stateSelector,
  (state) => state.syncWithGoogleClassroomInProgress
)

export const getShareWithGCInProgress = createSelector(
  stateSelector,
  (state) => state.shareWithGCInProgress
)

export const getSchoologyAssignmentSyncInProgress = createSelector(
  stateSelector,
  (state) => state.syncWithSchoologyClassroomInProgress
)

export const getTagsUpdatingStateSelector = createSelector(
  stateSelector,
  (state) => state.tagsUpdatingState
)
