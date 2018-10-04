import { createSelector } from 'reselect';

export const stateSelector = state => state.itemDetail;

export const getItemDetailSelector = createSelector(stateSelector, state => state.item);

export const getItemDetailRowsSelector = createSelector(getItemDetailSelector, (item) => {
  if (!item) return [];
  return item.rows.map(row => ({
    ...row,
    widgets: row.widgets.map((widget) => {
      let referencePopulate = null;

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
});

export const getItemDetailLoadingSelector = createSelector(stateSelector, state => state.loading);
