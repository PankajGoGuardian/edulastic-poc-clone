import { cloneDeep } from "lodash";
import getEvaluation from "./getEvaluation";
import getMatches from "./getMatches";
import { getClozeTextMatches } from "./clozeTextHelpers";

const countExactMatchScores = compareFunction => ({ answers, userResponse = [] }, restOptions = {}) => {
  let existingResponse = cloneDeep(userResponse);
  if (!Array.isArray(userResponse)) {
    existingResponse = cloneDeep(userResponse.value);
  }

  let score = 0;
  let maxScore = 1;

  let rightLen = 0;
  let rightIndex = 0;

  answers.forEach(({ value: answer, score: totalScore }, index) => {
    if (!answer || !answer.length) {
      return;
    }

    let matches = getMatches(existingResponse, answer, compareFunction) === answer.length;

    if (restOptions.ignoreCase || restOptions.allowSingleLetterMistake) {
      matches = getClozeTextMatches(existingResponse, answer, restOptions) === answer.length;
    }

    const currentScore = matches && existingResponse.length === answer.length ? totalScore : 0;

    score = Math.max(score, currentScore);
    maxScore = Math.max(maxScore, totalScore);

    if ((currentScore === score && score !== 0) || (maxScore === totalScore && currentScore === score)) {
      rightLen = answer.length;
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
