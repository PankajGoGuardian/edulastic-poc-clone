import { createSelector } from 'reselect';

export const stateSelector = state => state.question;
export const getQuestionSelector = createSelector(stateSelector, state => state.entity);
