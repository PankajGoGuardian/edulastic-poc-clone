import { ScoringType } from './const/scoring';

// exact match evaluator
const exactMatchEvaluator = (userResponse, answers) => {
  let score = 0;
  let maxScore = 0;
  let evaluation = [];

  const getAnswerCorrectMethods = (answer) => {
    if (answer.value && answer.value.length) {
      return answer.value.map(val => val.value);
    }

    return [];
  };

  answers.forEach((answer) => {
    const correct = getAnswerCorrectMethods(answer);
    if (correct.includes(userResponse)) {
      score = Math.max(answer.score, score);
      evaluation = [...evaluation, ...correct];
    }
    maxScore = Math.max(answer.score, maxScore);
  });

  return {
    score,
    maxScore,
    evaluation
  };
};

const evaluator = ({ userResponse, validation }) => {
  const {
    valid_response,
    alt_responses = [],
    scoring_type,
    min_score_if_attempted: attemptScore
  } = validation;
  const answers = [valid_response, ...alt_responses];

  let result;

  switch (scoring_type) {
    case ScoringType.EXACT_MATCH:
    default:
      result = exactMatchEvaluator(userResponse, answers);
  }

  // if score for attempting is greater than current score
  // let it be the score!
  if (!Number.isNaN(attemptScore) && attemptScore > result.score) {
    result.score = attemptScore;
  }

  return result;
};

export default evaluator;
