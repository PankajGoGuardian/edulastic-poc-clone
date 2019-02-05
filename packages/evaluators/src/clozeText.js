import { isEqual } from 'lodash';
import { rounding as roundingTypes } from './const/rounding';
import { ScoringType } from './const/scoring';
import getPartialPerResponse from './helpers/getPartialPerResponse';
import getPenaltyScore from './helpers/getPenaltyScore';

// exact match evaluator
const exactMatchEvaluator = (
  userResponse = [],
  answers,
  { max_score, automarkable, min_score_if_attempted }
) => {
  let score = 0;
  let maxScore = 0;
  const evaluation = {};
  let isCorrect = false;

  answers.forEach(answer => {
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

const partialMatchEvaluator = (
  userResponse = [],
  answers,
  {
    max_score,
    automarkable,
    min_score_if_attempted,
    rounding,
    scoring_type,
    penalty
  }
) => {
  let score = 0;
  let maxScore = 0;
  const evaluation = {};
  let isCorrect = false;
  const isRound =
    rounding === roundingTypes.ROUND_DOWN ||
    scoring_type === ScoringType.PARTIAL_MATCH;

  if (userResponse.length !== answers[0].value.length) {
    userResponse = [
      ...userResponse,
      ...Array(answers[0].value.length - userResponse.length).fill(false)
    ];
  }

  answers.forEach(({ score: totalScore, value: correctAnswers }) => {
    if (!correctAnswers || !correctAnswers.length) {
      return;
    }

    const scorePerAnswer = totalScore / correctAnswers.length;

    const matches = userResponse.filter(
      (resp, index) => correctAnswers[index] === resp
    ).length;
    isCorrect = matches === correctAnswers.length;
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
      return getPartialPerResponse(userResponse.length)(
        partialMatchEvaluator(userResponse, answers, validation)
      );
    case ScoringType.PARTIAL_MATCH_V2:
      return partialMatchEvaluator(userResponse, answers, validation);
    case ScoringType.EXACT_MATCH:
    default:
      return exactMatchEvaluator(userResponse, answers, validation);
  }
};

export default evaluator;
