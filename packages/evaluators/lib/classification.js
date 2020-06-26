"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _flatMap2 = _interopRequireDefault(require("lodash/flatMap"));

var _identity2 = _interopRequireDefault(require("lodash/identity"));

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _scoring = require("./const/scoring");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function getEvaluations() {
  var correctAnswer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var userAnswer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var evaluation = {};
  Object.keys(userAnswer).forEach(function (containerId) {
    var userAttemptedResponseIds = userAnswer[containerId] || [];
    var correctAnswerResponseIds = correctAnswer[containerId] || [];
    userAttemptedResponseIds.forEach(function (responseId) {
      evaluation[containerId] = evaluation[containerId] || {};
      evaluation[containerId][responseId] = correctAnswerResponseIds.includes(responseId);
    });
  });
  return evaluation;
}
/**
 * exact match evaluator
 * @param {Array} answers - possible set of correct answer
 * @param {Array} userReponse - answers set by user
 */


var exactMatchEvaluator = function exactMatchEvaluator() {
  var answers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var userResponse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var evaluation = {};
  var score = 0;
  var maxScore = 0; // evaluate for each set of possible correct answer.

  var _iterator = _createForOfIteratorHelper(answers),
      _step;

  try {
    var _loop = function _loop() {
      var correctAnswer = _step.value;
      var answer = correctAnswer.value,
          possibleMaxScore = correctAnswer.score; // handle the empty scenario.
      // if (!Array.isArray(answer)) {
      //   continue;
      // }
      // maxScore is max amongs all possible maxScores in possible set of responses.

      maxScore = Math.max(possibleMaxScore || 0, maxScore);
      var correct = true; // check if all rows matches.
      // check equality in set handles order issue - here order in each row of response doesnt matter.

      Object.keys(answer).forEach(function (key) {
        var correctAnswers = answer[key] || [];
        var userAnswers = userResponse[key] || [];

        if (!userAnswers.length > 0 || !(0, _isEqual2["default"])(correctAnswers.slice().sort(), userAnswers.slice().sort())) {
          correct = false;
        }
      }); // if muliple set of correct answer matches, give user max among them!

      if (correct) {
        score = Math.max(score, possibleMaxScore || 0);
      }
    };

    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  if (score) {
    // if score exist, that means its a perfect match. hence set every element
    // in every row as true.
    Object.keys(userResponse).forEach(function (containerId) {
      var responseIds = userResponse[containerId] || [];
      evaluation[containerId] = evaluation[containerId] || {};
      responseIds.forEach(function (responseId) {
        evaluation[containerId][responseId] = true;
      });
    });
  } else {
    // if its not a perfect match,
    // construct evaluation based on first possible set of answer.
    var answer = answers[0].value;
    evaluation = getEvaluations(answer, userResponse);
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
  var evaluation = {};
  var score = 0;
  var maxScore = 0;

  var _iterator2 = _createForOfIteratorHelper(answers),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var answer = _step2.value;
      var currentAnswer = answer.value,
          possibleMaxScore = answer.score;
      maxScore = Math.max(maxScore, possibleMaxScore || 0);
      var currentEvalution = getEvaluations(currentAnswer, userResponse);
      var answersCount = (0, _flatMap2["default"])(Object.values(currentAnswer), _identity2["default"]).length;
      var correctCount = Object.values(currentEvalution).reduce(function (acc, obj) {
        var correct = Object.values(obj).filter(_identity2["default"]).length;
        acc += correct;
        return acc;
      }, 0);
      var currentScore = possibleMaxScore * correctCount / answersCount;

      if (currentScore > score) {
        score = currentScore;
        evaluation = currentEvalution;
      } else {
        evaluation = currentEvalution;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
};

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