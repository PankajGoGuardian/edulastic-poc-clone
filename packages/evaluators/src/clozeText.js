import { isEqual } from "lodash";
import { ScoringType } from "./const/scoring";
import countPartialMatchScores from "./helpers/countPartialMatchScores";
import partialMatchTemplate from "./helpers/partialMatchTemplate";

// exact match evaluator
const exactMatchEvaluator = (userResponse = [], answers, { max_score, automarkable, min_score_if_attempted }) => {
  let score = 0;
  let maxScore = 0;
  const evaluation = {};
  let isCorrect = false;

  answers.forEach(answer => {
    if (isEqual(userResponse, answer.value)) {
      isCorrect = true;
      score = Math.max(answer.score, score);
    }
    maxScore = Math.max(answer.score, maxScore);
  });

  if (!isCorrect) {
    const solution = answers[0].value || [];
    userResponse.forEach((item, index) => {
      evaluation[index] = solution.includes(item);
    });
  } else {
    userResponse.forEach((item, index) => {
      evaluation[index] = true;
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

const evaluator = ({ userResponse, validation }) => {
  const { valid_response, alt_responses, scoring_type } = validation;
  const answers = [valid_response, ...alt_responses];

  switch (scoring_type) {
    case ScoringType.EXACT_MATCH:
      return exactMatchEvaluator(userResponse, answers, validation);
    case ScoringType.PARTIAL_MATCH:
    default:
      return partialMatchTemplate(countPartialMatchScores("isEqual"), { userResponse, answers, validation });
  }
};

export default evaluator;
