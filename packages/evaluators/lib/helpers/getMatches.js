"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _isString2 = _interopRequireDefault(require("lodash/isString"));

var _difference2 = _interopRequireDefault(require("lodash/difference"));

var _includes2 = _interopRequireDefault(require("lodash/includes"));

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _constants = require("@edulastic/constants");

var getMatches = function getMatches(response, answer, compareFunction) {
  return response.filter(function(resp, index) {
    var singleAns = (0, _isString2["default"])(answer[index]) ? answer[index].trim() : answer[index];
    var arrayAns = answer.map(function(ans) {
      return (0, _isString2["default"])(ans) ? ans.trim() : ans;
    });
    resp = (0, _isString2["default"])(resp) ? resp.trim() : resp;

    switch (compareFunction) {
      case _constants.evaluatorTypes.INNER_DIFFERENCE:
        return (
          (0, _difference2["default"])(answer[index], resp).length === 0 &&
          (0, _difference2["default"])(resp, answer[index]).length === 0
        );

      case _constants.evaluatorTypes.IS_EQUAL:
        if ((0, _typeof2["default"])(answer[index]) === "object" && answer[index].y) {
          return (0, _isEqual2["default"])(
            (0, _objectSpread2["default"])({}, answer[index], {
              y: +answer[index].y.toFixed(5)
            }),
            (0, _objectSpread2["default"])({}, resp, {
              y: +resp.y.toFixed(5)
            })
          );
        }

        return (0, _isEqual2["default"])(singleAns, resp);

      default:
        return (0, _includes2["default"])(arrayAns, resp);
    }
  }).length;
};

var _default = getMatches;
exports["default"] = _default;
