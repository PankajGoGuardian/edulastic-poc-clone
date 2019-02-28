"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _scoring = require("./const/scoring");

var _countPartialMatchScores = _interopRequireDefault(require("./helpers/countPartialMatchScores"));

var _partialMatchTemplate = _interopRequireDefault(require("./helpers/partialMatchTemplate"));

// exact match evluator
var exactMatchEvaluator = function exactMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var answers = arguments.length > 1 ? arguments[1] : undefined;

  var _ref = arguments.length > 2 ? arguments[2] : undefined,
    automarkable = _ref.automarkable,
    min_score_if_attempted = _ref.min_score_if_attempted,
    max_score = _ref.max_score;

  var score = 0;
  var maxScore = 0;
  var evaluation = [];
  var isCorrect = false;
  var sortedResponse = userResponse.sort();
  answers.forEach(function(_ref2) {
    var answer = _ref2.value,
      totalScore = _ref2.score;
    var sortedAnswer = answer.sort();

    if ((0, _isEqual2.default)(sortedAnswer, sortedResponse)) {
      isCorrect = true;
      score = Math.max(score, totalScore);
    }

    maxScore = Math.max(maxScore, totalScore);
  });

  if (isCorrect) {
    evaluation = Array(userResponse.length).fill(true);
  } else {
    var solution = answers[0].value;
    evaluation = userResponse.map(function(resp, index) {
      return resp === solution[index];
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
}; // evaluator method

var evaluator = function evaluator(_ref3) {
  var userResponse = _ref3.userResponse,
    validation = _ref3.validation;
  var valid_response = validation.valid_response,
    alt_responses = validation.alt_responses,
    scoring_type = validation.scoring_type;
  var answers = [valid_response].concat((0, _toConsumableArray2.default)(alt_responses));

  switch (scoring_type) {
    case _scoring.ScoringType.PARTIAL_MATCH:
      return (0, _partialMatchTemplate.default)((0, _countPartialMatchScores.default)("isEqual"), {
        userResponse: userResponse,
        answers: answers,
        validation: validation
      });

    case _scoring.ScoringType.EXACT_MATCH:
    default:
      return exactMatchEvaluator(userResponse, answers, validation);
  }
};

var _default = evaluator;
exports.default = _default;
