"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _maxBy = _interopRequireDefault(require("lodash/maxBy"));

var _scoring = require("./const/scoring");

var _rounding = require("./const/rounding");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var PARTIAL_MATCH = _scoring.ScoringType.PARTIAL_MATCH,
    EXACT_MATCH = _scoring.ScoringType.EXACT_MATCH;
var ROUND_DOWN = _rounding.rounding.ROUND_DOWN,
    NONE = _rounding.rounding.NONE;

function getMaxScoreFromValidAnswers(answers) {
  var getMaxScore = function getMaxScore(maxScore, obj) {
    maxScore = Math.max(maxScore, obj.score);
    return maxScore;
  };

  return answers.reduce(getMaxScore, 0);
}

function getEvaluations(_ref) {
  var _ref$validation = _ref.validation,
      validation = _ref$validation === void 0 ? {} : _ref$validation,
      _ref$userResponse = _ref.userResponse,
      userResponse = _ref$userResponse === void 0 ? [] : _ref$userResponse;
  var _validation$validResp = validation.validResponse,
      validResponse = _validation$validResp === void 0 ? {} : _validation$validResp,
      _validation$altRespon = validation.altResponses,
      altResponses = _validation$altRespon === void 0 ? [] : _validation$altRespon;
  var answers = [validResponse].concat((0, _toConsumableArray2["default"])(altResponses));
  var evaluations = [];
  var maxScore = getMaxScoreFromValidAnswers(answers);

  var _iterator = _createForOfIteratorHelper(answers),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var answer = _step.value;
      var answerScore = answer.score,
          _answer$value = answer.value,
          value = _answer$value === void 0 ? [] : _answer$value;

      if (!value.length) {
        throw new Error("answer cannot be empty");
      }

      var correctCount = 0;
      var incorrectCount = 0;
      var totalCount = value.length;
      var allCorrect = userResponse.length === value.length; // basic length check

      var currentEvaluation = {};
      var userAnswers = userResponse.entries();

      var _iterator2 = _createForOfIteratorHelper(userAnswers),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _step2$value = (0, _slicedToArray2["default"])(_step2.value, 2),
              index = _step2$value[0],
              id = _step2$value[1];

          var isCorrect = value.includes(id);

          if (isCorrect) {
            correctCount++;
          } else {
            allCorrect = false;
            incorrectCount++;
          }

          currentEvaluation[index] = isCorrect;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      var currentScore = answerScore / totalCount * correctCount;
      evaluations.push({
        correctCount: correctCount,
        incorrectCount: incorrectCount,
        totalCount: totalCount,
        allCorrect: allCorrect,
        currentScore: currentScore,
        maxScore: maxScore,
        evaluation: currentEvaluation
      });
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return evaluations;
}

function exactMatchEvaluator(_ref2) {
  var _ref2$validation = _ref2.validation,
      validation = _ref2$validation === void 0 ? {} : _ref2$validation,
      _ref2$userResponse = _ref2.userResponse,
      userResponse = _ref2$userResponse === void 0 ? [] : _ref2$userResponse;

  if (!userResponse.length) {
    var _validation$validResp2 = validation.validResponse;
    _validation$validResp2 = _validation$validResp2 === void 0 ? {} : _validation$validResp2;

    var _validation$validResp3 = _validation$validResp2.score,
        _maxScore = _validation$validResp3 === void 0 ? 0 : _validation$validResp3;

    return {
      score: 0,
      maxScore: _maxScore,
      evaluation: {}
    };
  }

  var evaluations = getEvaluations({
    validation: validation,
    userResponse: userResponse
  });

  var allCorrect = function allCorrect(obj) {
    return obj.allCorrect;
  };

  var bestMatch = evaluations.find(allCorrect);

  if (bestMatch) {
    var _maxScore2 = bestMatch.maxScore,
        _evaluation = bestMatch.evaluation;
    return {
      score: _maxScore2,
      maxScore: _maxScore2,
      evaluation: _evaluation
    };
  }

  var _evaluations = (0, _slicedToArray2["default"])(evaluations, 1),
      _evaluations$ = _evaluations[0],
      evaluation = _evaluations$ === void 0 ? {} : _evaluations$;

  var maxScore = evaluation.maxScore,
      highlights = evaluation.evaluation;
  return {
    score: 0,
    maxScore: maxScore,
    evaluation: highlights
  };
}

function partialMatchEvaluator(_ref3) {
  var _ref3$validation = _ref3.validation,
      validation = _ref3$validation === void 0 ? {} : _ref3$validation,
      _ref3$userResponse = _ref3.userResponse,
      userResponse = _ref3$userResponse === void 0 ? [] : _ref3$userResponse;

  if (!userResponse.length) {
    var _validation$validResp4 = validation.validResponse;
    _validation$validResp4 = _validation$validResp4 === void 0 ? {} : _validation$validResp4;

    var _validation$validResp5 = _validation$validResp4.score,
        _maxScore3 = _validation$validResp5 === void 0 ? 0 : _validation$validResp5;

    return {
      score: 0,
      maxScore: _maxScore3,
      evaluation: {}
    };
  }

  var evaluations = getEvaluations({
    validation: validation,
    userResponse: userResponse
  });

  var maxByScore = function maxByScore(obj) {
    return obj.currentScore;
  };

  var bestMatch = (0, _maxBy["default"])(evaluations, maxByScore);
  var maxScore = bestMatch.maxScore,
      incorrectCount = bestMatch.incorrectCount,
      totalCount = bestMatch.totalCount,
      evaluation = bestMatch.evaluation;
  var score = bestMatch.currentScore;
  var penaltyPoints = validation.penalty,
      _validation$rounding = validation.rounding,
      rounding = _validation$rounding === void 0 ? NONE : _validation$rounding;

  if (penaltyPoints && incorrectCount) {
    var penalisation = penaltyPoints / totalCount * incorrectCount;
    score = Math.max(0, score - penalisation);
  } // if round down is selected, but score achieved is not maxScore, round down to nearest integer


  if (rounding === ROUND_DOWN && score !== maxScore) {
    score = Math.floor(score);
  }

  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
}

var evaluator = function evaluator(_ref4) {
  var _ref4$userResponse = _ref4.userResponse,
      userResponse = _ref4$userResponse === void 0 ? [] : _ref4$userResponse,
      _ref4$validation = _ref4.validation,
      validation = _ref4$validation === void 0 ? {} : _ref4$validation;
  var validResponse = validation.validResponse;

  if (!validResponse) {
    throw new Error("validResponse cannot be empty");
  }

  var scoringType = validation.scoringType;

  switch (scoringType) {
    case EXACT_MATCH:
      return exactMatchEvaluator({
        userResponse: userResponse,
        validation: validation
      });

    case PARTIAL_MATCH:
      return partialMatchEvaluator({
        userResponse: userResponse,
        validation: validation
      });

    default:
      throw new Error("Invalid scoring type\n         Provided: ".concat(scoringType, "\n         Expected: one of [").concat(EXACT_MATCH, ", ").concat(PARTIAL_MATCH, "] "));
  }
};

var _default = evaluator;
exports["default"] = _default;