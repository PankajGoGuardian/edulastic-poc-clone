"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

var _getEvaluation = _interopRequireDefault(require("./getEvaluation"));

var _getMatches = _interopRequireDefault(require("./getMatches"));

var _clozeTextHelpers = require("./clozeTextHelpers");

var countExactMatchScores = function countExactMatchScores(compareFunction) {
  return function(_ref) {
    var answers = _ref.answers,
      _ref$userResponse = _ref.userResponse,
      userResponse = _ref$userResponse === void 0 ? [] : _ref$userResponse;
    var restOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var existingResponse = (0, _cloneDeep2["default"])(userResponse);

    if (!Array.isArray(userResponse)) {
      existingResponse = (0, _cloneDeep2["default"])(userResponse.value);
    }

    var score = 0;
    var maxScore = 0;
    var matchCount = 0;
    var rightLen = 0;
    var rightIndex = 0;
    answers.forEach(function(_ref2, index) {
      var answer = _ref2.value,
        totalScore = _ref2.score;

      if (!answer || !answer.length) {
        return;
      }

      var currentMatchCount = (0, _getMatches["default"])(
        existingResponse,
        answer,
        compareFunction
      );
      var matches = currentMatchCount === answer.length;

      if (restOptions.ignoreCase || restOptions.allowSingleLetterMistake) {
        matches =
          (0, _clozeTextHelpers.getClozeTextMatches)(existingResponse, answer, restOptions) ===
          answer.length;
      }

      var currentScore = matches && existingResponse.length === answer.length ? totalScore : 0;
      score = Math.max(score, currentScore);
      maxScore = Math.max(maxScore, totalScore);
      matchCount = Math.max(matchCount, currentMatchCount);

      if (
        (currentScore === score && score !== 0) ||
        (currentMatchCount === matchCount && matchCount !== 0)
      ) {
        rightLen = answer.length;
        rightIndex = index;
      }
    });
    var evaluation = (0, _getEvaluation["default"])(
      existingResponse,
      answers,
      rightIndex,
      compareFunction,
      restOptions
    );
    return {
      score: score,
      maxScore: maxScore,
      rightLen: rightLen,
      evaluation: evaluation
    };
  };
};

var _default = countExactMatchScores;
exports["default"] = _default;
