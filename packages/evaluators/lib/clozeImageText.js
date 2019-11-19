"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _maxBy2 = _interopRequireDefault(require("lodash/maxBy"));

var _fastLevenshtein = require("fast-levenshtein");

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
  var responses =
    ((_validation$validResp = validation.validResponse) === null || _validation$validResp === void 0
      ? void 0
      : _validation$validResp.value) || [];
  var answerSet = [];
  responses.forEach(function(response, index) {
    answers.forEach(function(answer) {
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

  var answers = [(0, _objectSpread2["default"])({}, validation.validResponse)].concat(
    (0, _toConsumableArray2["default"])(validation.altResponses || [])
  );
  var optionCount =
    ((_validation$validResp2 = validation.validResponse) === null || _validation$validResp2 === void 0
      ? void 0
      : _validation$validResp2.value.length) || 0;
  var maxScore = answers.reduce(function(_maxScore, answer) {
    return Math.max(_maxScore, answer.score);
  }, 0);
  var score = 0; // grouping all the responses at particular index together

  var answerSet = groupChoiceByIndex(answers, validation);
  var evaluation = response.map(function(resp, index) {
    var answersByIndex = answerSet[index].values();
    var found = false;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (
        var _iterator = answersByIndex[Symbol.iterator](), _step;
        !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
        _iteratorNormalCompletion = true
      ) {
        var answer = _step.value;
        found = compareChoice(answer, resp, allowSingleLetterMistake, ignoreCase);
        if (found) break;
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

    return found;
  });
  var correctAnswerCount = evaluation.filter(function(elem) {
    return elem;
  }).length;

  if (validation.scoringType === "partialMatch") {
    // get partial score
    score = maxScore * (correctAnswerCount / optionCount);
  } else if (correctAnswerCount === optionCount) {
    // exactMatch  (all correct)
    score = Math.min(correctAnswerCount, maxScore);
  }

  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
};

var normalEvaluator = function normalEvaluator(_ref2) {
  var _validation$validResp3;

  var userResponse = _ref2.userResponse,
    validation = _ref2.validation;
  var optionCount =
    ((_validation$validResp3 = validation.validResponse) === null || _validation$validResp3 === void 0
      ? void 0
      : _validation$validResp3.value.length) || 0;
  var allowSingleLetterMistake = validation.allowSingleLetterMistake,
    ignoreCase = validation.ignoreCase;
  var response = (0, _toConsumableArray2["default"])(userResponse); // combining the correct answer and alternate answers

  var answers = [(0, _objectSpread2["default"])({}, validation.validResponse)].concat(
    (0, _toConsumableArray2["default"])(validation.altResponses || [])
  );
  var maxScore = answers.reduce(function(_maxScore, answer) {
    return Math.max(_maxScore, answer.score);
  }, 0);
  var evaluations = [];
  answers.forEach(function(answer) {
    // calculating the evaluation against every answer
    var currentEvaluation = answer.value.map(function(val, _index) {
      return compareChoice(val, response[_index], allowSingleLetterMistake, ignoreCase);
    });
    var currentScore = 0;
    var correctAnswerCount = currentEvaluation.filter(function(elem) {
      return elem;
    }).length;

    if (validation.scoringType === "partialMatch") {
      currentScore = parseFloat(answer.answerScore * (correctAnswerCount / optionCount)).toFixed(2);
    } else if (correctAnswerCount === response.length) {
      // exact match
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
    score: correct.score,
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
  return validation.mixAndMatch
    ? mixAndMatchEvaluator({
        userResponse: userResponse,
        validation: validation
      })
    : normalEvaluator({
        userResponse: userResponse,
        validation: validation
      });
};

var _default = evaluator;
exports["default"] = _default;
