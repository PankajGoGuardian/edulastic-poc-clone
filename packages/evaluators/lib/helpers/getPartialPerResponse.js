"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var getPartialPerResponse = function getPartialPerResponse(count) {
  return function (_ref) {
    var score = _ref.score,
        maxScore = _ref.maxScore,
        evaluation = _ref.evaluation;
    return {
      score: score * count,
      maxScore: maxScore * count,
      evaluation: evaluation
    };
  };
};

var _default = getPartialPerResponse;
exports.default = _default;