import { createSelector } from "reselect";
import { flatten } from "lodash";

export const stateSelector = state => state.folder;

export const getFoldersSelector = createSelector(
  stateSelector,
  state => state.entities
);

export const getFolderSelector = createSelector(
  stateSelector,
  state => state.entity || {}
);

export const getSelectedItems = createSelector(
  stateSelector,
  state => state.selectedItems || []
);

export const isOpenAddItemsModalSelector = createSelector(
  stateSelector,
  state => state.isOpenAddItemModal
);

export const isOpenRemovalModalSelector = createSelector(
  stateSelector,
  state => state.isOpenRemovalModal
);

export const getItemsInFolders = createSelector(
  stateSelector,
  state => flatten(state.entities.map(f => f.content.map(c => c._id)))
);
