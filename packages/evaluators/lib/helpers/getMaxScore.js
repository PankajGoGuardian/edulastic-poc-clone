"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var getMaxScore = function getMaxScore(answers) {
  return answers.reduce(function (acc, answer) {
    acc = Math.max(acc, answer.score);
    return acc;
  }, 0);
};

var _default = getMaxScore;
exports.default = _default;