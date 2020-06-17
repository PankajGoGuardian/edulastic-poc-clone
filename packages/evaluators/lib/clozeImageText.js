"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _maxBy2 = _interopRequireDefault(require("lodash/maxBy"));

var _fastLevenshtein = require("fast-levenshtein");

var _rounding = require("./const/rounding");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 *
 * @param {string} answer  // correct answer
 * @param {string} response  // user response
 * @param {boolean} allowSingleLetterMistake  // is single letter mistake accepted
 * @param {boolean} ignoreCase  // ignore case of answer
 */
var compareChoice = function compareChoice(answer, response) {
  var allowSingleLetterMistake = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var ignoreCase = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var attempted = response && response.length;
  if (!attempted) return null;
  answer = ignoreCase ? answer.trim().toLowerCase() : answer.trim();
  response = ignoreCase ? response.trim().toLowerCase() : response.trim(); // is single letter mistake allowed?
  // if yes, then check if "levenshtein-distance" is less than 1
  // else it should be a an exact match
  // eslint-disable-next-line max-len

  return allowSingleLetterMistake ? (0, _fastLevenshtein.get)(answer, response) <= 1 : answer === response;
};
/**
 *
 * @param {Array} userResponse
 * @param {Object} validation
 */


var groupChoiceByIndex = function groupChoiceByIndex(answers, validation) {
  var _validation$validResp;

  // grouping the answers at particular index together
  // [[a11, a12], [a21, a22]] => [[a11, a21], a[12, a22]]
  var responses = ((_validation$validResp = validation.validResponse) === null || _validation$validResp === void 0 ? void 0 : _validation$validResp.value) || [];
  var answerSet = [];
  responses.forEach(function (response, index) {
    answers.forEach(function (answer) {
      answerSet[index] = answerSet[index] || new Set([]);
      answerSet[index].add(answer.value[index]);
    });
  });
  return answerSet;
};

var mixAndMatchEvaluator = function mixAndMatchEvaluator(_ref) {
  var _validation$validResp2;

  var userResponse = _ref.userResponse,
      validation = _ref.validation;
  var response = (0, _toConsumableArray2["default"])(userResponse);
  var allowSingleLetterMistake = validation.allowSingleLetterMistake,
      ignoreCase = validation.ignoreCase; // combining validAnswer and alternate answers

  var answers = [_objectSpread({}, validation.validResponse)].concat((0, _toConsumableArray2["default"])(validation.altResponses || []));
  var optionCount = ((_validation$validResp2 = validation.validResponse) === null || _validation$validResp2 === void 0 ? void 0 : _validation$validResp2.value.length) || 0;
  var maxScore = answers.reduce(function (_maxScore, answer) {
    return Math.max(_maxScore, answer.score);
  }, 0);
  var score = 0; // grouping all the responses at particular index together

  var answerSet = groupChoiceByIndex(answers, validation);
  var evaluation = response.map(function (resp, index) {
    var answersByIndex = answerSet[index].values();
    var found = false;

    var _iterator = _createForOfIteratorHelper(answersByIndex),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var answer = _step.value;
        found = compareChoice(answer, resp, allowSingleLetterMistake, ignoreCase);
        if (found) break;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return found;
  });
  var correctAnswerCount = evaluation.filter(function (elem) {
    return elem;
  }).length;

  if (validation.scoringType === "partialMatch") {
    // get partial score
    score = maxScore * (correctAnswerCount / optionCount);

    if (validation.penalty) {
      var totalPenalty = validation.penalty;
      var wrongAnswerCount = evaluation.filter(function (val) {
        return val === false;
      }).length;
      var penalty = totalPenalty / optionCount * wrongAnswerCount;
      score = Math.max(0, score - penalty); // if round down, but score achieved is not full score, then round down to nearest integer

      if (validation.rounding === _rounding.rounding.ROUND_DOWN && score !== maxScore) {
        score = Math.floor(score);
      }
    }
  } else if (correctAnswerCount === optionCount) {
    // exactMatch  (all correct)
    score = maxScore;
  }

  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
};

var normalEvaluator = function normalEvaluator(_ref2) {
  var userResponse = _ref2.userResponse,
      validation = _ref2.validation;
  var _validation$validResp3 = validation.validResponse;
  _validation$validResp3 = _validation$validResp3 === void 0 ? {} : _validation$validResp3;
  var _validation$validResp4 = _validation$validResp3.value,
      value = _validation$validResp4 === void 0 ? [] : _validation$validResp4;
  var optionCount = value.length || 0;
  var allowSingleLetterMistake = validation.allowSingleLetterMistake,
      ignoreCase = validation.ignoreCase; // combining the correct answer and alternate answers

  var answers = [_objectSpread({}, validation.validResponse)].concat((0, _toConsumableArray2["default"])(validation.altResponses || []));
  var maxScore = answers.reduce(function (_maxScore, answer) {
    return Math.max(_maxScore, answer.score);
  }, 0);
  var evaluations = [];
  var response = (0, _toConsumableArray2["default"])(userResponse);
  answers.forEach(function (answer) {
    var currentScore = 0; // calculating the evaluation for every answer
    // comparing user respose with the answer

    var currentEvaluation = answer.value.map(function (ans, _index) {
      return compareChoice(ans, response[_index], allowSingleLetterMistake, ignoreCase);
    });
    var correctAnswerCount = currentEvaluation.filter(function (elem) {
      return elem;
    }).length;

    if (validation.scoringType === "partialMatch") {
      currentScore = parseFloat(answer.score * (correctAnswerCount / optionCount));

      if (validation.penalty) {
        var totalPenalty = validation.penalty;
        var wrongAnswerCount = currentEvaluation.filter(function (val) {
          return val === false;
        }).length;
        var penalty = totalPenalty / optionCount * wrongAnswerCount;
        currentScore = Math.max(0, currentScore - penalty); // if round down, but score achieved is not full score, then round down to nearest integer

        if (validation.rounding === _rounding.rounding.ROUND_DOWN && currentScore !== answer.score) {
          currentScore = Math.floor(currentScore);
        }
      }
    } else if (correctAnswerCount === optionCount && optionCount !== 0) {
      // exact match (all correct)
      currentScore = answer.score;
    }

    evaluations.push({
      score: currentScore,
      evaluation: currentEvaluation
    });
  }); // the evaluation which gave the highest score

  var correct = (0, _maxBy2["default"])(evaluations, "score"); // returning the first evaluation if no answers are correct

  var evaluation = correct.score === 0 ? evaluations[0].evaluation : correct.evaluation;
  return {
    evaluation: evaluation,
    score: parseFloat(correct.score),
    maxScore: maxScore
  };
};
/**
 *
 * @param {Array} userResponse
 * @param {Object} validation
 */


var evaluator = function evaluator(_ref3) {
  var _ref3$userResponse = _ref3.userResponse,
      userResponse = _ref3$userResponse === void 0 ? [] : _ref3$userResponse,
      _ref3$validation = _ref3.validation,
      validation = _ref3$validation === void 0 ? {} : _ref3$validation;
  return validation.mixAndMatch ? mixAndMatchEvaluator({
    userResponse: userResponse,
    validation: validation
  }) : normalEvaluator({
    userResponse: userResponse,
    validation: validation
  });
};

var _default = evaluator;
exports["default"] = _default;