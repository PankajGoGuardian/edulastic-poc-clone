"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _scoring = require("./const/scoring");

// exact-match evaluator
var exactMatchEvaluator = function exactMatchEvaluator(_ref, validAnswer, altAnswers) {
  var userResponse = _ref.value;
  var score = 0;
  var validValue = validAnswer.value,
      validScore = validAnswer.score;
  var maxScore = validScore;
  var evaluation = (0, _lodash.cloneDeep)(validValue);
  altAnswers.forEach(function (answer) {
    var answerValue = answer.value,
        answerScore = answer.score;
    var all = userResponse.length !== 0;
    userResponse.forEach(function (shade, i) {
      if ((0, _lodash.difference)(answerValue[i], shade).length !== 0) {
        all = false;
      }
    });

    if (all) {
      evaluation = (0, _lodash.cloneDeep)(answerValue);
      score = answerScore;
    }

    maxScore = Math.max(answerScore, maxScore);
  });

  if (score === 0) {
    var all = userResponse.length !== 0;
    userResponse.forEach(function (shade, i) {
      if ((0, _lodash.difference)(validValue[i], shade).length !== 0) {
        all = false;
      }
    });

    if (all) {
      evaluation = (0, _lodash.cloneDeep)(validValue);
      score = validScore;
    }
  }

  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
};

var evaluator = function evaluator(_ref2) {
  var _ref2$userResponse = _ref2.userResponse,
      userResponse = _ref2$userResponse === void 0 ? {
    value: []
  } : _ref2$userResponse,
      validation = _ref2.validation;
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