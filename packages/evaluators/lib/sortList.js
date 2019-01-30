"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _scoring = require("./const/scoring");

// exact-match evaluator
var exactMatchEvaluator = function exactMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var _ref = arguments.length > 1 ? arguments[1] : undefined,
      validAnswer = _ref.valid_response,
      altAnswers = _ref.alt_responses,
      max_score = _ref.max_score,
      automarkable = _ref.automarkable,
      min_score_if_attempted = _ref.min_score_if_attempted;

  var score = 0;
  var validValue = validAnswer.value,
      validScore = validAnswer.score;
  var maxScore = validScore;
  var evaluation = (0, _lodash.cloneDeep)(validValue);
  altAnswers.forEach(function (answer) {
    var answerValue = answer.value,
        answerScore = answer.score;

    if ((0, _lodash.isEqual)(answerValue, userResponse)) {
      evaluation = (0, _lodash.cloneDeep)(answerValue);
      score = answerScore;
    }

    maxScore = Math.max(answerScore, maxScore);
  });

  if (score === 0) {
    if ((0, _lodash.isEqual)(validValue, userResponse)) {
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
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
};

var getDifferenceCount = function getDifferenceCount(answerArray, validationArray) {
  var count = 0;
  answerArray.forEach(function (answer, i) {
    if (answer !== validationArray[i]) {
      count++;
    }
  });
  return count;
};

var partialMatchEvaluator = function partialMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var _ref2 = arguments.length > 1 ? arguments[1] : undefined,
      validAnswer = _ref2.valid_response,
      altAnswers = _ref2.alt_responses,
      max_score = _ref2.max_score,
      automarkable = _ref2.automarkable,
      min_score_if_attempted = _ref2.min_score_if_attempted;

  var score = 0;
  var countOfCorrectAnswers = 0;
  var validValue = validAnswer.value,
      validScore = validAnswer.score;
  var maxScore = validScore;
  var evaluation = (0, _lodash.cloneDeep)(validValue);
  altAnswers.forEach(function (answer) {
    var answerValue = answer.value,
        answerScore = answer.score;

    if ((0, _lodash.isEqual)(answerValue, userResponse)) {
      evaluation = (0, _lodash.cloneDeep)(answerValue);
      score = Math.max(answerScore, score);
    } else {
      countOfCorrectAnswers = Math.max(getDifferenceCount(answerValue, userResponse), countOfCorrectAnswers);
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

  if ((0, _lodash.isEqual)(validValue, userResponse)) {
    score = validScore;
  } else if (countOfCorrectAnswers) {
    countOfCorrectAnswers = Math.max(getDifferenceCount(validValue, userResponse), countOfCorrectAnswers);
    score = Math.max(Math.floor(maxScore / countOfCorrectAnswers), score);
  } else {
    countOfCorrectAnswers = getDifferenceCount(validValue, userResponse);

    if (countOfCorrectAnswers !== 0) {
      score = Math.max(Math.floor(maxScore / countOfCorrectAnswers), score);
    }
  }

  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
};

var evaluator = function evaluator(_ref3) {
  var userResponse = _ref3.userResponse,
      validation = _ref3.validation;
  var scoring_type = validation.scoring_type;

  switch (scoring_type) {
    case _scoring.ScoringType.EXACT_MATCH:
      return exactMatchEvaluator(userResponse, validation);

    case _scoring.ScoringType.PARTIAL_MATCH:
      return partialMatchEvaluator(userResponse, validation);

    default:
      return exactMatchEvaluator(userResponse, validation);
  }
};

var _default = evaluator;
exports.default = _default;