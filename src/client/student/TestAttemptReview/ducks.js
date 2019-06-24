import { createSelector } from "reselect";
import { questionType } from "@edulastic/constants";

// selectors
export const answersSelector = state => state.answers;
export const itemsSelector = state => state.test.items || [];

export const attemptSummarySelector = createSelector(
  itemsSelector,
  answersSelector,
  (items, answers) => {
    const questions = {};
    // eslint-disable
    for (const item of items) {
      if (item && item.data && item.data.questions) {
        for (const { id: qId, type } of item.data.questions) {
          if (type === questionType.VIDEO || type === questionType.PASSAGE) {
            continue;
          }

          if (item.reviewLater) {
            questions[qId] = 2;
          } else {
            questions[qId] = answers[qId] ? 1 : 0;
          }
        }
      }
    }
    // eslint-enable
    return questions;
  }
);
