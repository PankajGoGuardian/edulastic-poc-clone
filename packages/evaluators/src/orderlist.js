import { isEqual } from "lodash";
import { ScoringType } from "./const/scoring";
import countPartialMatchScores from "./helpers/countPartialMatchScores";
import partialMatchTemplate from "./helpers/partialMatchTemplate";

// exact-match evaluator
const exactMatchEvaluator = (userResponse = [], answers = [], { automarkable, min_score_if_attempted, max_score }) => {
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
    const correctAnswer = answers[0].value;
    userResponse.forEach((resp, index) => {
      evaluation[resp] = correctAnswer[index] === resp;
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

const evaluator = ({ userResponse, validation }) => {
  const { valid_response, alt_responses, scoring_type } = validation;
  const answers = [valid_response, ...alt_responses];

  switch (scoring_type) {
    case ScoringType.PARTIAL_MATCH:
      return partialMatchTemplate(countPartialMatchScores("isEqual"), { userResponse, answers, validation });
    case ScoringType.EXACT_MATCH:
    default:
      return exactMatchEvaluator(userResponse, answers, validation);
  }
};

export default evaluator;
