import { cloneDeep, difference } from 'lodash';
import { ScoringType } from './const/scoring';

// exact-match evaluator
const exactMatchEvaluator = (
  { value: userResponse },
  validAnswer,
  altAnswers,
  { automarkable, min_score_if_attempted, max_score }
) => {
  let score = 0;

  const { value: validValue, score: validScore } = validAnswer;

  let maxScore = validScore;

  let evaluation = cloneDeep(validValue);

  altAnswers.forEach((answer) => {
    const { value: answerValue, score: answerScore } = answer;
    let all = userResponse.length !== 0;
    userResponse.forEach((shade, i) => {
      if (difference(answerValue[i], shade).length !== 0) {
        all = false;
      }
    });

    if (all) {
      evaluation = cloneDeep(answerValue);
      score = answerScore;
    }

    maxScore = Math.max(answerScore, maxScore);
  });

  if (score === 0) {
    let all = userResponse.length !== 0;
    userResponse.forEach((shade, i) => {
      if (difference(validValue[i], shade).length !== 0) {
        all = false;
      }
    });

    if (all) {
      evaluation = cloneDeep(validValue);
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

  return {
    score,
    maxScore,
    evaluation
  };
};

const evaluator = ({ userResponse = { value: [] }, validation }) => {
  const { valid_response, alt_responses, scoring_type } = validation;

  switch (scoring_type) {
    case ScoringType.EXACT_MATCH:
    default:
      return exactMatchEvaluator(userResponse, valid_response, alt_responses, validation);
  }
};

export default evaluator;
