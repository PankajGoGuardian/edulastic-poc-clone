import { createSelector } from 'reselect';

export const moduleName = 'questionsOrderList';
export const getQuestionsStateSelector = state => state[moduleName];

export const getQuestionsListSelector = createSelector(
  getQuestionsStateSelector,
  state => state.list,
);
