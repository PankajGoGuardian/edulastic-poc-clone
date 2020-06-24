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

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var exactMatchEvaluator = function exactMatchEvaluator() {
  var rawAnswers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var rawUserResponse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var listKeys = Object.keys(rawAnswers[0].value);
  var answers = rawAnswers.map(function (ans) {
    return {
      score: ans.score,
      value: listKeys.map(function (l) {
        return ans.value[l] || null;
      })
    };
  });
  var userResponse = listKeys.map(function (l) {
    return rawUserResponse[l] || null;
  });
  var evaluation = [];
  var score = 0;
  var maxScore = 0;

  var _iterator = _createForOfIteratorHelper(answers),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var validAnswer = _step.value;
      var answer = validAnswer.value,
          possibleMaxScore = validAnswer.score;
      if (!Array.isArray(answer)) continue;
      maxScore = Math.max(possibleMaxScore || 0, maxScore);
      var currentEvaluation = answer.map(function (item, index) {
        var resp = userResponse === null || userResponse === void 0 ? void 0 : userResponse[index];
        if (!item && !resp) return true;
        return item === resp;
      });
      if (currentEvaluation.every(_identity2["default"])) score = possibleMaxScore;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  if (score) {
    evaluation = Array(userResponse.length).fill(true);
  } else {
    var correctAnswer = _zip2["default"].apply(void 0, (0, _toConsumableArray2["default"])(answers.map(function (i) {
      return i.value;
    })));

    evaluation = userResponse.map(function (item, index) {
      if (!item) return null;
      return correctAnswer[index].includes(item);
    });
  }

  var evaluationMap = {};
  listKeys.forEach(function (l, ind) {
    return evaluationMap[l] = evaluation[ind];
  });
  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluationMap
  };
};

var partialMatchEvaluator = function partialMatchEvaluator() {
  var rawAnswers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var rawUserResponse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var listKeys = Object.keys(rawAnswers[0].value);
  var answers = rawAnswers.map(function (ans) {
    return {
      score: ans.score,
      value: listKeys.map(function (l) {
        return ans.value[l] || null;
      })
    };
  });
  var userResponse = listKeys.map(function (l) {
    return rawUserResponse[l] || null;
  });
  var evaluation = [];
  var score = 0;
  var maxScore = 0;

  var _iterator2 = _createForOfIteratorHelper(answers),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var validAnswer = _step2.value;
      var answer = validAnswer.value,
          possibleMaxScore = validAnswer.score;
      if (!Array.isArray(answer)) continue;
      maxScore = Math.max(possibleMaxScore || 0, maxScore);
      var answerLength = answer.filter(_identity2["default"]).length;
      var currentEvaluation = answer.map(function (item, index) {
        var resp = userResponse === null || userResponse === void 0 ? void 0 : userResponse[index];
        if (!resp) return null;
        return item === resp;
      });
      var correctCount = currentEvaluation.filter(_identity2["default"]).length;
      var currentScore = possibleMaxScore / answerLength * correctCount;

      if (currentScore > score) {
        evaluation = currentEvaluation;
        score = currentScore;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  if (evaluation.length === 0) {
    var _answers$;

    var correctAnswer = ((_answers$ = answers[0]) === null || _answers$ === void 0 ? void 0 : _answers$.value) || [];
    evaluation = userResponse.map(function (item, index) {
      if (!item) return null;
      return item === correctAnswer[index];
    });
  }

  var evaluationMap = {};
  listKeys.forEach(function (l, ind) {
    return evaluationMap[l] = evaluation[ind];
  });
  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluationMap
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
  return scoringType === _scoring.ScoringType.EXACT_MATCH ? exactMatchEvaluator(answers, userResponse) : partialMatchEvaluator(answers, userResponse);
};

var _default = evaluator;
exports["default"] = _default;