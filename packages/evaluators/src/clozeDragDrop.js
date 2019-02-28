import { isEqual } from "lodash";
import { ScoringType } from "./const/scoring";
import partialMatchTemplate from "./helpers/partialMatchTemplate";
import countPartialMatchScores from "./helpers/countPartialMatchScores";

// exact match evluator
const exactMatchEvaluator = (userResponse = [], answers, { automarkable, min_score_if_attempted, max_score }) => {
  let score = 0;
  let maxScore = 0;
  let evaluation = [];
  let isCorrect = false;

  answers.forEach(({ value: answer, score: totalScore }) => {
    const sortedAnswer = answer;
    const sortedResponse = userResponse;

    if (isEqual(sortedAnswer, sortedResponse)) {
      isCorrect = true;
      score = Math.max(score, totalScore);
    }
    maxScore = Math.max(maxScore, totalScore);
  });

  if (isCorrect) {
    evaluation = Array(userResponse.length).fill(true);
  } else {
    const solution = answers[0].value;
    evaluation = userResponse.map((resp, index) => {
      const sortedResponse = resp;
      return isEqual(sortedResponse, solution[index]);
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
// evaluator method
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
