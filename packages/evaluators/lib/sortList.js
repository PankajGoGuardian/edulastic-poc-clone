"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _scoring = require("./const/scoring");

var _rounding = require("./const/rounding");

var _getPenaltyScore = _interopRequireDefault(require("./helpers/getPenaltyScore"));

var _getDifferenceCount = _interopRequireDefault(require("./helpers/getDifferenceCount"));

// exact-match evaluator
var exactMatchEvaluator = function exactMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var _ref = arguments.length > 1 ? arguments[1] : undefined,
    validAnswer = _ref.valid_response,
    altAnswers = _ref.alt_responses,
    max_score = _ref.max_score,
    automarkable = _ref.automarkable,
    penalty = _ref.penalty,
    min_score_if_attempted = _ref.min_score_if_attempted;

  var score = 0;
  var validValue = validAnswer.value,
    validScore = validAnswer.score;
  var maxScore = validScore;
  var evaluation = [];
  altAnswers.forEach(function(answer) {
    var answerValue = answer.value,
      answerScore = answer.score;

    if ((0, _isEqual2.default)(answerValue, userResponse)) {
      answerValue.forEach(function(ans, i) {
        evaluation[i] = true;
      });
      score = answerScore;
    } else {
      answerValue.forEach(function(ans, i) {
        if (ans === userResponse[i]) {
          evaluation[i] = true;
        } else {
          evaluation[i] = false;
        }
      });
    }

    maxScore = Math.max(answerScore, maxScore);
  });

  if (score === 0) {
    if ((0, _isEqual2.default)(validValue, userResponse)) {
      validValue.forEach(function(ans, i) {
        evaluation[i] = true;
      });
      score = validScore;
    } else {
      validValue.forEach(function(ans, i) {
        if (ans === userResponse[i]) {
          evaluation[i] = true;
        } else {
          evaluation[i] = false;
        }
      });
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

  var _ref2 = arguments.length > 1 ? arguments[1] : undefined,
    validAnswer = _ref2.valid_response,
    altAnswers = _ref2.alt_responses,
    max_score = _ref2.max_score,
    automarkable = _ref2.automarkable,
    min_score_if_attempted = _ref2.min_score_if_attempted,
    rounding = _ref2.rounding,
    penalty = _ref2.penalty;

  var score = 0;
  var countOfCorrectAnswers = 0;
  var validValue = validAnswer.value,
    validScore = validAnswer.score;
  var maxScore = validScore;
  var evaluation = validValue.map(function(ans, index) {
    return ans === userResponse[index];
  });
  var isRound = rounding === _rounding.rounding.ROUND_DOWN;
  altAnswers.forEach(function(answer) {
    var answerValue = answer.value,
      answerScore = answer.score;

    if ((0, _isEqual2.default)(answerValue, userResponse)) {
      score = Math.max(answerScore, score);
    } else {
      countOfCorrectAnswers = Math.max(
        (0, _getDifferenceCount.default)(answerValue, userResponse),
        countOfCorrectAnswers
      );
      score = Math.max(Math.floor(Math.max(answerScore, maxScore) / countOfCorrectAnswers), score);
    }

    maxScore = Math.max(answerScore, maxScore);
  });

  if ((0, _isEqual2.default)(validValue, userResponse)) {
    score = validScore;
  } else if (countOfCorrectAnswers) {
    countOfCorrectAnswers = Math.max((0, _getDifferenceCount.default)(validValue, userResponse), countOfCorrectAnswers);
    score = Math.max(Math.floor(maxScore / countOfCorrectAnswers), score);
  } else {
    countOfCorrectAnswers = (0, _getDifferenceCount.default)(validValue, userResponse);

    if (countOfCorrectAnswers !== 0) {
      score = Math.max(Math.floor(maxScore / countOfCorrectAnswers), score);
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

var evaluator = function evaluator(_ref3) {
  var userResponse = _ref3.userResponse,
    validation = _ref3.validation;
  var scoring_type = validation.scoring_type;

  switch (scoring_type) {
    case _scoring.ScoringType.EXACT_MATCH:
      return exactMatchEvaluator(userResponse, validation);

    case _scoring.ScoringType.PARTIAL_MATCH:
      return partialMatchEvaluator(userResponse, validation);

    default:
      return exactMatchEvaluator(userResponse, validation);
  }
};

var _default = evaluator;
exports.default = _default;
