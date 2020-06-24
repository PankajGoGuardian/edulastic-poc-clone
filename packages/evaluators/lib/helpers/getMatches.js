"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _isObject2 = _interopRequireDefault(require("lodash/isObject"));

var _isString2 = _interopRequireDefault(require("lodash/isString"));

var _difference2 = _interopRequireDefault(require("lodash/difference"));

var _includes2 = _interopRequireDefault(require("lodash/includes"));

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _constants = require("@edulastic/constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var getMatches = function getMatches(response, answer, compareFunction) {
  return response.filter(function (resp, index) {
    var singleAns = (0, _isString2["default"])(answer[index]) ? answer[index].trim() : answer[index];
    var arrayAns = answer.map(function (ans) {
      return (0, _isString2["default"])(ans) ? ans.trim() : ans;
    });
    resp = (0, _isString2["default"])(resp) ? resp.trim() : resp;

    switch (compareFunction) {
      case _constants.evaluatorTypes.INNER_DIFFERENCE:
        return (0, _difference2["default"])(answer[index], resp).length === 0 && (0, _difference2["default"])(resp, answer[index]).length === 0;

      case _constants.evaluatorTypes.IS_EQUAL:
        if (answer[index] && (0, _isObject2["default"])(answer[index]) && answer[index].y) {
          return (0, _isEqual2["default"])(_objectSpread({}, answer[index], {
            y: +answer[index].y.toFixed(5)
          }), _objectSpread({}, resp, {
            y: +resp.y.toFixed(5)
          }));
        }

        return (0, _isEqual2["default"])(singleAns, resp);

      default:
        return (0, _includes2["default"])(arrayAns, resp);
    }
  }).length;
};

var _default = getMatches;
exports["default"] = _default;