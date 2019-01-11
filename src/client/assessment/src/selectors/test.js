import { createSelector } from 'reselect';

const stateSelector = state => state.test;

export const currentItemIndexSelector = createSelector(
  stateSelector,
  state => state.currentItem
);

export const itemsSelector = createSelector(
  stateSelector,
  state => state.items
);

export const currentItemSelector = createSelector(
  itemsSelector,
  currentItemIndexSelector,
  (items, index) => items[index]
);

export const itemQuestionsSelector = createSelector(
  currentItemSelector,
  (item) => {
    const questions = [];
    item.rows.forEach((row) => {
      row.widgets.forEach((widget) => {
        const qid = widget.entity && widget.entity.id;
        questions.push(qid);
      });
    });
    return questions;
  }
);
