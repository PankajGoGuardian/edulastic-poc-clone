import { cloneDeep, difference } from "lodash";
import { ScoringType } from "./const/scoring";
import getPenaltyScore from "./helpers/getPenaltyScore";
import countPartialMatchScores from "./helpers/countPartialMatchScores";
import partialMatchTemplate from "./helpers/partialMatchTemplate";

// exact-match evaluator
const exactMatchEvaluator = (
  userResponse = [],
  validAnswer,
  altAnswers,
  { automarkable, min_score_if_attempted, max_score, penalty }
) => {
  let score = 0;

  let isCorrect = false;

  const { value: validValue, score: validScore } = validAnswer;

  let maxScore = validScore;

  let evaluation = cloneDeep(validValue);

  altAnswers.forEach(answer => {
    const { value: answerValue, score: answerScore } = answer;

    if (difference(answerValue, userResponse).length === 0) {
      evaluation = cloneDeep(answerValue);
      score = answerScore;
    }

    maxScore = Math.max(answerScore, maxScore);
  });

  if (score === 0) {
    if (difference(validValue, userResponse).length === 0) {
      score = validScore;
      isCorrect = true;
    }
  }

  if (isCorrect) {
    evaluation = Array(userResponse.length).fill(true);
  } else {
    const solution = validValue;
    evaluation = userResponse.map((resp, index) => resp === solution[index]);
  }

  if (automarkable) {
    if (min_score_if_attempted) {
      maxScore = Math.max(maxScore, min_score_if_attempted);
      score = Math.max(min_score_if_attempted, score);
    }
  } else if (max_score) {
    maxScore = Math.max(max_score, maxScore);
  }

  if (penalty > 0) {
    score = getPenaltyScore({ score, penalty, evaluation });
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
      return exactMatchEvaluator(userResponse, valid_response, alt_responses, validation);
    case ScoringType.PARTIAL_MATCH:
      return partialMatchTemplate(countPartialMatchScores("includes"), { userResponse, answers, validation });
    default:
      return exactMatchEvaluator(userResponse, valid_response, alt_responses, validation);
  }
};

export default evaluator;
