"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _difference2 = _interopRequireDefault(require("lodash/difference"));

var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

var _scoring = require("./const/scoring");

var _getPenaltyScore = _interopRequireDefault(require("./helpers/getPenaltyScore"));

var _getDifferenceCount = _interopRequireDefault(require("./helpers/getDifferenceCount"));

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
  var validValue = validAnswer.value,
    validScore = validAnswer.score;
  var maxScore = validScore;
  var respArr = userResponse;
  var evaluation = (0, _cloneDeep2.default)(validValue);
  var flag = true;
  altAnswers.forEach(function(ite) {
    var altScore = ite.score,
      altValue = ite.value;
    flag = true;
    altValue.forEach(function(ans, i) {
      if ((0, _difference2.default)(respArr[i], ans).length !== 0) {
        flag = false;
      }
    });

    if (flag) {
      evaluation = (0, _cloneDeep2.default)(altValue);
      score = altScore;
    }

    maxScore = Math.max(maxScore, altScore);
  });

  if (score === 0) {
    flag = true;
    validValue.forEach(function(row, i) {
      if ((0, _difference2.default)(row, respArr[i]).length !== 0) {
        flag = false;
      }
    });

    if (flag) {
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
  var validAnswer = arguments.length > 1 ? arguments[1] : undefined;
  var altAnswers = arguments.length > 2 ? arguments[2] : undefined;

  var _ref2 = arguments.length > 3 ? arguments[3] : undefined,
    automarkable = _ref2.automarkable,
    min_score_if_attempted = _ref2.min_score_if_attempted,
    max_score = _ref2.max_score,
    penalty = _ref2.penalty;

  var score = 0;
  var countOfCorrectAnswers = 0;
  var isCorrect = false;
  var validValue = validAnswer.value,
    validScore = validAnswer.score;
  var maxScore = validScore;
  var respArr = userResponse;
  var evaluation = (0, _cloneDeep2.default)(validValue);
  var flag = true;
  altAnswers.forEach(function(ite) {
    var altScore = ite.score,
      altValue = ite.value;
    flag = true;
    altValue.forEach(function(ans, i) {
      if ((0, _difference2.default)(respArr[i], ans).length !== 0) {
        flag = false;
      }
    });

    if (flag) {
      evaluation = (0, _cloneDeep2.default)(altValue);
      score = Math.max(altScore, score);
      isCorrect = true;
    } else {
      countOfCorrectAnswers = Math.max((0, _getDifferenceCount.default)(altValue, userResponse), countOfCorrectAnswers);
      score = Math.max(Math.floor(Math.max(altScore, maxScore) / countOfCorrectAnswers), score);
    }

    maxScore = Math.max(maxScore, altScore);
  });

  if (score === 0) {
    flag = true;
    validValue.forEach(function(row, i) {
      if ((0, _difference2.default)(row, respArr[i]).length !== 0) {
        flag = false;
      }
    });

    if (flag) {
      score = validScore;
    }
  }

  if (isCorrect) {
    evaluation = Array(userResponse.length).fill(true);
  } else {
    var solution = validAnswer.value;
    evaluation = userResponse.map(function(resp, index) {
      return resp === solution[index];
    });
  }

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
    score: score,
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
