// @ts-check
import { sortTestItemQuestions } from "../author/dataUtils";

const alphabets = "abcdefghijklmnopqrstuvwxyz".split("");

/**
 * This method modifies testItems and adds qLabel, barLabel
 * @param {{data:{questions:Object[]},itemLevelScoring?:boolean, itemLevelScore: number}[]}_testItemsData
 */
export const markQuestionLabel = _testItemsData => {
  const sortedTestItems = sortTestItemQuestions(_testItemsData);
  for (const [i, item] of sortedTestItems.entries()) {
    if (!(item.data && item.data.questions)) {
      continue;
    }
    if (item.data.questions.length === 1) {
      item.data.questions[0].qLabel = i + 1;
      item.data.questions[0].qSubLabel = "";
      item.data.questions[0].barLabel = `Q${i + 1}`;
    } else {
      item.data.questions = item.data.questions.map((q, qIndex) => ({
        ...q,
        qLabel: qIndex === 0 ? i + 1 : "",
        qSubLabel: alphabets[qIndex],
        barLabel: item.itemLevelScoring ? `Q${i + 1}` : `Q${i + 1}.${alphabets[qIndex]}`
      }));
    }
  }
};
