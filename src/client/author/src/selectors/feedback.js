import { createSelector } from "reselect";

export const stateSelector = state => state.feedbackResponse;

export const getFeedbackResponseSelector = createSelector(
  stateSelector,
  state => state.data
);

export const getStatus = createSelector(
  stateSelector,
  state => state.loading
);

export const getErrorResponse = createSelector(
  stateSelector,
  state => state.error
);
