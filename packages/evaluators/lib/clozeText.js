"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _lodash = require("lodash");

var _rounding = require("./const/rounding");

var _scoring = require("./const/scoring");

var _getPartialPerResponse = _interopRequireDefault(require("./helpers/getPartialPerResponse"));

var _getPenaltyScore = _interopRequireDefault(require("./helpers/getPenaltyScore"));

// exact match evaluator
var exactMatchEvaluator = function exactMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var answers = arguments.length > 1 ? arguments[1] : undefined;

  var _ref = arguments.length > 2 ? arguments[2] : undefined,
      max_score = _ref.max_score,
      automarkable = _ref.automarkable,
      min_score_if_attempted = _ref.min_score_if_attempted;

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
    var solution = answers[0].value || [];
    userResponse.forEach(function (item, index) {
      evaluation[index] = solution.includes(item);
    });
  } else {
    userResponse.forEach(function (item, index) {
      evaluation[index] = true;
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

var partialMatchEvaluator = function partialMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var answers = arguments.length > 1 ? arguments[1] : undefined;

  var _ref2 = arguments.length > 2 ? arguments[2] : undefined,
      max_score = _ref2.max_score,
      automarkable = _ref2.automarkable,
      min_score_if_attempted = _ref2.min_score_if_attempted,
      rounding = _ref2.rounding,
      scoring_type = _ref2.scoring_type,
      penalty = _ref2.penalty;

  var score = 0;
  var maxScore = 0;
  var evaluation = {};
  var isCorrect = false;
  var isRound = rounding === _rounding.ROUND_DOWN || scoring_type === _scoring.ScoringType.PARTIAL_MATCH;

  if (userResponse.length !== answers[0].value.length) {
    userResponse = (0, _toConsumableArray2.default)(userResponse).concat((0, _toConsumableArray2.default)(Array(answers[0].value.length - userResponse.length).fill(false)));
  }

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
    isCorrect = matches === correctAnswers.length;
    var currentScore = matches * scorePerAnswer;
    score = Math.max(currentScore, score);
    maxScore = Math.max(totalScore, maxScore);
  });

  if (!isCorrect) {
    var solution = answers[0].value || [];
    userResponse.forEach(function (item, index) {
      evaluation[index] = solution.includes(item);
    });
  } else {
    userResponse.forEach(function (item, index) {
      evaluation[index] = true;
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
    score: isRound ? Math.floor(score) : +score.toFixed(4),
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
      return (0, _getPartialPerResponse.default)(userResponse.length)(partialMatchEvaluator(userResponse, answers, validation));

    case _scoring.ScoringType.PARTIAL_MATCH_V2:
      return partialMatchEvaluator(userResponse, answers, validation);

    case _scoring.ScoringType.EXACT_MATCH:
    default:
      return exactMatchEvaluator(userResponse, answers, validation);
  }
};

var _default = evaluator;
exports.default = _default;