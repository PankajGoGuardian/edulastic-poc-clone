import { createSelector } from 'reselect';

export const stateSelector = state => state.question;
export const getQuestionSelector = createSelector(stateSelector, state => state.entity);
export const getQuestionDataSelector = createSelector(getQuestionSelector, state => state.data);
export const getQuestionAlignmentSelector = createSelector(
  getQuestionSelector,
  state => state.alignment
);


export const getValidationSelector = createSelector(
  getQuestionSelector,
  state => state.data.validation,
);
