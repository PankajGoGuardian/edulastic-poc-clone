import { isEqual } from 'lodash';
import { ScoringType } from './const/scoring';
import getPartialPerResponse from './helpers/getPartialPerResponse';

const sort = item => (Array.isArray(item) ? item.slice().sort() : []);

const getResponse = (sortedAnswer, userResponse) =>
  sortedAnswer.reduce((acc, val, i) => {
    const res = userResponse[i];

    if (res) {
      acc.push(res);
      return acc;
    }
    acc.push([]);
    return acc;
  }, []);

// partial match evaluation
const partialMatchEvaluator = (
  userResponse = [],
  answers,
  { automarkable, min_score_if_attempted, max_score }
) => {
  let score = 0;
  let maxScore = 0;
  let evaluation = {};
  let isCorrect = false;

  let sortedUserResponse = userResponse.map(item => sort(item));

  answers.forEach(({ value: answer, score: totalScore }) => {
    if (!answer || !answer.length) {
      return;
    }

    const scorePerAnswer = totalScore / answer.length;
    const sortedAnswer = answer.map(item => sort(item));

    sortedUserResponse = getResponse(sortedAnswer, sortedUserResponse);

    const matches = sortedUserResponse.filter((resp, index) => isEqual(resp, sortedAnswer[index]))
      .length;

    const currentScore = matches * scorePerAnswer;

    isCorrect = matches === answer.length;
    score = Math.max(score, currentScore);
    maxScore = Math.max(maxScore, totalScore);
  });

  if (isCorrect) {
    evaluation = Array(sortedUserResponse.length).fill(true);
  } else {
    const solution = answers[0].value.map(item => sort(item));
    evaluation = userResponse.map((resp, index) => isEqual(sortedUserResponse, solution[index]));
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

// exact match evluator
const exactMatchEvaluator = (
  userResponse = [],
  answers,
  { automarkable, min_score_if_attempted, max_score }
) => {
  let score = 0;
  let maxScore = 0;
  let evaluation = [];
  let isCorrect = false;

  answers.forEach(({ value: answer, score: totalScore }) => {
    const sortedAnswer = answer.map(item => sort(item));

    userResponse = getResponse(sortedAnswer, userResponse);

    const sortedResponse = userResponse.map(item => sort(item));

    if (isEqual(sortedAnswer, sortedResponse)) {
      isCorrect = true;
      score = Math.max(score, totalScore);
    }
    maxScore = Math.max(maxScore, totalScore);
  });

  if (isCorrect) {
    evaluation = Array(userResponse.length).fill(true);
  } else {
    const solution = answers[0].value.map(item => sort(item));
    evaluation = userResponse.map((resp, index) => {
      const sortedResponse = sort(resp);
      return isEqual(sortedResponse, solution[index]);
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
// evaluator method
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
