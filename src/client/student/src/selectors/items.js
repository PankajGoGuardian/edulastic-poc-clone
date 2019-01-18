import { createSelector } from 'reselect';

const moduleName = 'studentItems';

export const stateSelector = state => state[moduleName];

export const getItemsSelector = createSelector(
  stateSelector,
  state => state.items
);

export const getCurrentItemSelector = createSelector(
  stateSelector,
  state => state.current
);

export const getItemCountSelector = createSelector(
  stateSelector,
  state => (state.items && state.items.length) || 0
);

export const getItemSelector = createSelector(
  getItemsSelector,
  getCurrentItemSelector,
  (state, current) => state[current]
);

export const getTestItemQuestions = (item) => {
  let widgets = [];
  let questionList = [];
  if (item && item.rows) {
    item.rows.forEach((row) => {
      widgets = [...widgets, ...row.widgets];
    });
    widgets.forEach((widget) => {
      questionList = [...questionList, widget.entity];
    });
  }
  return questionList;
};

export const getQuestionsSelector = createSelector(
  getItemSelector,
  item => getTestItemQuestions(item)
);
