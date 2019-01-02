"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _scoring = require("./const/scoring");

// exact match evaluator
var exactMatchEvaluator = function exactMatchEvaluator(userResponse, answers) {
  var score = 0;
  var maxScore = 0;
  var evaluation = [];

  var getAnswerCorrectMethods = function getAnswerCorrectMethods(answer) {
    if (answer.value && answer.value.length) {
      return answer.value.map(function (val) {
        return val.value;
      });
    }

    return [];
  };

  answers.forEach(function (answer) {
    var correct = getAnswerCorrectMethods(answer);

    if (correct.includes(userResponse)) {
      score = Math.max(answer.score, score);
      evaluation = (0, _toConsumableArray2.default)(evaluation).concat((0, _toConsumableArray2.default)(correct));
    }

    maxScore = Math.max(answer.score, maxScore);
  });
  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
};

var evaluator = function evaluator(_ref) {
  var userResponse = _ref.userResponse,
      validation = _ref.validation;
  var valid_response = validation.valid_response,
      _validation$alt_respo = validation.alt_responses,
      alt_responses = _validation$alt_respo === void 0 ? [] : _validation$alt_respo,
      scoring_type = validation.scoring_type,
      attemptScore = validation.min_score_if_attempted;
  var answers = [valid_response].concat((0, _toConsumableArray2.default)(alt_responses));
  var result;

  switch (scoring_type) {
    case _scoring.ScoringType.EXACT_MATCH:
    default:
      result = exactMatchEvaluator(userResponse, answers);
  } // if score for attempting is greater than current score
  // let it be the score!


  if (!Number.isNaN(attemptScore) && attemptScore > result.score && userResponse.length) {
    result.score = attemptScore;
  }

  return result;
};

var _default = evaluator;
exports.default = _default;