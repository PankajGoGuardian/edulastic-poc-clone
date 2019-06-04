import { isArray } from "lodash";
import evaluators from "./evaluators";
import { replaceVariables } from "../../../assessment/utils/variables";

export const evaluateItem = async (answers, validations, itemLevelScoring = false, itemLevelScore = 0) => {
  const answerIds = Object.keys(answers);
  const results = {};
  let totalScore = 0;
  let totalMaxScore = itemLevelScoring ? itemLevelScore : 0;
  let correctNum = 0;

  /* eslint-disable no-restricted-syntax */
  for (const id of answerIds) {
    const answer = answers[id];
    if (validations && validations[id]) {
      const validation = replaceVariables(validations[id]);
      const evaluator = evaluators[validation.type];

      if (!evaluator) {
        results[id] = [];
      } else {
        const { evaluation, score, maxScore } = await evaluator({
          userResponse: answer,
          hasGroupResponses: validation.hasGroupResponses,
          validation: validation.validation
        });

        results[id] = evaluation;
        console.log("evaluation ", evaluation, "score", score, "id", id);
        totalScore += score;
        let correct = false;
        if (isArray(evaluation)) {
          correct = evaluation.every(x => x);
        }
        if (correct) {
          correctNum++;
        }
        if (!itemLevelScoring) {
          totalMaxScore += maxScore;
        }
      }
    } else {
      results[id] = [];
    }
  }

  console.log("evaluation", { answerIds, itemLevelScore, itemLevelScoring, correctNum, answers, validations });

  if (itemLevelScoring) {
    return {
      evaluation: results,
      maxScore: itemLevelScore,
      score: itemLevelScore * (correctNum / Object.keys(validations).length)
    };
  }
  return { evaluation: results, maxScore: totalMaxScore, score: totalScore };
};
