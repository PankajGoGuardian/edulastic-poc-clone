import { cloneDeep } from 'lodash';
import { ScoringType } from './const/scoring';

// exact-match evaluator
const exactMatchEvaluator = (
  userResponse = [],
  validAnswer,
  altAnswers,
  { automarkable, min_score_if_attempted, max_score }
) => {
  let score = 0;

  const {
    value: { value: validValue, method: validMethod },
    score: validScore
  } = validAnswer;

  let maxScore = validScore;

  let evaluation = cloneDeep(validValue);

  altAnswers.forEach((answer) => {
    const {
      value: { method: answerMethod },
      value: { value: answerValue },
      score: answerScore
    } = answer;

    if (answerMethod === ScoringType.BY_LOCATION_METHOD) {
      let all = userResponse.length !== 0;
      userResponse.forEach((shade) => {
        if (
          answerValue.findIndex(
            checkShade => checkShade[0] === shade[0] && checkShade[1] === shade[1]
          ) === -1
        ) {
          all = false;
        }
      });
      if (all) {
        evaluation = cloneDeep(answerValue);
        score = answerScore;
      }
    } else if (answerValue[0] === userResponse.length) {
      evaluation = cloneDeep(answerValue);
      score = answerScore;
    }

    maxScore = Math.max(answerScore, maxScore);
  });

  if (score === 0) {
    if (validMethod === ScoringType.BY_COUNT_METHOD) {
      if (validValue[0] === userResponse.length) {
        evaluation = cloneDeep(validValue);
        score = validScore;
      }
    } else {
      let all = userResponse.length !== 0;
      userResponse.forEach((shade) => {
        if (
          validValue.findIndex(
            checkShade => checkShade[0] === shade[0] && checkShade[1] === shade[1]
          ) === -1
        ) {
          all = false;
        }
      });
      if (all) {
        evaluation = cloneDeep(validValue);
        score = validScore;
      }
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
      return exactMatchEvaluator(userResponse, valid_response, alt_responses, validation);
  }
};

export default evaluator;
