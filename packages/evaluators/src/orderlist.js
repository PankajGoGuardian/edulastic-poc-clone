import { isEqual } from 'lodash';
import { ScoringType } from './const/scoring';

// exact-match evaluator
const exactMatchEvaluator = (userResponse = [], answers) => {
  let score = 0;
  let maxScore = 0;
  let evaluation = {};
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

  return {
    score,
    maxScore,
    evaluation
  };
};

const evaluator = ({ userResponses, validation }) => {
  const { valid_response, alt_responses, scoring_type } = validation;
  const answers = [valid_response, ...alt_responses];

  switch (scoring_type) {
    case ScoringType.PARTIAL_MATCH:
      return partialMatchEvaluator(userResponses, answers);
    case ScoringType.EXACT_MATCH:
    default:
      return exactMatchEvaluator(userResponses, answers);
  }
};

export default evaluator;
