"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOrderlitEvaluation = exports.getOrderlistMatchs = void 0;

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _keys2 = _interopRequireDefault(require("lodash/keys"));

var getOrderlistMatchs = function getOrderlistMatchs(response, answer) {
  return (0, _keys2["default"])(response).map(function (key) {
    return (0, _isEqual2["default"])(response[key], answer[key]);
  }).filter(function (t) {
    return t;
  }).length;
};

exports.getOrderlistMatchs = getOrderlistMatchs;

var getOrderlitEvaluation = function getOrderlitEvaluation(response, answers) {
  var rightIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var answer = answers[rightIndex];

  if (!answer) {
    return {};
  }

  var value = answer.value;
  var evaluation = {};
  (0, _keys2["default"])(response).forEach(function (id) {
    evaluation[id] = (0, _isEqual2["default"])(response[id], value[id]);
  });
  return evaluation;
};

exports.getOrderlitEvaluation = getOrderlitEvaluation;