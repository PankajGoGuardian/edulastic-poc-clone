import { set, round } from "lodash";
import produce from "immer";
import evaluators from "./evaluators";
import { replaceVariables } from "../../../assessment/utils/variables";
import { evaluateApi } from "@edulastic/api";

export const evaluateItem = async (answers, validations, itemLevelScoring = false, itemLevelScore = 0) => {
  const questionIds = Object.keys(validations);
  const results = {};
  let totalScore = 0;
  let totalMaxScore = itemLevelScoring ? itemLevelScore : 0;

  /* eslint-disable no-restricted-syntax */
  const questionsNum = Object.keys(validations).filter(x => validations[x].validation).length;
  for (const id of questionIds) {
    let answer = answers[id];

    if (validations && validations[id]) {
      const validation = replaceVariables(validations[id]);
      const evaluator = evaluators[validation.type];
      if (!evaluator) {
        // results[id] = [];
        // when we need to handle evaluation at backend.
        const data = {
          userResponse: answer,
          validation: validations[id].validation
        };
        const { type } = validations[id];
        const { evaluation, score, maxScore } = await evaluateApi.evaluate(data, type);
        results[id] = evaluation;
        if (itemLevelScoring) {
          totalScore += round(score, 2);
        } else {
          totalScore += score;
        }
        if (!itemLevelScoring) {
          totalMaxScore += maxScore;
        }
      } else {
        const { evaluation, score, maxScore } = await evaluator({
          userResponse: answer,
          hasGroupResponses: validation.hasGroupResponses,
          validation: itemLevelScoring
            ? produce(validation.validation, v => {
                set(v, "validResponse.score", itemLevelScore / questionsNum);
              })
            : validation.validation
        });

        results[id] = evaluation;
        if (itemLevelScoring) {
          totalScore += round(score, 2);
        } else {
          totalScore += score;
        }

        if (!itemLevelScoring) {
          totalMaxScore += maxScore;
        }
      }
    } else {
      results[id] = [];
    }
  }

  if (itemLevelScoring) {
    return {
      evaluation: results,
      maxScore: itemLevelScore,
      score: totalScore > itemLevelScore ? itemLevelScore : totalScore
    };
  }
  return { evaluation: results, maxScore: totalMaxScore, score: totalScore };
};
