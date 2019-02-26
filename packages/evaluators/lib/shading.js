"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _rounding = require("./const/rounding");

var _getPenaltyScore = _interopRequireDefault(require("./helpers/getPenaltyScore"));

var _scoring = require("./const/scoring");

// exact-match evaluator
var exactMatchEvaluator = function exactMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var validAnswer = arguments.length > 1 ? arguments[1] : undefined;
  var altAnswers = arguments.length > 2 ? arguments[2] : undefined;

  var _ref = arguments.length > 3 ? arguments[3] : undefined,
    automarkable = _ref.automarkable,
    min_score_if_attempted = _ref.min_score_if_attempted,
    max_score = _ref.max_score;

  var score = 0;
  var _validAnswer$value = validAnswer.value,
    validValue = _validAnswer$value.value,
    validMethod = _validAnswer$value.method,
    validScore = validAnswer.score;
  var maxScore = validScore;
  var evaluation = (0, _lodash.cloneDeep)(validValue);
  altAnswers.forEach(function(answer) {
    var answerMethod = answer.value.method,
      answerValue = answer.value.value,
      answerScore = answer.score;

    if (answerMethod === _scoring.ScoringType.BY_LOCATION_METHOD) {
      var all = userResponse.length !== 0;
      userResponse.forEach(function(shade) {
        if (
          answerValue.findIndex(function(checkShade) {
            return checkShade[0] === shade[0] && checkShade[1] === shade[1];
          }) === -1
        ) {
          all = false;
        }
      });

      if (all) {
        evaluation = (0, _lodash.cloneDeep)(answerValue);
        score = answerScore;
      }
    } else if (answerValue[0] === userResponse.length) {
      evaluation = (0, _lodash.cloneDeep)(answerValue);
      score = answerScore;
    }

    maxScore = Math.max(answerScore, maxScore);
  });

  if (score === 0) {
    if (validMethod === _scoring.ScoringType.BY_COUNT_METHOD) {
      if (validValue[0] === userResponse.length) {
        evaluation = (0, _lodash.cloneDeep)(validValue);
        score = validScore;
      }
    } else {
      var all = userResponse.length !== 0;
      userResponse.forEach(function(shade) {
        if (
          validValue.findIndex(function(checkShade) {
            return checkShade[0] === shade[0] && checkShade[1] === shade[1];
          }) === -1
        ) {
          all = false;
        }
      });

      if (all) {
        evaluation = (0, _lodash.cloneDeep)(validValue);
        score = validScore;
      }
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

var partialMatchEvaluator = function partialMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var validAnswer = arguments.length > 1 ? arguments[1] : undefined;
  var altAnswers = arguments.length > 2 ? arguments[2] : undefined;

  var _ref2 = arguments.length > 3 ? arguments[3] : undefined,
    automarkable = _ref2.automarkable,
    min_score_if_attempted = _ref2.min_score_if_attempted,
    max_score = _ref2.max_score,
    penalty = _ref2.penalty,
    rounding = _ref2.rounding;

  var score = 0;
  var _validAnswer$value2 = validAnswer.value,
    validValue = _validAnswer$value2.value,
    validMethod = _validAnswer$value2.method,
    validScore = validAnswer.score;
  var maxScore = validScore;
  var incorrectCount = 0;
  var evaluation = [];
  var isRound = rounding === _rounding.rounding.ROUND_DOWN;
  altAnswers.forEach(function(answer) {
    var answerMethod = answer.value.method,
      answerValue = answer.value.value,
      answerScore = answer.score;

    if (answerMethod === _scoring.ScoringType.BY_LOCATION_METHOD) {
      var tmp = 0;
      userResponse.forEach(function(shade) {
        if (
          answerValue.findIndex(function(checkShade) {
            return checkShade[0] === shade[0] && checkShade[1] === shade[1];
          }) === -1
        ) {
          tmp++;
        }
      });
      maxScore = Math.max(answerScore, maxScore);
      score = (incorrectCount / answerValue.length) * maxScore;
      incorrectCount = Math.min(tmp, incorrectCount);
    } else if (answerValue[0] === userResponse.length) {
      score = answerScore;
      maxScore = Math.max(answerScore, maxScore);
      score = (incorrectCount / answerValue[0]) * maxScore;
    } else {
      score = userResponse.length;
      maxScore = Math.max(answerScore, maxScore);
      score = (incorrectCount / answerValue[0]) * maxScore;
    }
  });

  if (score === 0) {
    if (validMethod === _scoring.ScoringType.BY_COUNT_METHOD) {
      score = (userResponse.length / validValue[0]) * maxScore;
    } else {
      incorrectCount = 0;
      userResponse.forEach(function(shade) {
        if (
          validValue.findIndex(function(checkShade) {
            return checkShade[0] === shade[0] && checkShade[1] === shade[1];
          }) !== -1
        ) {
          incorrectCount++;
        }
      });

      if (userResponse.length > validValue.length) {
        score = 0;
      } else {
        score = (incorrectCount / validValue.length) * maxScore;
      }
    }
  }

  evaluation = Array(validMethod === _scoring.ScoringType.BY_COUNT_METHOD ? validValue.length : validValue[0]).map(
    function(item, index) {
      if (index + 1 <= score) {
        return true;
      }

      return false;
    }
  );

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

  if (score > maxScore) {
    score = 0;
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
