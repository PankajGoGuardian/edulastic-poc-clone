import { cloneDeep, isEqual } from 'lodash';
import { ScoringType } from './const/scoring';
import getPenaltyScore from './helpers/getPenaltyScore';

// exact-match evaluator
const exactMatchEvaluator = (
  userResponse = [],
  {
    valid_response: validAnswer,
    alt_responses: altAnswers,
    max_score,
    automarkable,
    penalty,
    min_score_if_attempted
  }
) => {
  let score = 0;

  const { value: validValue, score: validScore } = validAnswer;

  let maxScore = validScore;

  const evaluation = [];

  altAnswers.forEach((answer) => {
    const { value: answerValue, score: answerScore } = answer;

    if (isEqual(answerValue, userResponse)) {
      answerValue.forEach((ans, i) => {
        evaluation[i] = true;
      });
      score = answerScore;
    } else {
      answerValue.forEach((ans, i) => {
        if (ans === userResponse[i]) {
          evaluation[i] = true;
        } else {
          evaluation[i] = false;
        }
      });
    }

    maxScore = Math.max(answerScore, maxScore);
  });

  if (score === 0) {
    if (isEqual(validValue, userResponse)) {
      validValue.forEach((ans, i) => {
        evaluation[i] = true;
      });
      score = validScore;
    } else {
      validValue.forEach((ans, i) => {
        if (ans === userResponse[i]) {
          evaluation[i] = true;
        } else {
          evaluation[i] = false;
        }
      });
    }
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

const getDifferenceCount = (answerArray, validationArray) => {
  let count = 0;

  answerArray.forEach((answer, i) => {
    if (answer !== validationArray[i]) {
      count++;
    }
  });

  return count;
};

const partialMatchEvaluator = (
  userResponse = [],
  {
    valid_response: validAnswer,
    alt_responses: altAnswers,
    max_score,
    automarkable,
    min_score_if_attempted
  }
) => {
  let score = 0;

  let countOfCorrectAnswers = 0;

  const { value: validValue, score: validScore } = validAnswer;

  let maxScore = validScore;

  let evaluation = cloneDeep(validValue);

  altAnswers.forEach((answer) => {
    const { value: answerValue, score: answerScore } = answer;

    if (isEqual(answerValue, userResponse)) {
      evaluation = cloneDeep(answerValue);
      score = Math.max(answerScore, score);
    } else {
      countOfCorrectAnswers = Math.max(
        getDifferenceCount(answerValue, userResponse),
        countOfCorrectAnswers
      );
      score = Math.max(Math.floor(Math.max(answerScore, maxScore) / countOfCorrectAnswers), score);
    }

    maxScore = Math.max(answerScore, maxScore);
  });

  if (automarkable) {
    if (min_score_if_attempted) {
      maxScore = Math.max(maxScore, min_score_if_attempted);
      score = Math.max(min_score_if_attempted, score);
    }
  } else if (max_score) {
    maxScore = Math.max(max_score, maxScore);
  }

  if (isEqual(validValue, userResponse)) {
    score = validScore;
  } else if (countOfCorrectAnswers) {
    countOfCorrectAnswers = Math.max(
      getDifferenceCount(validValue, userResponse),
      countOfCorrectAnswers
    );
    score = Math.max(Math.floor(maxScore / countOfCorrectAnswers), score);
  } else {
    countOfCorrectAnswers = getDifferenceCount(validValue, userResponse);
    if (countOfCorrectAnswers !== 0) {
      score = Math.max(Math.floor(maxScore / countOfCorrectAnswers), score);
    }
  }

  return {
    score,
    maxScore,
    evaluation
  };
};

const evaluator = ({ userResponse, validation }) => {
  const { scoring_type } = validation;

  switch (scoring_type) {
    case ScoringType.EXACT_MATCH:
      return exactMatchEvaluator(userResponse, validation);

    case ScoringType.PARTIAL_MATCH:
      return partialMatchEvaluator(userResponse, validation);
    default:
      return exactMatchEvaluator(userResponse, validation);
  }
};

export default evaluator;
