"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _zip2 = _interopRequireDefault(require("lodash/zip"));

var _identity2 = _interopRequireDefault(require("lodash/identity"));

var _scoring = require("./const/scoring");

var exactMatchEvaluator = function exactMatchEvaluator() {
  var answers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var userResponse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var evaluation = [];
  var score = 0;
  var maxScore = 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (
      var _iterator = answers[Symbol.iterator](), _step;
      !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
      _iteratorNormalCompletion = true
    ) {
      var validAnswer = _step.value;
      var answer = validAnswer.value,
        possibleMaxScore = validAnswer.score;
      if (!Array.isArray(answer)) continue;
      maxScore = Math.max(possibleMaxScore || 0, maxScore);
      var currentEvaluation = answer.map(function(item, index) {
        var resp = userResponse === null || userResponse === void 0 ? void 0 : userResponse[index];
        if (!item && !resp) return true;
        return item === resp;
      });
      if (currentEvaluation.every(_identity2["default"])) score = possibleMaxScore;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (score) {
    evaluation = Array(userResponse.length).fill(true);
  } else {
    var correctAnswer = _zip2["default"].apply(
      void 0,
      (0, _toConsumableArray2["default"])(
        answers.map(function(i) {
          return i.value;
        })
      )
    );

    evaluation = userResponse.map(function(item, index) {
      if (!item) return null;
      return correctAnswer[index].includes(item);
    });
  }

  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
};

var partialMatchEvaluator = function partialMatchEvaluator() {
  var answers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var userResponse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var evaluation = [];
  var score = 0;
  var maxScore = 0;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (
      var _iterator2 = answers[Symbol.iterator](), _step2;
      !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
      _iteratorNormalCompletion2 = true
    ) {
      var validAnswer = _step2.value;
      var answer = validAnswer.value,
        possibleMaxScore = validAnswer.score;
      if (!Array.isArray(answer)) continue;
      maxScore = Math.max(possibleMaxScore || 0, maxScore);
      var answerLength = answer.filter(_identity2["default"]).length;
      var currentEvaluation = answer.map(function(item, index) {
        var resp = userResponse === null || userResponse === void 0 ? void 0 : userResponse[index];
        if (!resp) return null;
        return item === resp;
      });
      var correctCount = currentEvaluation.filter(_identity2["default"]).length;
      var currentScore = (possibleMaxScore / answerLength) * correctCount;

      if (currentScore > score) {
        evaluation = currentEvaluation;
        score = currentScore;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  if (evaluation.length === 0) {
    var _answers$;

    var correctAnswer = ((_answers$ = answers[0]) === null || _answers$ === void 0 ? void 0 : _answers$.value) || [];
    evaluation = userResponse.map(function(item, index) {
      if (!item) return null;
      return item === correctAnswer[index];
    });
  }

  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
};
/**
 *
 * match list evaluator.
 */

var evaluator = function evaluator(_ref) {
  var _ref$userResponse = _ref.userResponse,
    userResponse = _ref$userResponse === void 0 ? [] : _ref$userResponse,
    validation = _ref.validation;
  var validResponse = validation.validResponse,
    _validation$altRespon = validation.altResponses,
    altResponses = _validation$altRespon === void 0 ? [] : _validation$altRespon,
    scoringType = validation.scoringType;
  var answers = [validResponse].concat((0, _toConsumableArray2["default"])(altResponses));
  return scoringType === _scoring.ScoringType.EXACT_MATCH
    ? exactMatchEvaluator(answers, userResponse)
    : partialMatchEvaluator(answers, userResponse);
};

var _default = evaluator;
exports["default"] = _default;
