import { createSelector } from 'reselect';
import { getQuestionsListSelector } from './questionsOrderList';

export const moduleName = 'preview';

export const stateSelector = state => state[moduleName];
export const getPreviewIndexesListSelector = createSelector(stateSelector, state => state.list);
export const getPreviewListSelector = createSelector(
  stateSelector,
  getQuestionsListSelector,
  (state, questions) => state.list.map(val => questions[val]),
);
export const getPreivewTabSelector = createSelector(stateSelector, state => state.previewTab);
