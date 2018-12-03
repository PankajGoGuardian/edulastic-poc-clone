"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _lodash = require("lodash");

var _scoring = require("./const/scoring");

// exact match evaluator
var exactMatchEvaluator = function exactMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var answers = arguments.length > 1 ? arguments[1] : undefined;
  var score = 0;
  var maxScore = 0;
  var evaluation = {};
  var isCorrect = false; // what if a question with 0 score?

  answers.forEach(function (answer) {
    // conditions are where bugs hide; minimize them, maximize peace!
    if ((0, _lodash.isEqual)(userResponse.sort(), answer.value.sort())) {
      isCorrect = true;
      score = Math.max(answer.score, score);
    }

    maxScore = Math.max(answer.score, maxScore);
  });

  if (!isCorrect) {
    var correctAnswer = answers[0].value;
    userResponse.forEach(function (item) {
      evaluation[item] = correctAnswer.includes(item);
    });
  } else {
    userResponse.forEach(function (item) {
      evaluation[item] = true;
    });
  }

  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
}; // partial Match evaluator


var partialMatchEvaluator = function partialMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var answers = arguments.length > 1 ? arguments[1] : undefined;
  var score = 0;
  var maxScore = 0;
  var evaluation = {};
  var isCorrect = false;
  answers.forEach(function (_ref) {
    var totalScore = _ref.score,
        correctAnswers = _ref.value;
    var scorePerAnswer = totalScore / correctAnswers.length;
    var matches = userResponse.filter(function (resp) {
      return correctAnswers.includes(resp);
    }).length;
    var currentScore = matches * scorePerAnswer;
    score = Math.max(currentScore, score);
    maxScore = Math.max(totalScore, maxScore);
  });
  var primaryResponse = answers[0].value;
  userResponse.forEach(function (item) {
    evaluation[item] = primaryResponse.includes(item);
  });
  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
}; // mcq evaluator method


var evaluator = function evaluator(_ref2) {
  var userResponse = _ref2.userResponse,
      validation = _ref2.validation;
  var valid_response = validation.valid_response,
      alt_responses = validation.alt_responses,
      scoring_type = validation.scoring_type;
  var answers = [valid_response].concat((0, _toConsumableArray2.default)(alt_responses));
  console.log('answers', answers);
  console.log('userResponse', userResponse);

  switch (scoring_type) {
    case _scoring.ScoringType.PARTIAL_MATCH:
      return partialMatchEvaluator(userResponse, answers);

    case _scoring.ScoringType.EXACT_MATCH:
    default:
      return exactMatchEvaluator(userResponse, answers);
  }
};

var _default = evaluator;
exports.default = _default;