import { cloneDeep, difference, isEqual } from 'lodash';
import { ScoringType } from './const/scoring';
import getPenaltyScore from './helpers/getPenaltyScore';
import getDifferenceCount from './helpers/getDifferenceCount';

// exact-match evaluator
const exactMatchEvaluator = (
  userResponse = [],
  validAnswer,
  altAnswers,
  { automarkable, min_score_if_attempted, max_score, penalty }
) => {
  let score = 0;

  const { value: validValue, score: validScore } = validAnswer;

  let maxScore = validScore;

  const respArr = userResponse;

  let evaluation = cloneDeep(validValue);

  let flag = true;

  altAnswers.forEach((ite) => {
    const { score: altScore, value: altValue } = ite;
    flag = true;
    altValue.forEach((ans, i) => {
      if (difference(respArr[i], ans).length !== 0) {
        flag = false;
      }
    });
    if (flag) {
      evaluation = cloneDeep(altValue);
      score = altScore;
    }
    maxScore = Math.max(maxScore, altScore);
  });

  if (score === 0) {
    flag = true;
    validValue.forEach((row, i) => {
      if (difference(row, respArr[i]).length !== 0) {
        flag = false;
      }
    });
    if (flag) {
      score = validScore;
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

const partialMatchEvaluator = (
  userResponse = [],
  validAnswer,
  altAnswers,
  { automarkable, min_score_if_attempted, max_score, penalty }
) => {
  let score = 0;

  let countOfCorrectAnswers = 0;

  let isCorrect = false;

  const { value: validValue, score: validScore } = validAnswer;

  let maxScore = validScore;

  const respArr = userResponse;

  let evaluation = cloneDeep(validValue);

  let flag = true;

  altAnswers.forEach((ite) => {
    const { score: altScore, value: altValue } = ite;
    flag = true;
    altValue.forEach((ans, i) => {
      if (difference(respArr[i], ans).length !== 0) {
        flag = false;
      }
    });
    if (flag) {
      evaluation = cloneDeep(altValue);
      score = Math.max(altScore, score);
      isCorrect = true;
    } else {
      countOfCorrectAnswers = Math.max(
        getDifferenceCount(altValue, userResponse),
        countOfCorrectAnswers
      );
      score = Math.max(Math.floor(Math.max(altScore, maxScore) / countOfCorrectAnswers), score);
    }
    maxScore = Math.max(maxScore, altScore);
  });

  if (score === 0) {
    flag = true;
    validValue.forEach((row, i) => {
      if (difference(row, respArr[i]).length !== 0) {
        flag = false;
      }
    });
    if (flag) {
      score = validScore;
    }
  }

  if (isCorrect) {
    evaluation = Array(userResponse.length).fill(true);
  } else {
    const solution = validAnswer.value;
    evaluation = userResponse.map((resp, index) => resp === solution[index]);
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

const evaluator = ({ userResponse, validation }) => {
  const { valid_response, alt_responses, scoring_type } = validation;

  switch (scoring_type) {
    case ScoringType.EXACT_MATCH:
      return exactMatchEvaluator(userResponse, valid_response, alt_responses, validation);

    case ScoringType.PARTIAL_MATCH:
      return partialMatchEvaluator(userResponse, valid_response, alt_responses, validation);

    default:
      return exactMatchEvaluator(userResponse, valid_response, alt_responses, validation);
  }
};

export default evaluator;
