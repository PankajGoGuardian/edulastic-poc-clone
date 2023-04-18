import { createSelector } from 'reselect'
import { reduxNamespaceKey } from './actionReducers'

const stateSelector = (state) => state.reportReducer[reduxNamespaceKey]

// form selectors
const formSelector = createSelector(stateSelector, (state) => state.form)
const isFormDataSaving = createSelector(formSelector, (state) => state.isSaving)

// goals selectors
const goalsSelector = createSelector(stateSelector, (state) => state.goals)
const isGoalsDataLoading = createSelector(
  goalsSelector,
  (state) => state.isLoading
)
const goalsList = createSelector(goalsSelector, (state) => state.list)

// group selector
const groupSelector = createSelector(stateSelector, (state) => state.group)
const isGroupLoading = createSelector(groupSelector, (state) => state.isLoading)
const groupList = createSelector(groupSelector, (state) => state.list)

export {
  isFormDataSaving,
  isGoalsDataLoading,
  goalsList,
  groupSelector,
  isGroupLoading,
  groupList,
}
