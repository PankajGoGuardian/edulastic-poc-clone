import { createSelector } from 'reselect';

export const stateSelector = state => state.itemDetail;

export const getItemDetailSelector = createSelector(
  stateSelector,
  state => state.item
);

export const getItemDetailRowsSelector = createSelector(
  getItemDetailSelector,
  (item) => {
    if (!item) return [];
    return item.rows.map(row => ({
      ...row,
      widgets: row.widgets.map((widget) => {
        let referencePopulate = {
          data: null
        };

        if (item.data.questions && item.data.questions.length) {
          referencePopulate = item.data.questions.find(
            q => q._id === widget.reference
          );
        }

        if (
          !referencePopulate &&
          item.data.resources &&
          item.data.resources.length
        ) {
          referencePopulate = item.data.resources.find(
            r => r._id === widget.reference
          );
        }

        return {
          ...widget,
          referencePopulate
        };
      })
    }));
  }
);

export const getItemDetailLoadingSelector = createSelector(
  stateSelector,
  state => state.loading
);
export const getItemDetailUpdatingSelector = createSelector(
  stateSelector,
  state => state.updating
);
export const getItemDetailDraggingSelector = createSelector(
  stateSelector,
  state => state.dragging
);

export const getItemDetailDimensionTypeSelector = createSelector(
  getItemDetailSelector,
  (state) => {
    if (!state) return '';
    const left = state.rows[0].dimension.trim().slice(0, -1);
    const right = state.rows[1]
      ? state.rows[1].dimension.trim().slice(0, -1)
      : '100';
    return `${left}-${right}`;
  }
);

export const getItemDetailValidationSelector = createSelector(
  getItemDetailSelector,
  (state) => {
    const { questions } = state.data;
    const validations = {};
    questions.forEach(({ _id, data }) => {
      validations[_id] = {
        ...data
      };
    });
    return validations;
  }
);
