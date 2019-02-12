import { cloneDeep, isEqual, maxBy } from 'lodash';

import { rounding as roundingTypes } from './const/rounding';
import { ScoringType } from './const/scoring';
import getPartialPerResponse from './helpers/getPartialPerResponse';
import getMaxScore from './helpers/getMaxScore';
import getPenaltyScore from './helpers/getPenaltyScore';

const exactMatchEvaluator = (
  { value: userResponse },
  answers,
  { automarkable, min_score_if_attempted, max_score }
) => {
  let score = 0;
  let evaluation = [];
  let maxScore = getMaxScore(answers);
  userResponse = userResponse.map(res => res || []);

  // eslint-disable-next-line no-restricted-syntax
  for (const answer of answers) {
    const { value: answerValue, score: answerScore } = answer;

    if (isEqual(userResponse, answerValue)) {
      evaluation = cloneDeep(answerValue);
      score = answerScore;
      break;
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

const compare = (answer, response) =>
  response.map((a) => {
    if (Array.isArray(answer)) {
      return answer.includes(a);
    }
    return null;
  });

const handleCount = byValue => (acc, v) => {
  if (v === byValue) {
    acc += 1;
  }

  return acc;
};

const getCount = rows =>
  rows.reduce(
    (acc, row = []) => {
      const trueCount = Array.isArray(row) ? row.reduce(handleCount(true), 0) : 0;
      const falseCount = Array.isArray(row) ? row.reduce(handleCount(false), 0) : 0;

      acc = {
        trueCount: acc.trueCount + trueCount,
        falseCount: acc.falseCount + falseCount
      };

      return acc;
    },
    {
      trueCount: 0,
      falseCount: 0
    }
  );

const getScorePerAnswer = ({ penalty, score, count, falseCount }) => {
  let result = score / count;

  if (penalty) {
    const perScore = count > 0 ? score / count : 0;
    const minusScore = falseCount > 0 ? penalty / falseCount : 0;

    result = perScore - minusScore;
  }

  return result;
};

const partialMatchEvaluator = (
  { value: userResponse },
  answers,
  { automarkable, min_score_if_attempted, max_score, scoring_type, rounding, penalty }
) => {
  let maxScore = getMaxScore(answers);
  const isRound =
    rounding === roundingTypes.ROUND_DOWN || scoring_type === ScoringType.PARTIAL_MATCH;
  userResponse = userResponse.map(res => res || []);

  let result = answers.map((answer) => {
    const { value: answerValue, score: answerScore } = answer;
    const res = answerValue.map((a, i) => compare(a, userResponse[i]));
    const { falseCount } = getCount(res);
    const count = answerValue.reduce((acc, val) => {
      acc += Array.isArray(val) ? val.length : 0;
      return acc;
    }, 0);
    const scorePerAnswer = getScorePerAnswer({
      score: answerScore,
      penalty,
      count,
      falseCount
    });
    const scoreRes = res.flat().reduce((acc, val) => {
      if (val === true) {
        acc += scorePerAnswer;
      }
      return acc;
    }, 0);

    return {
      score: scoreRes,
      evaluation: res
    };
  });

  // eslint-disable-next-line prefer-const
  let { score, evaluation } = maxBy(result, res => res.score);

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

  result = {
    score: isRound ? Math.floor(score) : +score.toFixed(4),
    maxScore,
    evaluation
  };

  return result;
};

const evaluator = ({ userResponse = { value: [] }, validation }) => {
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
