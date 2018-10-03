import { createSelector } from 'reselect';

export const stateSelector = state => state.itemDetail;

export const getItemDetailSelector = createSelector(stateSelector, state => state.item);
export const getItemDetailLoadingSelector = createSelector(stateSelector, state => state.loading);
