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
    let itemWiseQids = {};
    const nonQuestionTypes = [questionType.VIDEO, questionType.PASSAGE, questionType.SECTION_LABEL];
    for (const item of items) {
      const qids = get(item, "data.questions", [])
        .filter(x => !nonQuestionTypes.includes(x.type))
        .map(x => x.id);
      const firstQid = qids[0];
      const bookmarked = bookmarks[item._id];
      /**
       * considering attempted if any one question in an item attempted
       */
      if (item.itemLevelScoring) {
        const attempted = qids.some(x => answers[x]);
        if (bookmarked) {
          blocks[firstQid] = 2;
        } else {
          blocks[firstQid] = attempted ? 1 : 0;
        }
        //to ensure the order
        allQids.push(firstQid);
        itemWiseQids[item._id] = [firstQid];
      } else {
        qids.forEach(qid => {
          const attempted = !!answers[qid];
          if (bookmarked) {
            blocks[qid] = 2;
          } else {
            blocks[qid] = attempted ? 1 : 0;
          }
        });
        allQids.push(...qids);
        itemWiseQids[item._id] = qids;
      }
    }
    // eslint-enable
    return { allQids, blocks, itemWiseQids };
  }
);

export const QuestionsLeftToAttemptSelector = createSelector(
  attemptSummarySelector,
  ({ blocks }) => {
    return Object.values(blocks).filter(_o => !_o).length;
  }
);
