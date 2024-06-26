import { createSelector } from "reselect";
import { questionType } from "@edulastic/constants";
import { get, isEmpty } from "lodash";
import { hasValidAnswers, hasUserWork } from "../../assessment/utils/answer";
import { userWorkSelector } from "../sharedDucks/TestItem";

// selectors
export const answersSelector = state => state.answers;
export const itemsSelector = state => state.test.items || [];
export const bookmarksSelector = state => state.assessmentBookmarks || {};

export const attemptSummarySelector = createSelector(
  itemsSelector,
  answersSelector,
  bookmarksSelector,
  userWorkSelector,
  (items, answers, bookmarks, userWork) => {
    const blocks = {};
    const allQids = [];
    const itemWiseQids = {};
    const nonQuestionTypes = [questionType.VIDEO, questionType.PASSAGE, questionType.SECTION_LABEL, questionType.TEXT];
    for (const [index, item] of items.entries()) {
      const questions = get(item, "data.questions", [])
        .filter(x => !nonQuestionTypes.includes(x.type))
        .map(x => ({ id: x.id, type: x.type }));

      if (!questions.length) {
        // dummy data to skip question (instruction)
        const noQuestion = `no_question_${index}`;
        allQids.push(noQuestion);
        itemWiseQids[item._id] = [noQuestion];
        blocks[noQuestion] = 0;
        continue;
      }
      const userWorkUsed = hasUserWork(item._id, userWork);
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
          blocks[firstQid] = userWorkUsed || attempted ? 1 : 0;
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
            blocks[q.id] = userWorkUsed || attempted ? 1 : 0;
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
