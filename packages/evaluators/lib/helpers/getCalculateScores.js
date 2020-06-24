"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

// eslint-disable-next-line max-len
var getCalculateScores = function getCalculateScores(score, mScore, _ref) {
  var minScoreIfAttempted = _ref.minScoreIfAttempted,
      automarkable = _ref.automarkable,
      maxScore = _ref.maxScore;
  var newScore = score;
  var newMaxScore = mScore;

  if (automarkable) {
    if (minScoreIfAttempted) {
      newMaxScore = Math.max(mScore, minScoreIfAttempted);
      newScore = Math.max(minScoreIfAttempted, score);
    }
  } else if (maxScore) {
    newScore = 0;
    newMaxScore = Math.max(mScore, maxScore);
  }

  return {
    newScore: newScore,
    newMaxScore: newMaxScore
  };
};

var _default = getCalculateScores;
exports["default"] = _default;