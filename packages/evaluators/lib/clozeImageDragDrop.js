"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _immer = _interopRequireDefault(require("immer"));

var _constants = require("@edulastic/constants");

var _mainEvaluator = _interopRequireDefault(require("./mainEvaluator"));

var evaluator = (0, _mainEvaluator["default"])(_constants.evaluatorTypes.IS_EQUAL);

var clozeImageDragDropEvaluator = function clozeImageDragDropEvaluator(_ref) {
  var _ref$userResponse = _ref.userResponse,
      userResponse = _ref$userResponse === void 0 ? [] : _ref$userResponse,
      validation = _ref.validation;
  // eslint-disable-next-line no-unused-vars
  var newUserResponse = (0, _immer["default"])(userResponse, function (draft) {
    draft = draft.map(function (res) {
      if (res) {
        delete res.rect;

        if (res.responseBoxID) {
          return res;
        }
      }

      return res;
    });
  });
  var modifiedValidation = (0, _immer["default"])(validation, function (draft) {
    var _draft$altResponses = draft.altResponses,
        altResponses = _draft$altResponses === void 0 ? [] : _draft$altResponses,
        _draft$validResponse = draft.validResponse;
    _draft$validResponse = _draft$validResponse === void 0 ? {} : _draft$validResponse;
    var _draft$validResponse$ = _draft$validResponse.value,
        value = _draft$validResponse$ === void 0 ? [] : _draft$validResponse$;
    value.forEach(function (val) {
      if (val && val.rect) {
        delete val.rect;
      }
    });
    altResponses.forEach(function (altResponse) {
      var _altResponse$value = altResponse.value,
          answer = _altResponse$value === void 0 ? [] : _altResponse$value;
      answer.forEach(function (obj) {
        if (obj && obj.rect) {
          delete obj.rect;
        }
      });
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