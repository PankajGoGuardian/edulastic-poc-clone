import { isEqual } from 'lodash';
import { ScoringType } from './const/scoring';

// exact match evaluator
const exactMatchEvaluator = (userResponse = [], answers) => {
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

  const correctAnswer = answers[0].value;

  if (!isCorrect) {
    userResponse.forEach(item => {
      evaluation[item] = correctAnswer.includes(item);
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

// mcq evaluator method
const evaluator = ({ userResponses, validation }) => {
  const { valid_response, alt_responses, scoring_type } = validation;

  const answers = [valid_response, ...alt_responses];

  switch (scoring_type) {
    case ScoringType.EXACT_MATCH:
    default:
      return exactMatchEvaluator(userResponses, answers);
  }
};
export default evaluator;
