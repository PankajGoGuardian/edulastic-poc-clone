"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _lodash = require("lodash");

var _scoring = require("./const/scoring");

// exact-match evaluator
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
  var isCorrect = false;
  answers.forEach(function (answer) {
    if ((0, _lodash.isEqual)(userResponse, answer.value)) {
      isCorrect = true;
      score = Math.max(answer.score, score);
    }

    maxScore = Math.max(answer.score, maxScore);
  });

  if (!isCorrect) {
    var correctAnswer = answers[0].value;
    userResponse.forEach(function (resp, index) {
      evaluation[resp] = correctAnswer[index] === resp;
    });
  } else {
    userResponse.forEach(function (item) {
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
}; // partial match evaluator


var partialMatchEvaluator = function partialMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var answers = arguments.length > 1 ? arguments[1] : undefined;

  var _ref2 = arguments.length > 2 ? arguments[2] : undefined,
      automarkable = _ref2.automarkable,
      min_score_if_attempted = _ref2.min_score_if_attempted,
      max_score = _ref2.max_score;

  var score = 0;
  var maxScore = 0;
  var evaluation = {};
  var isCorrect = false;
  answers.forEach(function (_ref3) {
    var totalScore = _ref3.score,
        correctAnswers = _ref3.value;

    if (!correctAnswers || !correctAnswers.length) {
      return;
    }

    var scorePerAnswer = totalScore / correctAnswers.length;
    var matches = userResponse.filter(function (resp, index) {
      return correctAnswers[index] === resp;
    }).length;

    if (matches === correctAnswers.length) {
      isCorrect = true;
    }

    var currentScore = matches * scorePerAnswer;
    score = Math.max(currentScore, score);
    maxScore = Math.max(totalScore, maxScore);
  });

  if (isCorrect) {
    userResponse.forEach(function (item, index) {
      evaluation[index] = true;
    });
  } else {
    var correctAnswer = answers[0].value || [];
    userResponse.forEach(function (item, index) {
      evaluation[item] = userResponse[item] === correctAnswer[index];
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

var evaluator = function evaluator(_ref4) {
  var userResponse = _ref4.userResponse,
      validation = _ref4.validation;
  var valid_response = validation.valid_response,
      alt_responses = validation.alt_responses,
      scoring_type = validation.scoring_type;
  var answers = [valid_response].concat((0, _toConsumableArray2.default)(alt_responses));

  switch (scoring_type) {
    case _scoring.ScoringType.PARTIAL_MATCH:
      return partialMatchEvaluator(userResponse, answers, validation);

    case _scoring.ScoringType.EXACT_MATCH:
    default:
      return exactMatchEvaluator(userResponse, answers, validation);
  }
};

var _default = evaluator;
exports.default = _default;