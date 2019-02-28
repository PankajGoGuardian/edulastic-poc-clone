"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _scoring = require("./const/scoring");

var _getPenaltyScore = _interopRequireDefault(require("./helpers/getPenaltyScore"));

var _countPartialMatchScores = _interopRequireDefault(require("./helpers/countPartialMatchScores"));

var _partialMatchTemplate = _interopRequireDefault(require("./helpers/partialMatchTemplate"));

// exact-match evaluator
var exactMatchEvaluator = function exactMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var _ref = arguments.length > 1 ? arguments[1] : undefined,
    validAnswer = _ref.valid_response,
    altAnswers = _ref.alt_responses,
    max_score = _ref.max_score,
    automarkable = _ref.automarkable,
    penalty = _ref.penalty,
    min_score_if_attempted = _ref.min_score_if_attempted;

  var score = 0;
  var validValue = validAnswer.value,
    validScore = validAnswer.score;
  var maxScore = validScore;
  var evaluation = [];
  altAnswers.forEach(function(answer) {
    var answerValue = answer.value,
      answerScore = answer.score;

    if ((0, _isEqual2.default)(answerValue, userResponse)) {
      answerValue.forEach(function(ans, i) {
        evaluation[i] = true;
      });
      score = answerScore;
    } else {
      answerValue.forEach(function(ans, i) {
        if (ans === userResponse[i]) {
          evaluation[i] = true;
        } else {
          evaluation[i] = false;
        }
      });
    }

    maxScore = Math.max(answerScore, maxScore);
  });

  if (score === 0) {
    if ((0, _isEqual2.default)(validValue, userResponse)) {
      validValue.forEach(function(ans, i) {
        evaluation[i] = true;
      });
      score = validScore;
    } else {
      validValue.forEach(function(ans, i) {
        if (ans === userResponse[i]) {
          evaluation[i] = true;
        } else {
          evaluation[i] = false;
        }
      });
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

  if (penalty > 0) {
    score = (0, _getPenaltyScore.default)({
      score: score,
      penalty: penalty,
      evaluation: evaluation
    });
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
  var scoring_type = validation.scoring_type,
    valid_response = validation.valid_response,
    alt_responses = validation.alt_responses;
  var answers = [valid_response].concat((0, _toConsumableArray2.default)(alt_responses));

  switch (scoring_type) {
    case _scoring.ScoringType.EXACT_MATCH:
      return exactMatchEvaluator(userResponse, validation);

    case _scoring.ScoringType.PARTIAL_MATCH:
      return (0, _partialMatchTemplate.default)((0, _countPartialMatchScores.default)("isEqual"), {
        userResponse: userResponse,
        answers: answers,
        validation: validation
      });

    default:
      return exactMatchEvaluator(userResponse, validation);
  }
};

var _default = evaluator;
exports.default = _default;
