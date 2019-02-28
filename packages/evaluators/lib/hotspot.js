"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _difference2 = _interopRequireDefault(require("lodash/difference"));

var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

var _scoring = require("./const/scoring");

var _getPenaltyScore = _interopRequireDefault(require("./helpers/getPenaltyScore"));

var _countPartialMatchScores = _interopRequireDefault(require("./helpers/countPartialMatchScores"));

var _partialMatchTemplate = _interopRequireDefault(require("./helpers/partialMatchTemplate"));

// exact-match evaluator
var exactMatchEvaluator = function exactMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var validAnswer = arguments.length > 1 ? arguments[1] : undefined;
  var altAnswers = arguments.length > 2 ? arguments[2] : undefined;

  var _ref = arguments.length > 3 ? arguments[3] : undefined,
    automarkable = _ref.automarkable,
    min_score_if_attempted = _ref.min_score_if_attempted,
    max_score = _ref.max_score,
    penalty = _ref.penalty;

  var score = 0;
  var isCorrect = false;
  var validValue = validAnswer.value,
    validScore = validAnswer.score;
  var maxScore = validScore;
  var evaluation = (0, _cloneDeep2.default)(validValue);
  altAnswers.forEach(function(answer) {
    var answerValue = answer.value,
      answerScore = answer.score;

    if ((0, _difference2.default)(answerValue, userResponse).length === 0) {
      evaluation = (0, _cloneDeep2.default)(answerValue);
      score = answerScore;
    }

    maxScore = Math.max(answerScore, maxScore);
  });

  if (score === 0) {
    if ((0, _difference2.default)(validValue, userResponse).length === 0) {
      score = validScore;
      isCorrect = true;
    }
  }

  if (isCorrect) {
    evaluation = Array(userResponse.length).fill(true);
  } else {
    var solution = validValue;
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
  var valid_response = validation.valid_response,
    alt_responses = validation.alt_responses,
    scoring_type = validation.scoring_type;
  var answers = [valid_response].concat((0, _toConsumableArray2.default)(alt_responses));

  switch (scoring_type) {
    case _scoring.ScoringType.EXACT_MATCH:
      return exactMatchEvaluator(userResponse, valid_response, alt_responses, validation);

    case _scoring.ScoringType.PARTIAL_MATCH:
      return (0, _partialMatchTemplate.default)((0, _countPartialMatchScores.default)("includes"), {
        userResponse: userResponse,
        answers: answers,
        validation: validation
      });

    default:
      return exactMatchEvaluator(userResponse, valid_response, alt_responses, validation);
  }
};

var _default = evaluator;
exports.default = _default;
