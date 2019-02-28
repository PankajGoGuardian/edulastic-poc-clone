"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _constants = require("@edulastic/constants");

var _partialMatchTemplate = _interopRequireDefault(require("./helpers/partialMatchTemplate"));

var _countPartialMatchScores = _interopRequireDefault(require("./helpers/countPartialMatchScores"));

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
}; // mcq evaluator method

var evaluator = function evaluator(_ref2) {
  var userResponse = _ref2.userResponse,
    validation = _ref2.validation;
  var valid_response = validation.valid_response,
    alt_responses = validation.alt_responses,
    scoring_type = validation.scoring_type,
    attemptScore = validation.min_score_if_attempted;
  var answers = [valid_response].concat((0, _toConsumableArray2.default)(alt_responses));
  var result;

  switch (scoring_type) {
    case _constants.evaluationType.PARTIAL_MATCH:
      result = (0, _partialMatchTemplate.default)((0, _countPartialMatchScores.default)("includes"), {
        userResponse: userResponse,
        answers: answers,
        validation: validation
      });
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
