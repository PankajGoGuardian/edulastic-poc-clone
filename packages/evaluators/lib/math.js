"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.getChecks = exports.evaluate = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _omitBy2 = _interopRequireDefault(require("lodash/omitBy"));

var _axios = _interopRequireDefault(require("axios"));

var _scoring = require("./const/scoring");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var url = process.env.POI_APP_MATH_EVALUATE_API || "https://edulastic-poc.snapwiz.net/math-api/evaluate";

var evaluate = function evaluate(data) {
  return _axios["default"].post(url, _objectSpread({}, data)).then(function (result) {
    return result.data;
  })["catch"](function (err) {
    // for certain req err respose is undefined
    if (err && !err.response) throw err;

    if (!data.expected) {
      console.error("Error from mathengine", err.response.data);
      return {};
    }

    throw err.response.data;
  });
};

exports.evaluate = evaluate;

var getChecks = function getChecks(answer) {
  var values = answer.value || [];
  return values.reduce(function (valAcc, val, valIndex) {
    var options = val.options || {};
    options = (0, _omitBy2["default"])(options, function (f) {
      return f === false;
    });
    var optionsKeyed = Object.keys(options);
    var optionsToFilter = ["allowedVariables", "allowNumericOnly", "unit", "argument"];
    var filteredOptions = optionsKeyed.filter(function (key) {
      return !optionsToFilter.includes(key);
    }); // combine the method and options using colon
    // combine only if there are sub options

    var initialValue = filteredOptions.length > 0 ? "".concat(val.method, ":") : "".concat(val.method);
    var midRes = optionsKeyed.reduce(function (acc, key, i) {
      if (key === "interpretAsInterval" || key === "interpretAsNumber") {
        acc = acc === "equivSymbolic" ? "symbolic" : acc;
      }

      if (key === "allowedVariables" || key === "allowNumericOnly" || key === "unit") {
        return acc;
      }

      var fieldVal = options[key];

      if (key === "argument") {
        return acc;
      }

      if (fieldVal === false) {
        return acc;
      }

      if (key === "setThousandsSeparator") {
        if (fieldVal.length) {
          var stringArr = "[".concat(fieldVal.map(function (f) {
            return "'".concat(f, "'");
          }), "]");

          if (fieldVal.includes(".") && !options.setDecimalSeparator) {
            acc += "".concat(key, "=").concat(stringArr, ",setDecimalSeparator=','");
          } else {
            acc += "".concat(key, "=").concat(stringArr);
          }
        } else {
          return acc;
        }
      } else if (key === "setDecimalSeparator") {
        if (fieldVal === "," && !options.setThousandsSeparator) {
          acc += "".concat(key, "='").concat(fieldVal, "',setThousandsSeparator='.'");
        } else {
          acc += "".concat(key, "='").concat(fieldVal, "'");
        }
      } else if (key === "allowedUnits") {
        acc += "".concat(key, "=[").concat(fieldVal, "]");
      } else if (key === "syntax") {
        acc += options.argument === undefined ? fieldVal : "".concat(fieldVal, "=").concat(options.argument);
      } else if (key === "field") {
        acc += "".concat(fieldVal);
      } else if (key === "tolerance") {
        acc += "".concat(key, "=").concat(fieldVal);
      } else {
        acc += "".concat(key);
      }

      return "".concat(acc, ",");
    }, initialValue);

    if (midRes[midRes.length - 1] === ",") {
      midRes = midRes.slice(0, midRes.length - 1);
    }

    valAcc += midRes;
    valAcc += valIndex + 1 === values.length ? "" : ";";
    return valAcc;
  }, "");
}; // exact match evaluator


exports.getChecks = getChecks;

var exactMatchEvaluator = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var userResponse,
        answers,
        score,
        maxScore,
        evaluation,
        getAnswerCorrectMethods,
        _iterator,
        _step,
        answer,
        checks,
        corrects,
        valid,
        _iterator2,
        _step2,
        correct,
        data,
        _yield$evaluate,
        result,
        _args = arguments;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            userResponse = _args.length > 0 && _args[0] !== undefined ? _args[0] : "";
            answers = _args.length > 1 ? _args[1] : undefined;
            score = 0;
            maxScore = 0;
            evaluation = [];
            _context.prev = 5;

            getAnswerCorrectMethods = function getAnswerCorrectMethods(answer) {
              if (answer.value && answer.value.length) {
                return answer.value.map(function (val) {
                  var _val$options = val.options,
                      options = _val$options === void 0 ? {} : _val$options;

                  if (options.unit) {
                    if (val.value.search("=") === -1) {
                      return val.value + options.unit;
                    }

                    return val.value.replace(/=/gm, "".concat(options.unit, "="));
                  }

                  return val.value;
                });
              }

              return [];
            };
            /* eslint-disable */


            _iterator = _createForOfIteratorHelper(answers);
            _context.prev = 8;

            _iterator.s();

          case 10:
            if ((_step = _iterator.n()).done) {
              _context.next = 44;
              break;
            }

            answer = _step.value;
            checks = getChecks(answer);

            if (typeof checks === "string") {
              if (checks.includes("equivLiteral")) {
                checks = checks.replace(/equivLiteral/g, "literal");
              } else if (checks.includes("equivSyntax")) {
                checks = checks.replace(/equivSyntax/g, "syntax");
              }
            }

            corrects = getAnswerCorrectMethods(answer);
            valid = false;
            _iterator2 = _createForOfIteratorHelper(corrects);
            _context.prev = 17;

            _iterator2.s();

          case 19:
            if ((_step2 = _iterator2.n()).done) {
              _context.next = 31;
              break;
            }

            correct = _step2.value;
            data = {
              input: userResponse.replace(/\\ /g, " "),
              expected: correct ? correct.replace(/\\ /g, " ") : "",
              checks: checks
            };
            _context.next = 24;
            return evaluate(data);

          case 24:
            _yield$evaluate = _context.sent;
            result = _yield$evaluate.result;

            if (!(result === "true")) {
              _context.next = 29;
              break;
            }

            valid = true;
            return _context.abrupt("break", 31);

          case 29:
            _context.next = 19;
            break;

          case 31:
            _context.next = 36;
            break;

          case 33:
            _context.prev = 33;
            _context.t0 = _context["catch"](17);

            _iterator2.e(_context.t0);

          case 36:
            _context.prev = 36;

            _iterator2.f();

            return _context.finish(36);

          case 39:
            if (valid) {
              score = Math.max(answer.score, score);
            }

            maxScore = Math.max(answer.score, maxScore);
            evaluation = [].concat((0, _toConsumableArray2["default"])(evaluation), [valid]);

          case 42:
            _context.next = 10;
            break;

          case 44:
            _context.next = 49;
            break;

          case 46:
            _context.prev = 46;
            _context.t1 = _context["catch"](8);

            _iterator.e(_context.t1);

          case 49:
            _context.prev = 49;

            _iterator.f();

            return _context.finish(49);

          case 52:
            _context.next = 57;
            break;

          case 54:
            _context.prev = 54;
            _context.t2 = _context["catch"](5);
            console.log(_context.t2);

          case 57:
            _context.prev = 57;
            return _context.abrupt("return", {
              score: score,
              maxScore: maxScore,
              evaluation: evaluation
            });

          case 60:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[5, 54, 57, 60], [8, 46, 49, 52], [17, 33, 36, 39]]);
  }));

  return function exactMatchEvaluator() {
    return _ref.apply(this, arguments);
  };
}();

var evaluator = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
    var userResponse, validation, validResponse, _validation$altRespon, altResponses, scoringType, attemptScore, answers, expression, unit, result;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userResponse = _ref2.userResponse, validation = _ref2.validation;
            validResponse = validation.validResponse, _validation$altRespon = validation.altResponses, altResponses = _validation$altRespon === void 0 ? [] : _validation$altRespon, scoringType = validation.scoringType, attemptScore = validation.minScoreIfAttempted;
            answers = [validResponse].concat((0, _toConsumableArray2["default"])(altResponses)); // if its math unit type, derive answer by making into a string.

            if ((0, _typeof2["default"])(userResponse) === "object" && (userResponse.expression || userResponse.unit)) {
              expression = userResponse.expression || "";
              unit = userResponse.unit || "";

              if (expression.search("=") === -1) {
                userResponse = expression + unit;
              } else {
                userResponse = expression.replace(/=/gm, "".concat(unit, "="));
              }
            }

            _context2.t0 = scoringType;
            _context2.next = _context2.t0 === _scoring.ScoringType.EXACT_MATCH ? 7 : 7;
            break;

          case 7:
            _context2.next = 9;
            return exactMatchEvaluator(userResponse, answers);

          case 9:
            result = _context2.sent;

          case 10:
            // if score for attempting is greater than current score
            // let it be the score!
            if (!Number.isNaN(attemptScore) && attemptScore > result.score) {
              result.score = attemptScore;
            }

            return _context2.abrupt("return", result);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function evaluator(_x) {
    return _ref3.apply(this, arguments);
  };
}();

var _default = evaluator;
exports["default"] = _default;