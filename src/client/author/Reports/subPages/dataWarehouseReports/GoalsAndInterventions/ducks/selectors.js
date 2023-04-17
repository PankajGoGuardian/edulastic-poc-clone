import { createSelector } from 'reselect'
import { reduxNamespaceKey } from './actionReducers'

const stateSelector = (state) => state.reportReducer[reduxNamespaceKey]

// form selectors
const formSelector = createSelector(stateSelector, (state) => state.form)
const isFormDataSaving = createSelector(formSelector, (state) => state.isSaving)

export { isFormDataSaving }
