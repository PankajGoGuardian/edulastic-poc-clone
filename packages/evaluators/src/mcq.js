import { isEqual } from "lodash";
import { evaluationType } from "@edulastic/constants";
import partialMatchTemplate from "./helpers/partialMatchTemplate";
import countPartialMatchScores from "./helpers/countPartialMatchScores";

// exact match evaluator
const exactMatchEvaluator = (userResponse = [], answers, { automarkable, min_score_if_attempted, max_score }) => {
  let score = 0;

  let maxScore = 0;

  const evaluation = {};

  let isCorrect = false; // what if a question with 0 score?

  answers.forEach(answer => {
    // conditions are where bugs hide; minimize them, maximize peace!
    if (isEqual(userResponse.sort(), answer.value.sort())) {
      isCorrect = true;
      score = Math.max(answer.score, score);
    }
    maxScore = Math.max(answer.score, maxScore);
  });

  if (!isCorrect) {
    const correctAnswer = answers[0].value || [];
    userResponse.forEach(item => {
      evaluation[item] = correctAnswer.includes(item);
    });
  } else {
    userResponse.forEach(item => {
      evaluation[item] = true;
    });
  }

  if (automarkable) {
    if (min_score_if_attempted) {
      maxScore = Math.max(maxScore, min_score_if_attempted);
      score = Math.max(min_score_if_attempted, score);
    }
  } else if (max_score) {
    maxScore = Math.max(max_score, maxScore);
  }

  return {
    score,
    maxScore,
    evaluation
  };
};

// mcq evaluator method
const evaluator = ({ userResponse, validation }) => {
  const { valid_response, alt_responses, scoring_type, min_score_if_attempted: attemptScore } = validation;
  const answers = [valid_response, ...alt_responses];

  let result;
  switch (scoring_type) {
    case evaluationType.PARTIAL_MATCH:
      result = partialMatchTemplate(countPartialMatchScores("includes"), { userResponse, answers, validation });
      break;
    case evaluationType.EXACT_MATCH:
    default:
      result = exactMatchEvaluator(userResponse, answers, validation);
  }

  // if score for attempting is greater than current score
  // let it be the score!
  if (!Number.isNaN(attemptScore) && attemptScore > result.score && userResponse.length) {
    result.score = attemptScore;
  }

  return result;
};
export default evaluator;
