import { createSelector } from 'reselect';

export const stateSelector = state => state.tests;

export const getTestsSelector = createSelector(stateSelector, state => state.entities);
export const getTestSelector = createSelector(stateSelector, state => state.entity);
export const getTestsLoadingSelector = createSelector(stateSelector, state => state.loading);
export const getTestsCreatingSelector = createSelector(stateSelector, state => state.creating);
export const getTestsPageSelector = createSelector(stateSelector, state => state.page);
export const getTestsLimitSelector = createSelector(stateSelector, state => state.limit);
export const getTestsCountSelector = createSelector(stateSelector, state => state.count);

export const getTestItemsRowsSelector = createSelector(getTestSelector, test =>
  test.testItems.map((item) => {
    if (!item) return [];
    return item.rows.map(row => ({
      ...row,
      widgets: row.widgets.map((widget) => {
        let referencePopulate = {
          data: null,
        };

        if (item.data.questions && item.data.questions.length) {
          referencePopulate = item.data.questions.find(q => q.id === widget.reference);
        }

        if (!referencePopulate && item.data.resources && item.data.resources.length) {
          referencePopulate = item.data.resources.find(r => r.id === widget.reference);
        }

        return {
          ...widget,
          referencePopulate,
        };
      }),
    }));
  }));
