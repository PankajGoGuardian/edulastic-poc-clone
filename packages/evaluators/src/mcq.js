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

  return {
    score,
    maxScore,
    evaluation
  };
};

// partial Match evaluator
const partialMatchEvaluator = (userResponse = [], answers) => {
  let score = 0;
  let maxScore = 0;
  const evaluation = {};
  let isCorrect = false;

  answers.forEach(({ score: totalScore, value: correctAnswers }) => {
    let scorePerAnswer = totalScore / correctAnswers.length;

    let matches = userResponse.filter(resp => correctAnswers.includes(resp))
      .length;
    let currentScore = matches * scorePerAnswer;
    score = Math.max(currentScore, score);
    maxScore = Math.max(totalScore, maxScore);
  });

  const primaryResponse = answers[0].value;
  userResponse.forEach(item => {
    evaluation[item] = primaryResponse.includes(item);
  });

  return {
    score,
    maxScore,
    evaluation
  };
};

// mcq evaluator method
const evaluator = ({ userResponse, validation }) => {
  const { valid_response, alt_responses, scoring_type } = validation;
  const answers = [valid_response, ...alt_responses];

  switch (scoring_type) {
    case ScoringType.PARTIAL_MATCH:
      return partialMatchEvaluator(userResponse, answers);
    case ScoringType.EXACT_MATCH:
    default:
      return exactMatchEvaluator(userResponse, answers);
  }
};
export default evaluator;
