"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphsComparison = _interopRequireDefault(require("./graphs-comparison"));

var evaluator = function evaluator(_ref) {
  var userResponse = _ref.userResponse,
      validation = _ref.validation;
  var result = {};
  var correct = false;

  var compareResult = _graphsComparison.default.checkAnswer(validation, userResponse);

  correct = compareResult.commonResult;

  if (!correct) {
    if (validation.alt_responses && validation.alt_responses.length > 0) {
      for (var i = 0; i < validation.alt_responses.length; i++) {
        /** for compatibility with graphs-comparison's checkAnswer method */
        var tmpValidation = {};
        tmpValidation.valid_response = validation.alt_responses[i];

        var altResponseCompareResult = _graphsComparison.default.checkAnswer(tmpValidation, userResponse);

        correct = altResponseCompareResult.commonResult;

        if (correct) {
          compareResult = altResponseCompareResult;
          break;
        }
      }
    }
  }

  result = compareResult;
  return result;
};

var _default = evaluator;
exports.default = _default;