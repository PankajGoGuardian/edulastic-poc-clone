import { cloneDeep } from "lodash";
import getMatches from "./getMatches";
import getEvaluation from "./getEvaluation";
import { getClozeTextMatches } from "./clozeTextHelpers";

const countPartialMatchScores = compareFunction => ({ answers, userResponse = [] }, restOptions = {}) => {
  let existingResponse = cloneDeep(userResponse);
  if (!Array.isArray(userResponse)) {
    existingResponse = cloneDeep(userResponse.value);
  }

  let score = 0;
  let maxScore = 0;

  let rightLen = 0;
  let rightIndex = 0;

  answers.forEach(({ value: answer, score: totalScore }, ind) => {
    if (!answer || !answer.length) {
      return;
    }

    const scorePerAnswer = totalScore / answer.length;

    let matches = getMatches(existingResponse, answer, compareFunction);

    if (restOptions.ignoreCase || restOptions.allowSingleLetterMistake) {
      matches = getClozeTextMatches(existingResponse, answer, restOptions);
    }

    const currentScore = matches * scorePerAnswer;

    score = Math.max(score, currentScore);
    maxScore = Math.max(maxScore, totalScore);

    if (currentScore === score) {
      rightLen = answer.length;
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
