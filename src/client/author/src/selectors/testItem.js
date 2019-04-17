import { createSelector } from "reselect";

export const stateSelector = state => state.testItem;

export const getTestItemSelector = createSelector(
  stateSelector,
  state => state.item
);
export const getTestItemCreatingSelector = createSelector(
  stateSelector,
  state => state.creating
);
export const getTestItemErrorSelector = createSelector(
  stateSelector,
  state => state.createError
);

export const getCreateItemModalVisibleSelector = createSelector(
  stateSelector,
  state => state.createItemModalVisible
);

export const getCreateItemModalItemIdSelector = createSelector(
  stateSelector,
  state => state.modalItemId
);
