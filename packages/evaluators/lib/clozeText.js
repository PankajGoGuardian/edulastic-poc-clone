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

// exact match evaluator
var exactMatchEvaluator = function exactMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var answers = arguments.length > 1 ? arguments[1] : undefined;

  var _ref = arguments.length > 2 ? arguments[2] : undefined,
    max_score = _ref.max_score,
    automarkable = _ref.automarkable,
    min_score_if_attempted = _ref.min_score_if_attempted;

  var score = 0;
  var maxScore = 0;
  var evaluation = {};
  var isCorrect = false;
  answers.forEach(function(answer) {
    if ((0, _isEqual2.default)(userResponse, answer.value)) {
      isCorrect = true;
      score = Math.max(answer.score, score);
    }

    maxScore = Math.max(answer.score, maxScore);
  });

  if (!isCorrect) {
    var solution = answers[0].value || [];
    userResponse.forEach(function(item, index) {
      evaluation[index] = solution.includes(item);
    });
  } else {
    userResponse.forEach(function(item, index) {
      evaluation[index] = true;
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
};

var evaluator = function evaluator(_ref2) {
  var userResponse = _ref2.userResponse,
    validation = _ref2.validation;
  var valid_response = validation.valid_response,
    alt_responses = validation.alt_responses,
    scoring_type = validation.scoring_type;
  var answers = [valid_response].concat((0, _toConsumableArray2.default)(alt_responses));

  switch (scoring_type) {
    case _scoring.ScoringType.EXACT_MATCH:
      return exactMatchEvaluator(userResponse, answers, validation);

    case _scoring.ScoringType.PARTIAL_MATCH:
    default:
      return (0, _partialMatchTemplate.default)((0, _countPartialMatchScores.default)("isEqual"), {
        userResponse: userResponse,
        answers: answers,
        validation: validation
      });
  }
};

var _default = evaluator;
exports.default = _default;
