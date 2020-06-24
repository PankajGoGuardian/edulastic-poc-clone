"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var evaluator = function evaluator(_ref) {
  var _ref$validation = _ref.validation,
      validation = _ref$validation === void 0 ? {} : _ref$validation,
      _ref$userResponse = _ref.userResponse,
      userResponse = _ref$userResponse === void 0 ? [] : _ref$userResponse;
  var evaluation = {};
  var maxScore = validation.validResponse && validation.validResponse.score || 1;
  var correctLength = validation.validResponse && validation.validResponse.value || -1;
  var userAttempted = userResponse.length;
  var score = userAttempted === correctLength ? maxScore : 0;
  userResponse.forEach(function (key) {
    evaluation[key] = score ? true : false;
  });
  return {
    evaluation: evaluation,
    score: score,
    maxScore: maxScore
  };
};

var _default = evaluator;
exports["default"] = _default;