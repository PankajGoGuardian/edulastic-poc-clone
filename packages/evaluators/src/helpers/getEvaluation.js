import { isEqual, includes, difference, isBoolean, isString } from "lodash";
import { evaluatorTypes } from "@edulastic/constants";
import { getClozeTextEvaluation } from "./clozeTextHelpers";

const getEvaluation = (response, answers, rightIndex, compareFunction, restOptions = {}) => {
  let evaluation = [];

  if (restOptions.ignoreCase || restOptions.allowSingleLetterMistake) {
    evaluation = getClozeTextEvaluation(response, answers[rightIndex].value, restOptions);
  } else {
    response.forEach((item, i) => {
      let ans = answers[rightIndex].value[i];
      switch (compareFunction) {
        case evaluatorTypes.INNER_DIFFERENCE:
          evaluation[i] =
            difference(answers[rightIndex].value[i], item).length === 0 &&
            difference(item, answers[rightIndex].value[i]).length === 0;
          break;

        case evaluatorTypes.IS_EQUAL:
          ans = isString(ans) ? ans.trim() : ans;
          item = isString(item) ? item.trim() : item;
          evaluation[i] = isEqual(ans, item);
          break;

        case evaluatorTypes.MCQ_TYPE:
        default:
          evaluation[i] = includes(answers[rightIndex].value, item);
          break;
      }
    });
  }

  return evaluation.filter(item => isBoolean(item));
};

export default getEvaluation;
