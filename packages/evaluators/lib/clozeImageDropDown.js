"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _lodash = require("lodash");

var _scoring = require("./const/scoring");

// partial match evaluation
var partialMatchEvaluator = function partialMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var answers = arguments.length > 1 ? arguments[1] : undefined;
  var score = 0;
  var maxScore = 0;
  var evaluation = {};
  var isCorrect = false;
  var sortedUserResponse = userResponse.sort();
  answers.forEach(function (_ref) {
    var answer = _ref.value,
        totalScore = _ref.score;

    if (!answer || !answer.length) {
      return;
    }

    var scorePerAnswer = totalScore / answer.length;
    var sortedAnswer = answer.sort();
    var matches = sortedUserResponse.filter(function (resp, index) {
      return (0, _lodash.isEqual)(resp, sortedAnswer[index]);
    }).length;
    var currentScore = matches * scorePerAnswer;
    isCorrect = matches === answer.length;
    score = Math.max(score, currentScore);
    maxScore = Math.max(maxScore, totalScore);
  });

  if (isCorrect) {
    evaluation = Array(userResponse.length).fill(true);
  } else {
    var solution = answers[0].value.map(function (item) {
      return item.slice().sort();
    });
    evaluation = userResponse.map(function (resp, index) {
      return (0, _lodash.isEqual)(resp, solution[index]);
    });
  }

  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
}; // exact match evluator


var exactMatchEvaluator = function exactMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var answers = arguments.length > 1 ? arguments[1] : undefined;
  var score = 0;
  var maxScore = 0;
  var evaluation = [];
  var isCorrect = false;
  var sortedResponse = userResponse.sort();
  answers.forEach(function (_ref2) {
    var answer = _ref2.value,
        totalScore = _ref2.score;
    var sortedAnswer = answer.sort();

    if ((0, _lodash.isEqual)(sortedAnswer, sortedResponse)) {
      isCorrect = true;
      score = Math.max(score, totalScore);
    }

    maxScore = Math.max(maxScore, totalScore);
  });

  if (isCorrect) {
    evaluation = Array(userResponse.length).fill(true);
  } else {
    var solution = answers[0].value;
    evaluation = userResponse.map(function (resp, index) {
      return resp === solution[index];
    });
  }

  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
}; // evaluator method


var evaluator = function evaluator(_ref3) {
  var userResponse = _ref3.userResponse,
      validation = _ref3.validation;
  var valid_response = validation.valid_response,
      alt_responses = validation.alt_responses,
      scoring_type = validation.scoring_type;
  var answers = [valid_response].concat((0, _toConsumableArray2.default)(alt_responses));

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