import { isEqual } from 'lodash';
import { ScoringType } from './const/scoring';

// exact match evaluator
const exactMatchEvaluator = (userResponse = [], answers) => {
  let score = 0;
  let maxScore = 0;
  const evaluation = {};
  let isCorrect = false;

  answers.forEach((answer) => {
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

  return {
    score,
    maxScore,
    evaluation
  };
};


const partialMatchEvaluator = (userResponse = [], answers) => {
  let score = 0;
  let maxScore = 0;
  const evaluation = {};
  let isCorrect = false;

  answers.forEach(({ score: totalScore, value: correctAnswers }) => {
    if (!correctAnswers || !correctAnswers.length) {
      return;
    }
    const scorePerAnswer = totalScore / correctAnswers.length;
    const matches = userResponse.filter(
      (resp, index) => correctAnswers[index] === resp
    ).length;
    isCorrect = (matches === correctAnswers.length);
    const currentScore = matches * scorePerAnswer;
    score = Math.max(currentScore, score);
    maxScore = Math.max(totalScore, maxScore);
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
      return partialMatchEvaluator(userResponse, answers);
    case ScoringType.EXACT_MATCH:
    default:
      return exactMatchEvaluator(userResponse, answers);
  }
};

export default evaluator;
