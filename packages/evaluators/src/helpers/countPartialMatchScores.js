import { questionType } from "@edulastic/constants";
import { cloneDeep, isEmpty, keys } from "lodash";
import getMatches from "./getMatches";
import getEvaluation from "./getEvaluation";
import { getClozeTextMatches } from "./clozeTextHelpers";
import { getOrderlistMatchs } from "./orderlistHelpers";

const countPartialMatchScores = compareFunction => ({ answers, userResponse = [], qType }, restOptions = {}) => {
  const isOrderlist = qType === questionType.ORDER_LIST;
  let existingResponse = cloneDeep(userResponse);
  if (!isOrderlist && !Array.isArray(userResponse)) {
    existingResponse = cloneDeep(userResponse.value);
  }

  let score = 0;
  let maxScore = 0;

  let rightLen = 0;
  let rightIndex = 0;

  answers.forEach(({ value: answer, score: totalScore }, ind) => {
    if (isEmpty(answer)) {
      return;
    }
    let numOfanswer = answer.length;
    let matches = 0;

    if (isOrderlist) {
      matches = getOrderlistMatchs(existingResponse, answer);
      numOfanswer = keys(answer).length;
    } else {
      matches = getMatches(existingResponse, answer, compareFunction);
    }
    const scorePerAnswer = totalScore / numOfanswer;

    if (restOptions.ignoreCase || restOptions.allowSingleLetterMistake) {
      matches = getClozeTextMatches(existingResponse, answer, restOptions);
    }

    const currentScore = matches * scorePerAnswer;

    score = Math.max(score, currentScore);
    maxScore = Math.max(maxScore, totalScore);

    if (currentScore === score) {
      rightLen = numOfanswer;
      rightIndex = ind;
    }
  });

  const evaluation = getEvaluation(existingResponse, answers, rightIndex, compareFunction, restOptions);

  return {
    score,
    maxScore,
    rightLen,
    evaluation
  };
};

export default countPartialMatchScores;
