import { isEqual } from 'lodash';
import { ScoringType } from './const/scoring';
import { rounding as myRounding } from './const/rounding';
import getPenaltyScore from './helpers/getPenaltyScore';

// exact-match evaluator
const exactMatchEvaluator = (
  userResponse = [],
  answers = [],
  { automarkable, min_score_if_attempted, max_score }
) => {
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
    const correctAnswer = answers[0].value;
    userResponse.forEach((resp, index) => {
      evaluation[resp] = correctAnswer[index] === resp;
    });
  } else {
    userResponse.forEach((item) => {
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

// partial match evaluator
const partialMatchEvaluator = (
  userResponse = [],
  answers,
  { automarkable, min_score_if_attempted, max_score, penalty, rounding }
) => {
  let score = 0;
  let maxScore = 0;
  const evaluation = {};
  let isCorrect = false;
  const isRound = rounding === myRounding.ROUND_DOWN;

  answers.forEach(({ score: totalScore, value: correctAnswers }) => {
    if (!correctAnswers || !correctAnswers.length) {
      return;
    }
    const scorePerAnswer = totalScore / correctAnswers.length;
    const matches = userResponse.filter((resp, index) => correctAnswers[index] === resp).length;

    if (matches === correctAnswers.length) {
      isCorrect = true;
    }
    const currentScore = matches * scorePerAnswer;
    score = Math.max(currentScore, score);
    maxScore = Math.max(totalScore, maxScore);
  });

  if (isCorrect) {
    userResponse.forEach((item, index) => {
      evaluation[index] = true;
    });
  } else {
    const correctAnswer = answers[0].value || [];
    userResponse.forEach((item, index) => {
      evaluation[item] = userResponse[item] === correctAnswer[index];
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

  if (penalty > 0) {
    score = getPenaltyScore({ score, penalty, evaluation });
  }

  return {
    score: isRound ? Math.floor(score) : +score.toFixed(4),
    maxScore,
    evaluation
  };
};

const evaluator = ({ userResponse, validation }) => {
  const { valid_response, alt_responses, scoring_type } = validation;
  const answers = [valid_response, ...alt_responses];

  switch (scoring_type) {
    case ScoringType.PARTIAL_MATCH:
      return partialMatchEvaluator(userResponse, answers, validation);
    case ScoringType.EXACT_MATCH:
    default:
      return exactMatchEvaluator(userResponse, answers, validation);
  }
};

export default evaluator;
