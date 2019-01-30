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

  var _ref = arguments.length > 2 ? arguments[2] : undefined,
      automarkable = _ref.automarkable,
      min_score_if_attempted = _ref.min_score_if_attempted,
      max_score = _ref.max_score;

  var score = 0;
  var maxScore = 0;
  var evaluation = {};
  var isCorrect = false;
  var sortedUserResponse = userResponse.map(function (item) {
    return item.slice().sort();
  });
  answers.forEach(function (_ref2) {
    var answer = _ref2.value,
        totalScore = _ref2.score;

    if (!answer || !answer.length) {
      return;
    }

    var scorePerAnswer = totalScore / answer.length;
    var sortedAnswer = answer.map(function (item) {
      return item.slice().sort();
    });
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
      return (0, _lodash.isEqual)(sortedUserResponse, solution[index]);
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
}; // exact match evluator


var exactMatchEvaluator = function exactMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var answers = arguments.length > 1 ? arguments[1] : undefined;

  var _ref3 = arguments.length > 2 ? arguments[2] : undefined,
      automarkable = _ref3.automarkable,
      min_score_if_attempted = _ref3.min_score_if_attempted,
      max_score = _ref3.max_score;

  var score = 0;
  var maxScore = 0;
  var evaluation = [];
  var isCorrect = false;
  answers.forEach(function (_ref4) {
    var answer = _ref4.value,
        totalScore = _ref4.score;
    var sortedAnswer = answer.map(function (item) {
      return item.slice().sort();
    });
    var sortedResponse = userResponse.map(function (item) {
      return item.slice().sort();
    });

    if ((0, _lodash.isEqual)(sortedAnswer, sortedResponse)) {
      isCorrect = true;
      score = Math.max(score, totalScore);
    }

    maxScore = Math.max(maxScore, totalScore);
  });

  if (isCorrect) {
    evaluation = Array(userResponse.length).fill(true);
  } else {
    var solution = answers[0].value.map(function (item) {
      return item.slice().sort();
    });
    evaluation = userResponse.map(function (resp, index) {
      var sortedResponse = resp.slice().sort();
      return (0, _lodash.isEqual)(sortedResponse, solution[index]);
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
}; // evaluator method


var evaluator = function evaluator(_ref5) {
  var userResponse = _ref5.userResponse,
      validation = _ref5.validation;
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