import { isEqual, includes, difference, isBoolean } from "lodash";
import { evaluatorTypes } from "@edulastic/constants";
import { getClozeTextEvaluation } from "./clozeTextHelpers";

const getEvaluation = (response, answers, rightIndex, compareFunction, restOptions = {}) => {
  let evaluation = [];

  if (restOptions.ignoreCase || restOptions.allowSingleLetterMistake) {
    evaluation = getClozeTextEvaluation(response, answers[rightIndex].value, restOptions);
  } else {
    response.forEach((item, i) => {
      switch (compareFunction) {
        case evaluatorTypes.INNER_DIFFERENCE:
          evaluation[i] =
            difference(answers[rightIndex].value[i], item).length === 0 &&
            difference(item, answers[rightIndex].value[i]).length === 0;
          break;

        case evaluatorTypes.IS_EQUAL:
          evaluation[i] = isEqual(answers[rightIndex].value[i], item);
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
