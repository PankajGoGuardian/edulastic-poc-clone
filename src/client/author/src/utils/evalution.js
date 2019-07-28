import { set, round } from "lodash";
import produce from "immer";
import evaluators from "./evaluators";
import { replaceVariables } from "../../../assessment/utils/variables";

export const evaluateItem = async (answers, validations, itemLevelScoring = false, itemLevelScore = 0) => {
  const answerIds = Object.keys(answers);
  const results = {};
  let totalScore = 0;
  let totalMaxScore = itemLevelScoring ? itemLevelScore : 0;

  console.log("validations", validations);
  /* eslint-disable no-restricted-syntax */
  const questionsNum = Object.keys(validations).filter(x => validations[x].validation).length;
  for (const id of answerIds) {
    let answer = answers[id];

    if (validations && validations[id]) {
      const validation = replaceVariables(validations[id]);
      const evaluator = evaluators[validation.type];
      if (!evaluator) {
        results[id] = [];
      } else {
        const { isUnits, is_math, showDropdown } = validations[id];
        if (isUnits && is_math && showDropdown) {
          const expression = answer.expression || "";
          const unit = answer.unit ? answer.unit : "";
          if (expression.search("=") === -1) {
            answer = expression + unit;
          } else {
            answer = expression.replace(/=/gm, `${unit}=`);
          }
        }

        const { evaluation, score, maxScore } = await evaluator({
          userResponse: answer,
          hasGroupResponses: validation.hasGroupResponses,
          validation: itemLevelScoring
            ? produce(validation.validation, v => {
                set(v, "valid_response.score", itemLevelScore / questionsNum);
              })
            : validation.validation
        });

        results[id] = evaluation;
        console.log("evaluation ", { validation, score });
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
