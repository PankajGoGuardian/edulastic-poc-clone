import { isEqual } from 'lodash';
import { ScoringType } from './const/scoring';

// partial match evaluation
const partialMatchEvaluator = (userResponse = [], answers) => {
  let score = 0;
  let maxScore = 0;
  let evaluation = {};
  let isCorrect = false;

  const sortedUserResponse = userResponse.sort();

  answers.forEach(({ value: answer, score: totalScore }) => {
    if (!answer || !answer.length) {
      return;
    }

    const scorePerAnswer = totalScore / answer.length;
    const sortedAnswer = answer.sort();

    const matches = sortedUserResponse.filter((resp, index) =>
      isEqual(resp, sortedAnswer[index])).length;


    const currentScore = matches * scorePerAnswer;

    isCorrect = matches === answer.length;
    score = Math.max(score, currentScore);
    maxScore = Math.max(maxScore, totalScore);
  });

  if (isCorrect) {
    evaluation = Array(userResponse.length).fill(true);
  } else {
    const solution = answers[0].value.map(item => item.slice().sort());
    evaluation = userResponse.map((resp, index) => isEqual(resp, solution[index]));
  }

  return {
    score,
    maxScore,
    evaluation
  };
};

// exact match evluator
const exactMatchEvaluator = (userResponse = [], answers) => {
  let score = 0;
  let maxScore = 0;
  let evaluation = [];
  let isCorrect = false;
  const sortedResponse = userResponse.sort();

  answers.forEach(({ value: answer, score: totalScore }) => {
    const sortedAnswer = answer.sort();
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
    evaluation = userResponse.map((resp, index) => resp === solution[index]);
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
      return partialMatchEvaluator(userResponse, answers);
    case ScoringType.EXACT_MATCH:
    default:
      return exactMatchEvaluator(userResponse, answers);
  }
};

export default evaluator;
