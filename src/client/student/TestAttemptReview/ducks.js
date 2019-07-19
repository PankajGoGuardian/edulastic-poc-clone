import { createSelector } from "reselect";
import { questionType } from "@edulastic/constants";
import { get } from "lodash";

// selectors
export const answersSelector = state => state.answers;
export const itemsSelector = state => state.test.items || [];
export const bookmarksSelector = state => state.assessmentBookmarks || {};

export const attemptSummarySelector = createSelector(
  itemsSelector,
  answersSelector,
  bookmarksSelector,
  (items, answers, bookmarks) => {
    const blocks = {};
    const allQids = [];
    const nonQuestionTypes = [questionType.VIDEO, questionType.PASSAGE];
    for (const item of items) {
      const qids = get(item, "data.questions", [])
        .filter(x => !nonQuestionTypes.includes(x.type))
        .map(x => x.id);
      const firstQid = qids[0];
      const bookmarked = bookmarks[item._id];
      /**
       * considering attempted only if all the questions of an item attempted
       */
      const attempted = qids.every(x => answers[x]);
      if (bookmarked) {
        blocks[firstQid] = 2;
      } else {
        blocks[firstQid] = attempted ? 1 : 0;
      }
      //to ensure the order
      allQids.push(firstQid);
    }
    // eslint-enable
    return { allQids, blocks };
  }
);
