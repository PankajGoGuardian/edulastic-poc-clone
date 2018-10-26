import { createSelector } from 'reselect';

export const stateSelector = state => state.tests;

export const getTestsSelector = createSelector(stateSelector, state => state.entities);
export const getTestsLoadingSelector = createSelector(stateSelector, state => state.loading);
export const getTestsCreatingSelector = createSelector(stateSelector, state => state.creating);
export const getTestsPageSelector = createSelector(stateSelector, state => state.page);
export const getTestsLimitSelector = createSelector(stateSelector, state => state.limit);
export const getTestsCountSelector = createSelector(stateSelector, state => state.count);
