import { createSelector } from 'reselect';

export const stateSelector = state => state.test;
export const answersSelector = state => state.answers;

export const itemsSelector = createSelector(
  stateSelector,
  state => state.items || []
);

// s
export const attemptSummarySelector = createSelector(
  itemsSelector,
  answersSelector,
  (items, answers) => {
    const questions = {};
    // eslint-disable
    for (const item of items) {
      if (item && item.rows) {
        item.rows.forEach((row) => {
          row.widgets.forEach((widget) => {
            const qId = widget.entity && widget.entity.id;
            if (!qId) return;

            if (item.reviewLater) {
              questions[qId] = 2;
            } else {
              questions[qId] = answers[qId] ? 1 : 0;
            }
          });
        });
      }
    }
    // eslint-enable
    return questions;
  }
);
