import { createSelector } from 'reselect';

export const stateSelector = state => state.testItems;

export const getTestItemsSelector = createSelector(stateSelector, state => state.items);
export const getItemsLoadingSelector = createSelector(stateSelector, state => state.loading);

export const getItemsTypesSelector = createSelector(getTestItemsSelector, (state) => {
  const result = {};

  state.forEach((item) => {
    const types = item.rows.reduce(
      (acc, row) => [...acc, ...row.widgets.map(({ title }) => title)],
      [],
    );

    result[item.id] = [...new Set(types)];
  });

  return result;
});
