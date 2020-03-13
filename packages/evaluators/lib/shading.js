"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _scoring = require("./const/scoring");

var _partialMatchTemplate = _interopRequireDefault(require("./helpers/partialMatchTemplate"));

var _exactMatchTemplate = _interopRequireDefault(require("./helpers/exactMatchTemplate"));

var BY_COUNT_METHOD = "byCount";

var exactCompareFunction = function exactCompareFunction(_ref) {
  var answers = _ref.answers,
    _ref$userResponse = _ref.userResponse,
    userResponse = _ref$userResponse === void 0 ? [] : _ref$userResponse;
  var score = 0;
  var maxScore = 0;
  var rightIndex = 0;
  answers.forEach(function(_ref2, ind) {
    var answer = _ref2.value,
      method = _ref2.method,
      totalScore = _ref2.score;

    if (!answer || !answer.length) {
      return;
    }

    var matches = 0;
    var totalMatches = method === BY_COUNT_METHOD ? answer[0] : answer.length;

    if (method === BY_COUNT_METHOD) {
      matches = userResponse.length;
    } else {
      userResponse.forEach(function(col) {
        if (
          answer.some(function(ans) {
            return (0, _isEqual2["default"])(ans, col);
          })
        ) {
          matches++;
        }
      });
    }

    var currentScore;

    if (method === BY_COUNT_METHOD) {
      currentScore = matches === totalMatches ? totalScore : 0;
    } else {
      currentScore = userResponse.length === answer.length && matches === totalMatches ? totalScore : 0;
    }

    score = Math.max(score, currentScore);
    maxScore = Math.max(maxScore, totalScore);

    if (currentScore === score && score !== 0) {
      rightIndex = ind;
    }
  });
  var evaluation = [];

  if (answers[rightIndex].method === BY_COUNT_METHOD) {
    userResponse.forEach(function(col, i) {
      if (i < answers[rightIndex].value[0]) {
        evaluation.push(true);
      } else {
        evaluation.push(false);
      }
    });
  } else {
    userResponse.forEach(function(col) {
      evaluation.push(
        answers[rightIndex].value.some(function(ans) {
          return (0, _isEqual2["default"])(ans, col);
        })
      );
    });
  }

  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
};

var partialCompareFunction = function partialCompareFunction(_ref3) {
  var answers = _ref3.answers,
    _ref3$userResponse = _ref3.userResponse,
    userResponse = _ref3$userResponse === void 0 ? [] : _ref3$userResponse;
  var score = 0;
  var maxScore = 0;
  var rightIndex = 0;
  answers.forEach(function(_ref4, ind) {
    var answer = _ref4.value,
      method = _ref4.method,
      totalScore = _ref4.score;

    if (!answer || !answer.length) {
      return;
    }

    var matches = 0;
    var totalMatches = method === BY_COUNT_METHOD ? answer[0] : answer.length;
    var scorePerAnswer = totalScore / totalMatches;

    if (method === BY_COUNT_METHOD) {
      matches = userResponse.length;
    } else {
      userResponse.forEach(function(col) {
        if (
          answer.some(function(ans) {
            return (0, _isEqual2["default"])(ans, col);
          })
        ) {
          matches++;
        }
      });
    }

    var currentScore = scorePerAnswer * matches;
    score = Math.max(score, currentScore);
    maxScore = Math.max(maxScore, totalScore);

    if (currentScore === score && score !== 0) {
      rightIndex = ind;
    }
  });
  var evaluation = [];

  if (answers[rightIndex].method === BY_COUNT_METHOD) {
    userResponse.forEach(function(col, i) {
      if (i < answers[rightIndex].value[0]) {
        evaluation.push(true);
      } else {
        evaluation.push(false);
      }
    });
  } else {
    userResponse.forEach(function(col) {
      evaluation.push(
        answers[rightIndex].value.some(function(ans) {
          return (0, _isEqual2["default"])(ans, col);
        })
      );
    });
  }

  var rightLen =
    answers[rightIndex].method === BY_COUNT_METHOD ? answers[rightIndex].value[0] : answers[rightIndex].value.length;
  return {
    score: score > maxScore ? maxScore : score,
    maxScore: maxScore,
    evaluation: evaluation,
    rightLen: rightLen
  };
};

var evaluator = function evaluator(_ref5) {
  var _ref5$userResponse = _ref5.userResponse,
    userResponse = _ref5$userResponse === void 0 ? [] : _ref5$userResponse,
    validation = _ref5.validation;
  var validResponse = validation.validResponse,
    altResponses = validation.altResponses,
    scoringType = validation.scoringType;
  var answers = [validResponse].concat((0, _toConsumableArray2["default"])(altResponses));

  switch (scoringType) {
    case _scoring.ScoringType.EXACT_MATCH:
      return (0, _exactMatchTemplate["default"])(exactCompareFunction, {
        userResponse: userResponse,
        answers: answers,
        validation: validation
      });

    case _scoring.ScoringType.PARTIAL_MATCH:
    case _scoring.ScoringType.PARTIAL_MATCH_V2:
    default:
      return (0, _partialMatchTemplate["default"])(partialCompareFunction, {
        userResponse: userResponse,
        answers: answers,
        validation: validation
      });
  }
};

var _default = evaluator;
exports["default"] = _default;
