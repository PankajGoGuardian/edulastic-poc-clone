import { isEqual, includes, difference, isBoolean, isString, isObject } from "lodash";
import { evaluatorTypes } from "@edulastic/constants";
import { getClozeTextEvaluation } from "./clozeTextHelpers";
import { getOrderlitEvaluation } from "./orderlistHelpers";

const getEvaluation = (response, answers, rightIndex, compareFunction, restOptions = {}) => {
  let evaluation = [];

  if (restOptions.ignoreCase || restOptions.allowSingleLetterMistake) {
    evaluation = getClozeTextEvaluation(response, answers[rightIndex].value, restOptions);
  } else if (isObject(response)) {
    return getOrderlitEvaluation(response, answers, rightIndex);
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
          if (ans && isObject(ans) && ans.y) {
            evaluation[i] = isEqual({ ...ans, y: +ans.y.toFixed(5) }, { ...item, y: +item.y.toFixed(5) });
          } else {
            ans = isString(ans) ? ans.trim() : ans;
            item = isString(item) ? item.trim() : item;
            evaluation[i] = isEqual(ans, item);
          }
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
