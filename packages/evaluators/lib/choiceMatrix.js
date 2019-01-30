"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _scoring = require("./const/scoring");

// exact-match evaluator
var exactMatchEvaluator = function exactMatchEvaluator(_ref, validAnswer, altAnswers, _ref2) {
  var userResponse = _ref.value;
  var automarkable = _ref2.automarkable,
      min_score_if_attempted = _ref2.min_score_if_attempted,
      max_score = _ref2.max_score;
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

var evaluator = function evaluator(_ref3) {
  var _ref3$userResponse = _ref3.userResponse,
      userResponse = _ref3$userResponse === void 0 ? {
    value: []
  } : _ref3$userResponse,
      validation = _ref3.validation;
  var valid_response = validation.valid_response,
      alt_responses = validation.alt_responses,
      scoring_type = validation.scoring_type;

  switch (scoring_type) {
    case _scoring.ScoringType.EXACT_MATCH:
    default:
      return exactMatchEvaluator(userResponse, valid_response, alt_responses, validation);
  }
};

var _default = evaluator;
exports.default = _default;