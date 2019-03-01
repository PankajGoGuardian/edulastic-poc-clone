import { isEqual, includes, difference } from "lodash";
import { evaluatorTypes } from "@edulastic/constants";

const getEvaluation = (response, answers, rightIndex, compareFunction) => {
  const evaluation = [];

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

      default:
        evaluation[i] = includes(answers[rightIndex].value, item);
        break;
    }
  });

  return evaluation;
};

export default getEvaluation;
