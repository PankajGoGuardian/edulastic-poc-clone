"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

var _immer = _interopRequireDefault(require("immer"));

var _constants = require("@edulastic/constants");

var _mainEvaluator = _interopRequireDefault(require("./mainEvaluator"));

var evaluator = (0, _mainEvaluator["default"])(_constants.evaluatorTypes.IS_EQUAL);

var clozeImageDragDropEvaluator = function clozeImageDragDropEvaluator(_ref) {
  var _ref$userResponse = _ref.userResponse,
    userResponse = _ref$userResponse === void 0 ? [] : _ref$userResponse,
    validation = _ref.validation;
  var newUserResponse = (0, _cloneDeep2["default"])(userResponse);
  newUserResponse = newUserResponse.map(function(res) {
    if (res) {
      delete res.rect;

      if (res.responseBoxID) {
        return res;
      }
    }

    return null;
  });
  var modifiedValidation = (0, _immer["default"])(validation, function(draft) {
    var _draft$validResponse;

    draft === null || draft === void 0
      ? void 0
      : (_draft$validResponse = draft.validResponse) === null || _draft$validResponse === void 0
      ? void 0
      : _draft$validResponse.value.forEach(function(val) {
          delete val.rect;
        });
  });
  var evaluation = evaluator({
    userResponse: newUserResponse,
    validation: modifiedValidation
  });
  return evaluation;
};

var _default = clozeImageDragDropEvaluator;
exports["default"] = _default;
