import { cloneDeep, isEmpty, keys } from "lodash";
import { questionType } from "@edulastic/constants";

import getEvaluation from "./getEvaluation";
import getMatches from "./getMatches";
import { getClozeTextMatches } from "./clozeTextHelpers";
import { getOrderlistMatchs } from "./orderlistHelpers";

const countExactMatchScores = compareFunction => ({ answers, userResponse = [], qType }, restOptions = {}) => {
  const isOrderlist = qType === questionType.ORDER_LIST;
  let existingResponse = cloneDeep(userResponse);
  if (!isOrderlist && !Array.isArray(userResponse)) {
    existingResponse = cloneDeep(userResponse.value);
  }

  let score = 0;
  let maxScore = 0;
  let matchCount = 0;

  let rightLen = 0;
  let rightIndex = 0;

  answers.forEach(({ value: answer, score: totalScore }, index) => {
    if (isEmpty(answer)) {
      return;
    }

    let currentMatchCount = 0;
    let numOfanswer = answer.length;
    let numOfResponse = existingResponse.length;

    if (isOrderlist) {
      currentMatchCount = getOrderlistMatchs(existingResponse, answer);
      numOfanswer = keys(answer).length;
      numOfResponse = keys(existingResponse).length;
    } else {
      currentMatchCount = getMatches(existingResponse, answer, compareFunction);
    }

    let matches = currentMatchCount === numOfanswer;

    if (restOptions.ignoreCase || restOptions.allowSingleLetterMistake) {
      matches = getClozeTextMatches(existingResponse, answer, restOptions) === numOfanswer;
    }

    const currentScore = matches && numOfResponse === numOfanswer ? totalScore : 0;

    score = Math.max(score, currentScore);
    maxScore = Math.max(maxScore, totalScore);
    matchCount = Math.max(matchCount, currentMatchCount);

    if ((currentScore === score && score !== 0) || (currentMatchCount === matchCount && matchCount !== 0)) {
      rightLen = numOfanswer;
      rightIndex = index;
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

export default countExactMatchScores;
