"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var exactMatchEvaluator = function exactMatchEvaluator(_ref) {
  var minScoreIfAttempted = _ref.minScoreIfAttempted,
      validResponse = _ref.validResponse;
  return {
    score: undefined,
    maxScore: (validResponse === null || validResponse === void 0 ? void 0 : validResponse.score) || 0,
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