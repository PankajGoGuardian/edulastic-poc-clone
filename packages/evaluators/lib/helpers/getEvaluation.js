"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _isObject2 = _interopRequireDefault(require("lodash/isObject"));

var _isString2 = _interopRequireDefault(require("lodash/isString"));

var _isBoolean2 = _interopRequireDefault(require("lodash/isBoolean"));

var _difference2 = _interopRequireDefault(require("lodash/difference"));

var _includes2 = _interopRequireDefault(require("lodash/includes"));

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _constants = require("@edulastic/constants");

var _clozeTextHelpers = require("./clozeTextHelpers");

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        (0, _defineProperty2["default"])(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}

var getEvaluation = function getEvaluation(response, answers, rightIndex, compareFunction) {
  var restOptions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var evaluation = [];

  if (restOptions.ignoreCase || restOptions.allowSingleLetterMistake) {
    evaluation = (0, _clozeTextHelpers.getClozeTextEvaluation)(response, answers[rightIndex].value, restOptions);
  } else {
    response.forEach(function(item, i) {
      var ans = answers[rightIndex].value[i];

      switch (compareFunction) {
        case _constants.evaluatorTypes.INNER_DIFFERENCE:
          evaluation[i] =
            (0, _difference2["default"])(answers[rightIndex].value[i], item).length === 0 &&
            (0, _difference2["default"])(item, answers[rightIndex].value[i]).length === 0;
          break;

        case _constants.evaluatorTypes.IS_EQUAL:
          if (ans && (0, _isObject2["default"])(ans) && ans.y) {
            evaluation[i] = (0, _isEqual2["default"])(
              _objectSpread({}, ans, {
                y: +ans.y.toFixed(5)
              }),
              _objectSpread({}, item, {
                y: +item.y.toFixed(5)
              })
            );
          } else {
            ans = (0, _isString2["default"])(ans) ? ans.trim() : ans;
            item = (0, _isString2["default"])(item) ? item.trim() : item;
            evaluation[i] = (0, _isEqual2["default"])(ans, item);
          }

          break;

        case _constants.evaluatorTypes.MCQ_TYPE:
        default:
          evaluation[i] = (0, _includes2["default"])(answers[rightIndex].value, item);
          break;
      }
    });
  }

  return evaluation.filter(function(item) {
    return (0, _isBoolean2["default"])(item);
  });
};

var _default = getEvaluation;
exports["default"] = _default;
