"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _constants = require("@edulastic/constants");

var _getPenaltyScore = _interopRequireDefault(require("./helpers/getPenaltyScore"));

// exact match evaluator
var exactMatchEvaluator = function exactMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var answers = arguments.length > 1 ? arguments[1] : undefined;

  var _ref = arguments.length > 2 ? arguments[2] : undefined,
    automarkable = _ref.automarkable,
    min_score_if_attempted = _ref.min_score_if_attempted,
    max_score = _ref.max_score;

  var score = 0;
  var maxScore = 0;
  var evaluation = {};
  var isCorrect = false; // what if a question with 0 score?

  answers.forEach(function(answer) {
    // conditions are where bugs hide; minimize them, maximize peace!
    if ((0, _isEqual2.default)(userResponse.sort(), answer.value.sort())) {
      isCorrect = true;
      score = Math.max(answer.score, score);
    }

    maxScore = Math.max(answer.score, maxScore);
  });

  if (!isCorrect) {
    var correctAnswer = answers[0].value || [];
    userResponse.forEach(function(item) {
      evaluation[item] = correctAnswer.includes(item);
    });
  } else {
    userResponse.forEach(function(item) {
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
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
}; // partial Match evaluator

var partialMatchEvaluator = function partialMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var answers = arguments.length > 1 ? arguments[1] : undefined;

  var _ref2 = arguments.length > 2 ? arguments[2] : undefined,
    automarkable = _ref2.automarkable,
    min_score_if_attempted = _ref2.min_score_if_attempted,
    max_score = _ref2.max_score,
    penalty = _ref2.penalty;

  var score = 0;
  var maxScore = 0;
  var evaluation = {};
  var rightLen = 0;
  var rightIndex = 0;
  answers.forEach(function(_ref3, index) {
    var totalScore = _ref3.score,
      correctAnswers = _ref3.value;

    if (!correctAnswers || !correctAnswers.length) {
      return;
    }

    var scorePerAnswer = totalScore / correctAnswers.length;
    var matches = userResponse.filter(function(resp) {
      return correctAnswers.includes(resp);
    }).length;
    var currentScore = matches * scorePerAnswer;
    score = Math.max(currentScore, score);
    maxScore = Math.max(totalScore, maxScore);

    if (currentScore === score) {
      rightLen = correctAnswers.length;
      rightIndex = index;
    }
  });
  var primaryResponse = answers[rightIndex].value;
  userResponse.forEach(function(item) {
    evaluation[item] = primaryResponse.includes(item);
  });

  if (penalty > 0) {
    score = (0, _getPenaltyScore.default)({
      score: score,
      penalty: penalty,
      evaluation: evaluation,
      rightLen: rightLen
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
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
}; // mcq evaluator method

var evaluator = function evaluator(_ref4) {
  var userResponse = _ref4.userResponse,
    validation = _ref4.validation;
  var valid_response = validation.valid_response,
    alt_responses = validation.alt_responses,
    scoring_type = validation.scoring_type,
    attemptScore = validation.min_score_if_attempted;
  var answers = [valid_response].concat((0, _toConsumableArray2.default)(alt_responses));
  var result;

  switch (scoring_type) {
    case _constants.evaluationType.PARTIAL_MATCH:
      result = partialMatchEvaluator(userResponse, answers, validation);
      break;

    case _constants.evaluationType.EXACT_MATCH:
    default:
      result = exactMatchEvaluator(userResponse, answers, validation);
  } // if score for attempting is greater than current score
  // let it be the score!

  if (!Number.isNaN(attemptScore) && attemptScore > result.score && userResponse.length) {
    result.score = attemptScore;
  }

  return result;
};

var _default = evaluator;
exports.default = _default;
