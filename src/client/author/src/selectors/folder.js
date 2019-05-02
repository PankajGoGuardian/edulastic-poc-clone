import { createSelector } from "reselect";

export const stateSelector = state => state.folder;

export const getFoldersSelector = createSelector(
  stateSelector,
  state => state.entities
);
