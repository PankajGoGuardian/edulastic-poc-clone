import { createSelector } from "reselect";
import { questionType } from "@edulastic/constants";
import { get, isEmpty } from "lodash";
import { hasValidAnswers } from "../../assessment/utils/answer";

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
    const itemWiseQids = {};
    const nonQuestionTypes = [questionType.VIDEO, questionType.PASSAGE, questionType.SECTION_LABEL, questionType.TEXT];
    for (const item of items) {
      const questions = get(item, "data.questions", [])
        .filter(x => !nonQuestionTypes.includes(x.type))
        .map(x => ({ id: x.id, type: x.type }));
      const firstQid = questions[0].id;
      const bookmarked = bookmarks[item._id];
      /**
       * considering attempted if any one question in an item attempted
       */
      if (item.itemLevelScoring) {
        const attempted = questions.some(q => hasValidAnswers(q.type, answers[q.id]));
        if (bookmarked) {
          blocks[firstQid] = 2;
        } else {
          blocks[firstQid] = attempted ? 1 : 0;
        }
        // to ensure the order
        allQids.push(firstQid);
        itemWiseQids[item._id] = [firstQid];
      } else {
        questions.forEach(q => {
          const attempted = hasValidAnswers(q.type, answers[q.id]);
          if (bookmarked) {
            blocks[q.id] = 2;
          } else {
            blocks[q.id] = attempted ? 1 : 0;
          }
        });
        allQids.concat(questions.map(q => q.id));
        itemWiseQids[item._id] = questions.map(q => q.id);
      }
    }
    // eslint-enable
    return { allQids, blocks, itemWiseQids };
  }
);

export const unansweredQuestionCountSelector = createSelector(
  itemsSelector,
  answersSelector,
  (items, answers) => {
    const questionsByItemId = {};
    const answerToArray = Object.keys(answers).filter(_o => answers[_o] && !isEmpty(answers[_o]));
    let totalAnsweredItems = 0;
    for (const item of items) {
      questionsByItemId[item._id] = item.data.questions.filter(q => answerToArray.includes(q.id));
      if (questionsByItemId[item._id]?.length) {
        totalAnsweredItems++;
      }
    }
    return items.length - totalAnsweredItems;
  }
);
