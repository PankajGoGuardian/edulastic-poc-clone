"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _scoring = require("./const/scoring");

// exact-match evaluator
var exactMatchEvaluator = function exactMatchEvaluator(userResponse, validAnswer, altAnswers, _ref) {
  var automarkable = _ref.automarkable,
    minScoreIfAttempted = _ref.minScoreIfAttempted,
    maxScore = _ref.maxScore;
  var score = 0;
  var text = userResponse;
  var validValue = validAnswer.value,
    validScore = validAnswer.score,
    matchingRule = validAnswer.matchingRule;
  var mScore = validScore;
  var evaluation = false;

  if ((validValue || "").trim() === (text || "").trim()) {
    evaluation = true;
    score = validScore;
  }

  if (matchingRule === _scoring.ScoringType.CONTAINS && text && text.toLowerCase().includes(validValue.toLowerCase())) {
    evaluation = true;

    if (score === 0) {
      score = validScore;
    }
  }

  altAnswers.forEach(function(ite) {
    var altValue = ite.value,
      altScore = ite.score,
      altMatch = ite.matchingRule;

    if ((altValue || "").trim() === (text || "").trim()) {
      evaluation = true;

      if (score === 0) {
        score = altScore;
      }
    }

    if (altMatch === _scoring.ScoringType.CONTAINS && text && text.toLowerCase().includes(altValue.toLowerCase())) {
      evaluation = true;

      if (score === 0) {
        score = altScore;
      }
    }

    mScore = Math.max(mScore, altScore);
  });

  if (automarkable) {
    if (minScoreIfAttempted) {
      mScore = Math.max(mScore, minScoreIfAttempted);
      score = Math.max(minScoreIfAttempted, score);
    }
  } else if (maxScore) {
    mScore = Math.max(mScore, maxScore);
  }

  return {
    score: score,
    maxScore: mScore,
    evaluation: evaluation
  };
};

var evaluator = function evaluator(_ref2) {
  var userResponse = _ref2.userResponse,
    validation = _ref2.validation;
  var validResponse = validation.validResponse,
    altResponses = validation.altResponses,
    scoringType = validation.scoringType;

  switch (scoringType) {
    case _scoring.ScoringType.EXACT_MATCH:
    default:
      return exactMatchEvaluator(userResponse, validResponse, altResponses, validation);
  }
};

var _default = evaluator;
exports["default"] = _default;
