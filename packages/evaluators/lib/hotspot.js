"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _scoring = require("./const/scoring");

var _rounding = require("./const/rounding");

var _getPenaltyScore = _interopRequireDefault(require("./helpers/getPenaltyScore"));

// exact-match evaluator
var exactMatchEvaluator = function exactMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var validAnswer = arguments.length > 1 ? arguments[1] : undefined;
  var altAnswers = arguments.length > 2 ? arguments[2] : undefined;

  var _ref = arguments.length > 3 ? arguments[3] : undefined,
      automarkable = _ref.automarkable,
      min_score_if_attempted = _ref.min_score_if_attempted,
      max_score = _ref.max_score,
      penalty = _ref.penalty;

  var score = 0;
  var isCorrect = false;
  var validValue = validAnswer.value,
      validScore = validAnswer.score;
  var maxScore = validScore;
  var evaluation = (0, _lodash.cloneDeep)(validValue);
  altAnswers.forEach(function (answer) {
    var answerValue = answer.value,
        answerScore = answer.score;

    if ((0, _lodash.difference)(answerValue, userResponse).length === 0) {
      evaluation = (0, _lodash.cloneDeep)(answerValue);
      score = answerScore;
    }

    maxScore = Math.max(answerScore, maxScore);
  });

  if (score === 0) {
    if ((0, _lodash.difference)(validValue, userResponse).length === 0) {
      score = validScore;
      isCorrect = true;
    }
  }

  if (isCorrect) {
    evaluation = Array(userResponse.length).fill(true);
  } else {
    var solution = validValue;
    evaluation = userResponse.map(function (resp, index) {
      return resp === solution[index];
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
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
};

var partialMatchEvaluator = function partialMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var validValue = arguments.length > 1 ? arguments[1] : undefined;
  var altResp = arguments.length > 2 ? arguments[2] : undefined;

  var _ref2 = arguments.length > 3 ? arguments[3] : undefined,
      automarkable = _ref2.automarkable,
      min_score_if_attempted = _ref2.min_score_if_attempted,
      max_score = _ref2.max_score,
      rounding = _ref2.rounding,
      penalty = _ref2.penalty;

  var score = 0;
  var maxScore = 0;
  var answers = [validValue].concat(altResp);
  var evaluation = Array(answers[0].value.length).fill(false);
  var isRound = rounding === _rounding.rounding.ROUND_DOWN;
  answers.forEach(function (_ref3) {
    var answer = _ref3.value,
        totalScore = _ref3.score;

    if ((0, _lodash.difference)(answer, userResponse).length === 0) {
      score = Math.max(score, totalScore);
    }

    maxScore = Math.max(maxScore, totalScore);
  });
  score = 0;
  var solution = answers[0].value;
  evaluation = solution.map(function (resp) {
    return !!userResponse.includes(resp);
  });
  evaluation.forEach(function (resp) {
    if (resp) {
      score += maxScore / solution.length;
    }
  });

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

  switch (scoring_type) {
    case _scoring.ScoringType.EXACT_MATCH:
      return exactMatchEvaluator(userResponse, valid_response, alt_responses, validation);

    case _scoring.ScoringType.PARTIAL_MATCH:
      return partialMatchEvaluator(userResponse, valid_response, alt_responses, validation);

    default:
      return exactMatchEvaluator(userResponse, valid_response, alt_responses, validation);
  }
};

var _default = evaluator;
exports.default = _default;