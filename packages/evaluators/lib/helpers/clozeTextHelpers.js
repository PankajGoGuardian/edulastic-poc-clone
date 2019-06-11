"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClozeTextEvaluation = exports.getClozeTextMatches = exports.isLessThanOneMistake = void 0;

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var levenshteinDistance = function levenshteinDistance(s, t) {
  if (!s.length) return t.length;
  if (!t.length) return s.length;
  return Math.min(
    levenshteinDistance(s.substr(1), t) + 1,
    levenshteinDistance(t.substr(1), s) + 1,
    levenshteinDistance(s.substr(1), t.substr(1)) + (s[0] !== t[0] ? 1 : 0)
  );
};

var isLessThanOneMistake = function isLessThanOneMistake(userAnswer, validAnswer, ignoreCase) {
  if (ignoreCase) {
    userAnswer = userAnswer.toLowerCase();
    validAnswer = validAnswer.toLowerCase();
  }

  var mistakeCount = levenshteinDistance(userAnswer, validAnswer);
  return mistakeCount < 2;
};

exports.isLessThanOneMistake = isLessThanOneMistake;

var getClozeTextMatches = function getClozeTextMatches(response, answer, restOptions) {
  return response.filter(function(resp, index) {
    resp = (resp || "").trim();
    var ans = (answer[index] || "").trim();

    if (restOptions.allowSingleLetterMistake) {
      return isLessThanOneMistake(ans, resp, restOptions.ignoreCase);
    }

    if (restOptions.ignoreCase) {
      return (0, _isEqual2["default"])(
        answer[index].trim() ? answer[index].trim().toLowerCase() : null,
        resp.trim() ? resp.trim().toLowerCase() : undefined
      );
    }

    return (0, _isEqual2["default"])(answer[index].trim(), resp.trim());
  }).length;
};

exports.getClozeTextMatches = getClozeTextMatches;

var getClozeTextEvaluation = function getClozeTextEvaluation(response, answer, restOptions) {
  return response.map(function(resp, index) {
    resp = (resp || "").trim();
    var ans = (answer[index] || "").trim();

    if (restOptions.allowSingleLetterMistake) {
      return isLessThanOneMistake(ans, resp, restOptions.ignoreCase);
    }

    if (restOptions.ignoreCase) {
      return (0, _isEqual2["default"])(
        answer[index].trim() ? answer[index].trim().toLowerCase() : null,
        resp.trim() ? resp.trim().toLowerCase() : undefined
      );
    }

    return (0, _isEqual2["default"])(answer[index].trim(), resp.trim());
  });
};

exports.getClozeTextEvaluation = getClozeTextEvaluation;
