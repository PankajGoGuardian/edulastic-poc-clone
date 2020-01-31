"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.getChecks = exports.evaluate = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _omitBy2 = _interopRequireDefault(require("lodash/omitBy"));

var _axios = _interopRequireDefault(require("axios"));

var _scoring = require("./const/scoring");

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

var url = process.env.POI_APP_MATH_EVALUATE_API || "https://edulastic-poc.snapwiz.net/math-api/evaluate";

var evaluate = function evaluate(data) {
  return _axios["default"]
    .post(url, _objectSpread({}, data))
    .then(function(result) {
      return result.data;
    })
    ["catch"](function(err) {
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
  return values.reduce(function(valAcc, val, valIndex) {
    var options = val.options || {};
    options = (0, _omitBy2["default"])(options, function(f) {
      return f === false;
    });
    var midRes = Object.keys(options).reduce(function(acc, key, i) {
      if (key === "interpretAsInterval" || key === "interpretAsNumber") {
        acc = acc === "equivSymbolic" ? "symbolic" : acc;
      }

      if (key === "allowedVariables" || key === "allowNumericOnly" || key === "unit") {
        return acc;
      }

      var fieldVal = options[key];
      acc += i === 0 ? ":" : "";

      if (key === "argument") {
        return acc;
      }

      if (fieldVal === false) {
        return acc;
      }

      if (key === "setThousandsSeparator") {
        if (fieldVal.length) {
          var stringArr = "[".concat(
            fieldVal.map(function(f) {
              return "'".concat(f, "'");
            }),
            "]"
          );

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
    }, val.method);

    if (midRes[midRes.length - 1] === ",") {
      midRes = midRes.slice(0, midRes.length - 1);
    }

    valAcc += midRes;
    valAcc += valIndex + 1 === values.length ? "" : ";";
    return valAcc;
  }, "");
}; // exact match evaluator

exports.getChecks = getChecks;

var exactMatchEvaluator = function exactMatchEvaluator() {
  var userResponse,
    answers,
    score,
    maxScore,
    evaluation,
    getAnswerCorrectMethods,
    _iteratorNormalCompletion,
    _didIteratorError,
    _iteratorError,
    _iterator,
    _step,
    answer,
    checks,
    corrects,
    valid,
    _iteratorNormalCompletion2,
    _didIteratorError2,
    _iteratorError2,
    _iterator2,
    _step2,
    correct,
    data,
    _ref,
    result,
    _args = arguments;

  return _regenerator["default"].async(
    function exactMatchEvaluator$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            userResponse = _args.length > 0 && _args[0] !== undefined ? _args[0] : "";
            answers = _args.length > 1 ? _args[1] : undefined;
            score = 0;
            maxScore = 0;
            evaluation = [];
            _context.prev = 5;

            getAnswerCorrectMethods = function getAnswerCorrectMethods(answer) {
              if (answer.value && answer.value.length) {
                return answer.value.map(function(val) {
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

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 10;
            _iterator = answers[Symbol.iterator]();

          case 12:
            if ((_iteratorNormalCompletion = (_step = _iterator.next()).done)) {
              _context.next = 55;
              break;
            }

            answer = _step.value;
            checks = getChecks(answer);
            corrects = getAnswerCorrectMethods(answer);
            valid = false;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context.prev = 20;
            _iterator2 = corrects[Symbol.iterator]();

          case 22:
            if ((_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done)) {
              _context.next = 35;
              break;
            }

            correct = _step2.value;
            data = {
              input: userResponse.replace(/\\ /g, " "),
              expected: correct ? correct.replace(/\\ /g, " ") : "",
              checks: checks
            };
            _context.next = 27;
            return _regenerator["default"].awrap(evaluate(data));

          case 27:
            _ref = _context.sent;
            result = _ref.result;

            if (!(result === "true")) {
              _context.next = 32;
              break;
            }

            valid = true;
            return _context.abrupt("break", 35);

          case 32:
            _iteratorNormalCompletion2 = true;
            _context.next = 22;
            break;

          case 35:
            _context.next = 41;
            break;

          case 37:
            _context.prev = 37;
            _context.t0 = _context["catch"](20);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t0;

          case 41:
            _context.prev = 41;
            _context.prev = 42;

            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }

          case 44:
            _context.prev = 44;

            if (!_didIteratorError2) {
              _context.next = 47;
              break;
            }

            throw _iteratorError2;

          case 47:
            return _context.finish(44);

          case 48:
            return _context.finish(41);

          case 49:
            if (valid) {
              score = Math.max(answer.score, score);
            }

            maxScore = Math.max(answer.score, maxScore);
            evaluation = [].concat((0, _toConsumableArray2["default"])(evaluation), [valid]);

          case 52:
            _iteratorNormalCompletion = true;
            _context.next = 12;
            break;

          case 55:
            _context.next = 61;
            break;

          case 57:
            _context.prev = 57;
            _context.t1 = _context["catch"](10);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 61:
            _context.prev = 61;
            _context.prev = 62;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 64:
            _context.prev = 64;

            if (!_didIteratorError) {
              _context.next = 67;
              break;
            }

            throw _iteratorError;

          case 67:
            return _context.finish(64);

          case 68:
            return _context.finish(61);

          case 69:
            _context.next = 74;
            break;

          case 71:
            _context.prev = 71;
            _context.t2 = _context["catch"](5);
            console.log(_context.t2);

          case 74:
            _context.prev = 74;
            return _context.abrupt("return", {
              score: score,
              maxScore: maxScore,
              evaluation: evaluation
            });

          case 77:
          case "end":
            return _context.stop();
        }
      }
    },
    null,
    null,
    [[5, 71, 74, 77], [10, 57, 61, 69], [20, 37, 41, 49], [42, , 44, 48], [62, , 64, 68]]
  );
};

var evaluator = function evaluator(_ref2) {
  var userResponse,
    validation,
    validResponse,
    _validation$altRespon,
    altResponses,
    scoringType,
    attemptScore,
    answers,
    expression,
    unit,
    result;

  return _regenerator["default"].async(function evaluator$(_context2) {
    while (1) {
      switch ((_context2.prev = _context2.next)) {
        case 0:
          (userResponse = _ref2.userResponse), (validation = _ref2.validation);
          (validResponse = validation.validResponse),
            (_validation$altRespon = validation.altResponses),
            (altResponses = _validation$altRespon === void 0 ? [] : _validation$altRespon),
            (scoringType = validation.scoringType),
            (attemptScore = validation.minScoreIfAttempted);
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
          return _regenerator["default"].awrap(exactMatchEvaluator(userResponse, answers));

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
  });
};

var _default = evaluator;
exports["default"] = _default;
