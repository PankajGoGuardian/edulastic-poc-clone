"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var exactMatchEvaluator = function exactMatchEvaluator(_ref) {
  var minScoreIfAttempted = _ref.minScoreIfAttempted,
    maxScore = _ref.maxScore;
  return {
    score: minScoreIfAttempted || 0,
    maxScore: maxScore || 1,
    evaluation: {}
  };
};

var evaluator = function evaluator(_ref2) {
  var _ref2$validation = _ref2.validation,
    validation = _ref2$validation === void 0 ? {} : _ref2$validation;
  return exactMatchEvaluator(validation);
};

var _default = evaluator;
exports["default"] = _default;
