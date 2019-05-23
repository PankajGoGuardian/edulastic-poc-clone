"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClozeTextEvaluation = exports.getClozeTextMatches = exports.isLessThanOneMistake = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var isLessThanOneMistake = function isLessThanOneMistake(userAnswer, validAnswer, ignoreCase) {
  var userAnswerArray = (0, _toConsumableArray2["default"])(userAnswer);
  var validAnswerArray = (0, _toConsumableArray2["default"])(validAnswer);
  var mistakesCount = 0;

  if (ignoreCase) {
    userAnswerArray.forEach(function(letter, index) {
      if (letter.toLowerCase() !== validAnswerArray[index].toLowerCase()) {
        mistakesCount++;
      }
    });
  } else {
    userAnswerArray.forEach(function(letter, index) {
      if (letter !== validAnswerArray[index]) {
        mistakesCount++;
      }
    });
  }

  return mistakesCount <= 1;
};

exports.isLessThanOneMistake = isLessThanOneMistake;

var getClozeTextMatches = function getClozeTextMatches(response, answer, restOptions) {
  return response.filter(function(resp, index) {
    if (restOptions.allowSingleLetterMistake) {
      return isLessThanOneMistake(answer[index].trim(), resp.trim(), restOptions.ignoreCase);
    }

    if (restOptions.ignoreCase) {
      return (0, _isEqual2["default"])(answer[index].trim().toLowerCase(), resp.trim().toLowerCase());
    }

    return (0, _isEqual2["default"])(answer[index].trim(), resp.trim());
  }).length;
};

exports.getClozeTextMatches = getClozeTextMatches;

var getClozeTextEvaluation = function getClozeTextEvaluation(response, answer, restOptions) {
  return response.map(function(resp, index) {
    if (restOptions.allowSingleLetterMistake) {
      return isLessThanOneMistake(answer[index].trim(), resp.trim(), restOptions.ignoreCase);
    }

    if (restOptions.ignoreCase) {
      return (0, _isEqual2["default"])(answer[index].trim().toLowerCase(), resp.trim().toLowerCase());
    }

    return (0, _isEqual2["default"])(answer[index].trim(), resp.trim());
  });
};

exports.getClozeTextEvaluation = getClozeTextEvaluation;
