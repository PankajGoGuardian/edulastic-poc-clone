"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _difference2 = _interopRequireDefault(require("lodash/difference"));

var _includes2 = _interopRequireDefault(require("lodash/includes"));

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var countExactMatchScores = function countExactMatchScores(compareFunction) {
  return function(_ref) {
    var answers = _ref.answers,
      _ref$userResponse = _ref.userResponse,
      userResponse = _ref$userResponse === void 0 ? [] : _ref$userResponse;
    var score = 0;
    var maxScore = 0;
    var rightLen = 0;
    var rightIndex = 0;
    var evaluation = [];
    answers.forEach(function(_ref2) {
      var answer = _ref2.value,
        totalScore = _ref2.score;

      if (!answer || !answer.length) {
        return;
      }

      var matches =
        userResponse.filter(function(resp, index) {
          switch (compareFunction) {
            case "innerDifference":
              return (0, _difference2.default)(answer[index], resp).length === 0;

            case "isEqual":
              return (0, _isEqual2.default)(answer[index], resp);

            default:
              return (0, _includes2.default)(answer, resp);
          }
        }).length === answer.length;
      var currentScore = matches ? totalScore : 0;
      score = Math.max(score, currentScore);
      maxScore = Math.max(maxScore, totalScore);

      if (currentScore === score && score !== 0) {
        rightLen = answer.length;
      }
    });
    userResponse.forEach(function(item, i) {
      switch (compareFunction) {
        case "innerDifference":
          evaluation[i] = (0, _difference2.default)(answers[rightIndex].value[i], item).length === 0;
          break;

        case "isEqual":
          evaluation[i] = (0, _isEqual2.default)(answers[rightIndex].value[i], item);
          break;

        default:
          evaluation[i] = (0, _includes2.default)(answers[rightIndex].value, item);
          break;
      }
    });
    return {
      score: score,
      maxScore: maxScore,
      rightLen: rightLen,
      evaluation: evaluation
    };
  };
};

var _default = countExactMatchScores;
exports.default = _default;
