import { createSelector } from 'reselect'
import { GROUP_TYPE } from '@edulastic/constants/const/report'
import {
  ADVANCED_SEARCH_DATA,
  ADVANCED_SEARCH_DETAILS,
  ADVANCED_SEARCH_QUERY,
  fieldKey,
} from './constants'

import { getUniqOptionsHelper } from './helpers'
import { reduxNamespaceKey } from './actionReducers'

const stateSelector = (state) => state.reportReducer[reduxNamespaceKey]

// form selectors
const formSelector = createSelector(stateSelector, (state) => state.form)
const formStatus = createSelector(formSelector, (state) => state.status)
const isFormDataSaving = createSelector(formSelector, (state) => state.isSaving)

// goals selectors
const goalsSelector = createSelector(stateSelector, (state) => state.goals)
const isGoalsDataLoading = createSelector(
  goalsSelector,
  (state) => state.isLoading
)
const goalsList = createSelector(goalsSelector, (state) => state.list)
const relatedInterventions = createSelector(
  goalsSelector,
  (state) => state.interventions
)

// interventions selectors
const interventionsSelector = createSelector(
  stateSelector,
  (state) => state.interventions
)
const isInterventionsDataLoading = createSelector(
  interventionsSelector,
  (state) => state.isLoading
)
const interventionsList = createSelector(
  interventionsSelector,
  (state) => state.list
)

// group selector
const groupSelector = (state) => state.authorGroups
const isGroupLoading = createSelector(groupSelector, (state) => state.isLoading)
const groupList = createSelector(groupSelector, (state) =>
  state.groups
    .filter(({ type }) => type === GROUP_TYPE.CUSTOM)
    .sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt))
)

// attendance band selector
const attendanceBandSelector = createSelector(
  stateSelector,
  (state) => state.attendanceBand
)
const isAttendanceBandLoading = createSelector(
  attendanceBandSelector,
  (state) => state.isLoading
)
const attendanceBandList = createSelector(
  attendanceBandSelector,
  (state) => state.list
)

const getAdvancedSearchDetailsSelector = createSelector(
  stateSelector,
  (state) => state[ADVANCED_SEARCH_DETAILS] || {}
)

const getAdvancedSearchClassesSelector = createSelector(
  getAdvancedSearchDetailsSelector,
  (state) => getUniqOptionsHelper(state[fieldKey.classes])
)

const getAdvancedSearchSchoolsSelector = createSelector(
  getAdvancedSearchDetailsSelector,
  (state) => getUniqOptionsHelper(state[fieldKey.schools])
)

const getAdvancedSearchCoursesSelector = createSelector(
  getAdvancedSearchDetailsSelector,
  (state) => getUniqOptionsHelper(state[fieldKey.courses])
)

const getAdvancedSearchAttendanceBandSelector = createSelector(
  getAdvancedSearchDetailsSelector,
  (state) => getUniqOptionsHelper(state[fieldKey.attendanceBands])
)

const isAttendanceBandLoadingSelector = createSelector(
  getAdvancedSearchDetailsSelector,
  (state) => state[fieldKey.attendanceBands].isLoading
)

const getAdvancedSearchFilterSelector = createSelector(
  stateSelector,
  (state) => state[ADVANCED_SEARCH_QUERY]
)
const getAdvanceSearchStudentsData = createSelector(
  stateSelector,
  (state) => state[ADVANCED_SEARCH_DATA].data
)

const isGroupSavingSelector = createSelector(
  stateSelector,
  (state) => state.group.isLoading
)
const groupStatusSelector = createSelector(
  stateSelector,
  (state) => state.group.status
)
const isAdvancedSearchLoading = createSelector(
  stateSelector,
  (state) => state[ADVANCED_SEARCH_DATA].isLoading
)

export {
  isFormDataSaving,
  formStatus,
  isGoalsDataLoading,
  goalsList,
  groupSelector,
  isGroupLoading,
  groupList,
  isInterventionsDataLoading,
  interventionsList,
  isAttendanceBandLoading,
  attendanceBandList,
  relatedInterventions,
  getAdvancedSearchDetailsSelector,
  getAdvancedSearchClassesSelector,
  getAdvancedSearchSchoolsSelector,
  getAdvancedSearchCoursesSelector,
  getAdvancedSearchAttendanceBandSelector,
  isAttendanceBandLoadingSelector,
  getAdvancedSearchFilterSelector,
  getAdvanceSearchStudentsData,
  isGroupSavingSelector,
  groupStatusSelector,
  isAdvancedSearchLoading,
}
