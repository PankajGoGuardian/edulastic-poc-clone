"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.getChecks = exports.evaluate = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _omitBy2 = _interopRequireDefault(require("lodash/omitBy"));

var _axios = _interopRequireDefault(require("axios"));

var _scoring = require("./const/scoring");

var url = process.env.POI_APP_MATH_EVALUATE_API || "https://edulastic-poc.snapwiz.net/math-api/evaluate";

var evaluate = function evaluate(data) {
  return _axios["default"].post(url, (0, _objectSpread2["default"])({}, data)).then(function(result) {
    return result.data;
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
          acc += "".concat(key, "=").concat(stringArr);
        } else {
          return acc;
        }
      } else if (key === "setDecimalSeparator") {
        acc += "".concat(key, "='").concat(fieldVal, "'");
      } else if (key === "allowedUnits") {
        acc += "".concat(key, "=[").concat(fieldVal, "]");
      } else if (key === "syntax") {
        acc += options.argument === undefined ? fieldVal : "".concat(fieldVal, "=").concat(options.argument);
      } else if (key === "field") {
        acc += "".concat(fieldVal);
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

var exactMatchEvaluator =
  /*#__PURE__*/
  (function() {
    var _ref = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(userResponse, answers) {
        var score,
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
          _ref2,
          result;

        return _regenerator["default"].wrap(
          function _callee$(_context) {
            while (1) {
              switch ((_context.prev = _context.next)) {
                case 0:
                  score = 0;
                  maxScore = 1;
                  evaluation = [];
                  _context.prev = 3;

                  getAnswerCorrectMethods = function getAnswerCorrectMethods(answer) {
                    if (answer.value && answer.value.length) {
                      return answer.value.map(function(val) {
                        return val.value;
                      });
                    }

                    return [];
                  };
                  /* eslint-disable */

                  _iteratorNormalCompletion = true;
                  _didIteratorError = false;
                  _iteratorError = undefined;
                  _context.prev = 8;
                  _iterator = answers[Symbol.iterator]();

                case 10:
                  if ((_iteratorNormalCompletion = (_step = _iterator.next()).done)) {
                    _context.next = 53;
                    break;
                  }

                  answer = _step.value;
                  checks = getChecks(answer);
                  corrects = getAnswerCorrectMethods(answer);
                  valid = false;
                  _iteratorNormalCompletion2 = true;
                  _didIteratorError2 = false;
                  _iteratorError2 = undefined;
                  _context.prev = 18;
                  _iterator2 = corrects[Symbol.iterator]();

                case 20:
                  if ((_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done)) {
                    _context.next = 33;
                    break;
                  }

                  correct = _step2.value;
                  data = {
                    input: userResponse.replace(/\\ /g, " "),
                    expected: correct ? correct.replace(/\\ /g, " ") : "",
                    checks: checks
                  };
                  _context.next = 25;
                  return evaluate(data);

                case 25:
                  _ref2 = _context.sent;
                  result = _ref2.result;

                  if (!(result === "true")) {
                    _context.next = 30;
                    break;
                  }

                  valid = true;
                  return _context.abrupt("break", 33);

                case 30:
                  _iteratorNormalCompletion2 = true;
                  _context.next = 20;
                  break;

                case 33:
                  _context.next = 39;
                  break;

                case 35:
                  _context.prev = 35;
                  _context.t0 = _context["catch"](18);
                  _didIteratorError2 = true;
                  _iteratorError2 = _context.t0;

                case 39:
                  _context.prev = 39;
                  _context.prev = 40;

                  if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                    _iterator2["return"]();
                  }

                case 42:
                  _context.prev = 42;

                  if (!_didIteratorError2) {
                    _context.next = 45;
                    break;
                  }

                  throw _iteratorError2;

                case 45:
                  return _context.finish(42);

                case 46:
                  return _context.finish(39);

                case 47:
                  if (valid) {
                    score = Math.max(answer.score, score);
                  }

                  maxScore = Math.max(answer.score, maxScore);
                  evaluation = [].concat((0, _toConsumableArray2["default"])(evaluation), [valid]);

                case 50:
                  _iteratorNormalCompletion = true;
                  _context.next = 10;
                  break;

                case 53:
                  _context.next = 59;
                  break;

                case 55:
                  _context.prev = 55;
                  _context.t1 = _context["catch"](8);
                  _didIteratorError = true;
                  _iteratorError = _context.t1;

                case 59:
                  _context.prev = 59;
                  _context.prev = 60;

                  if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                    _iterator["return"]();
                  }

                case 62:
                  _context.prev = 62;

                  if (!_didIteratorError) {
                    _context.next = 65;
                    break;
                  }

                  throw _iteratorError;

                case 65:
                  return _context.finish(62);

                case 66:
                  return _context.finish(59);

                case 67:
                  _context.next = 72;
                  break;

                case 69:
                  _context.prev = 69;
                  _context.t2 = _context["catch"](3);
                  console.log(_context.t2);

                case 72:
                  _context.prev = 72;
                  return _context.abrupt("return", {
                    score: score,
                    maxScore: maxScore,
                    evaluation: evaluation
                  });

                case 75:
                case "end":
                  return _context.stop();
              }
            }
          },
          _callee,
          null,
          [[3, 69, 72, 75], [8, 55, 59, 67], [18, 35, 39, 47], [40, , 42, 46], [60, , 62, 66]]
        );
      })
    );

    return function exactMatchEvaluator(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();

var evaluator =
  /*#__PURE__*/
  (function() {
    var _ref4 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(_ref3) {
        var userResponse,
          validation,
          valid_response,
          _validation$alt_respo,
          alt_responses,
          scoring_type,
          attemptScore,
          answers,
          result;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                (userResponse = _ref3.userResponse), (validation = _ref3.validation);
                (valid_response = validation.valid_response),
                  (_validation$alt_respo = validation.alt_responses),
                  (alt_responses = _validation$alt_respo === void 0 ? [] : _validation$alt_respo),
                  (scoring_type = validation.scoring_type),
                  (attemptScore = validation.min_score_if_attempted);
                answers = [valid_response].concat((0, _toConsumableArray2["default"])(alt_responses));
                _context2.t0 = scoring_type;
                _context2.next = _context2.t0 === _scoring.ScoringType.EXACT_MATCH ? 6 : 6;
                break;

              case 6:
                _context2.next = 8;
                return exactMatchEvaluator(userResponse, answers);

              case 8:
                result = _context2.sent;

              case 9:
                // if score for attempting is greater than current score
                // let it be the score!
                if (!Number.isNaN(attemptScore) && attemptScore > result.score) {
                  result.score = attemptScore;
                }

                return _context2.abrupt("return", result);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      })
    );

    return function evaluator(_x3) {
      return _ref4.apply(this, arguments);
    };
  })();

var _default = evaluator;
exports["default"] = _default;
