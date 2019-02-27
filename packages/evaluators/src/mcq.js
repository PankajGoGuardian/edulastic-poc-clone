import { isEqual } from "lodash";
import { evaluationType } from "@edulastic/constants";
import getPenaltyScore from "./helpers/getPenaltyScore";

// exact match evaluator
const exactMatchEvaluator = (userResponse = [], answers, { automarkable, min_score_if_attempted, max_score }) => {
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

// partial Match evaluator
const partialMatchEvaluator = (
  userResponse = [],
  answers,
  { automarkable, min_score_if_attempted, max_score, penalty }
) => {
  let score = 0;
  let maxScore = 0;
  const evaluation = {};

  let rightLen = 0;
  let rightIndex = 0;

  answers.forEach(({ score: totalScore, value: correctAnswers }, index) => {
    if (!correctAnswers || !correctAnswers.length) {
      return;
    }
    const scorePerAnswer = totalScore / correctAnswers.length;

    const matches = userResponse.filter(resp => correctAnswers.includes(resp)).length;
    const currentScore = matches * scorePerAnswer;
    score = Math.max(currentScore, score);
    maxScore = Math.max(totalScore, maxScore);

    if (currentScore === score) {
      rightLen = correctAnswers.length;
      rightIndex = index;
    }
  });

  const primaryResponse = answers[rightIndex].value;
  userResponse.forEach(item => {
    evaluation[item] = primaryResponse.includes(item);
  });

  if (penalty > 0) {
    score = getPenaltyScore({ score, penalty, evaluation, rightLen });
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

// mcq evaluator method
const evaluator = ({ userResponse, validation }) => {
  const { valid_response, alt_responses, scoring_type, min_score_if_attempted: attemptScore } = validation;
  const answers = [valid_response, ...alt_responses];

  let result;
  switch (scoring_type) {
    case evaluationType.PARTIAL_MATCH:
      result = partialMatchEvaluator(userResponse, answers, validation);
      break;
    case evaluationType.EXACT_MATCH:
    default:
      result = exactMatchEvaluator(userResponse, answers, validation);
  }

  // if score for attempting is greater than current score
  // let it be the score!
  if (!Number.isNaN(attemptScore) && attemptScore > result.score && userResponse.length) {
    result.score = attemptScore;
  }

  return result;
};
export default evaluator;
