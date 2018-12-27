import { cloneDeep, difference } from 'lodash';
import { ScoringType } from './const/scoring';

// exact-match evaluator
const exactMatchEvaluator = (userResponse = [], validAnswer, altAnswers) => {
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
    default:
      return exactMatchEvaluator(userResponse, valid_response, alt_responses);
  }
};

export default evaluator;
