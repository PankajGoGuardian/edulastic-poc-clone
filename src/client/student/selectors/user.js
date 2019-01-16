import { createSelector } from 'reselect';

const moduleName = 'user';
export const stateSelector = state => state[moduleName];

export const getUserSelector = createSelector(stateSelector, state => state);
