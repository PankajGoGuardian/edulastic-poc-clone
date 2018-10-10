import { createSelector } from 'reselect';

export const stateSelector = state => state.testItems;

export const getTestItemsSelector = createSelector(stateSelector, state => state.items);
export const getItemsLoadingSelector = createSelector(stateSelector, state => state.loading);
