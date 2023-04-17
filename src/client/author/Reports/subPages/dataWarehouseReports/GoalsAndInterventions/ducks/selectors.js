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

export { isFormDataSaving, isGoalsDataLoading, goalsList }
