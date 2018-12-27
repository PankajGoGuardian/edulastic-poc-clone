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
  var validAnswer = arguments.length > 1 ? arguments[1] : undefined;
  var altAnswers = arguments.length > 2 ? arguments[2] : undefined;
  var score = 0;
  var validValue = validAnswer.value,
      validScore = validAnswer.score;
  var maxScore = validScore;
  var respArr = userResponse;
  var evaluation = (0, _lodash.cloneDeep)(validValue);
  var flag = true;
  altAnswers.forEach(function (ite) {
    var altScore = ite.score,
        altValue = ite.value;
    flag = true;
    altValue.forEach(function (ans, i) {
      if ((0, _lodash.difference)(respArr[i], ans).length !== 0) {
        flag = false;
      }
    });

    if (flag) {
      evaluation = (0, _lodash.cloneDeep)(altValue);
      score = altScore;
    }

    maxScore = Math.max(maxScore, altScore);
  });

  if (score === 0) {
    flag = true;
    validValue.forEach(function (row, i) {
      if ((0, _lodash.difference)(row, respArr[i]).length !== 0) {
        flag = false;
      }
    });

    if (flag) {
      score = validScore;
    }
  }

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
      alt_responses = validation.alt_responses,
      scoring_type = validation.scoring_type;

  switch (scoring_type) {
    case _scoring.ScoringType.EXACT_MATCH:
    default:
      return exactMatchEvaluator(userResponse, valid_response, alt_responses);
  }
};

var _default = evaluator;
exports.default = _default;