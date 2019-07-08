import { createSelector } from "redux-starter-kit";

const itemsSelector = state => state.test.items;
const bookmarksSelector = state => state.assessmentBookmarks;

export const bookmarksByIndexSelector = createSelector(
  [itemsSelector, bookmarksSelector],
  (items, bookmarks) => {
    const bookmarksInOrder = items.map(item => !!bookmarks[item._id]);
    return bookmarksInOrder;
  }
);
