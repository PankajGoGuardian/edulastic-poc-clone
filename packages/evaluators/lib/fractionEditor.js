"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _get = _interopRequireDefault(require("lodash/get"));

var evaluator = function evaluator(_ref) {
  var _ref$validation = _ref.validation,
    validation = _ref$validation === void 0 ? {} : _ref$validation,
    _ref$userResponse = _ref.userResponse,
    userResponse = _ref$userResponse === void 0 ? [] : _ref$userResponse;
  var evaluation = {};
  var maxScore = (0, _get["default"])(validation, "validResponse.score", 0);
  var correctLength = (0, _get["default"])(validation, "validResponse.value", -1);
  var userAttempted = userResponse.length;
  var score = userAttempted === correctLength ? maxScore : 0;
  userResponse.forEach(function(key) {
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
