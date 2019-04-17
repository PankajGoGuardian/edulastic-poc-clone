"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _flatten2 = _interopRequireDefault(require("lodash/flatten"));

var _omitBy2 = _interopRequireDefault(require("lodash/omitBy"));

var _axios = _interopRequireDefault(require("axios"));

var _scoring = require("./const/scoring");

var url = "https://1nz4dq81w6.execute-api.us-east-1.amazonaws.com/dev/evaluate";

var evaluate = function evaluate(data) {
  return _axios["default"].post(url, (0, _objectSpread2["default"])({}, data)).then(function(result) {
    return result.data;
  });
};

var getChecks = function getChecks(validation) {
  var altResponses = validation.alt_responses || [];
  var flattenValidResponses = (0, _flatten2["default"])(validation.valid_response.value);
  var flattenAltResponses = altResponses.reduce(function(acc, res) {
    return [].concat(
      (0, _toConsumableArray2["default"])(acc),
      (0, _toConsumableArray2["default"])((0, _flatten2["default"])(res.value))
    );
  }, []);
  var values = [].concat(
    (0, _toConsumableArray2["default"])(flattenValidResponses),
    (0, _toConsumableArray2["default"])(flattenAltResponses)
  );
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
      } else if (key === "allowThousandsSeparator") {
        return acc;
      } else if (key === "setDecimalSeparator") {
        acc += "".concat(key, "='").concat(fieldVal, "'");
      } else if (key === "allowedUnits") {
        acc += "".concat(key, "=[").concat(fieldVal, "]");
      } else if (key === "syntax") {
        acc += options.argument === undefined ? fieldVal : "".concat(fieldVal, "=").concat(options.argument);
      } else {
        acc += "".concat(key, "=").concat(fieldVal);
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
};

var checkCorrect =
  /*#__PURE__*/
  (function() {
    var _ref2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(_ref) {
        var correctAnswers,
          userResponse,
          checks,
          valid,
          _iteratorNormalCompletion,
          _didIteratorError,
          _iteratorError,
          _iterator,
          _step,
          res,
          _iteratorNormalCompletion2,
          _didIteratorError2,
          _iteratorError2,
          _iterator2,
          _step2,
          correct,
          data,
          _ref3,
          result;

        return _regenerator["default"].wrap(
          function _callee$(_context) {
            while (1) {
              switch ((_context.prev = _context.next)) {
                case 0:
                  (correctAnswers = _ref.correctAnswers), (userResponse = _ref.userResponse), (checks = _ref.checks);
                  valid = false;
                  _iteratorNormalCompletion = true;
                  _didIteratorError = false;
                  _iteratorError = undefined;
                  _context.prev = 5;
                  _iterator = userResponse[Symbol.iterator]();

                case 7:
                  if ((_iteratorNormalCompletion = (_step = _iterator.next()).done)) {
                    _context.next = 50;
                    break;
                  }

                  res = _step.value;
                  _iteratorNormalCompletion2 = true;
                  _didIteratorError2 = false;
                  _iteratorError2 = undefined;
                  _context.prev = 12;
                  _iterator2 = correctAnswers[Symbol.iterator]();

                case 14:
                  if ((_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done)) {
                    _context.next = 33;
                    break;
                  }

                  correct = _step2.value;
                  data = {
                    input: res.replace(/\\ /g, " "),
                    expected: correct ? correct.replace(/\\ /g, " ") : ":",
                    checks: checks
                  };
                  _context.prev = 17;
                  _context.next = 20;
                  return evaluate(data);

                case 20:
                  _ref3 = _context.sent;
                  result = _ref3.result;

                  if (!(result === "true")) {
                    _context.next = 25;
                    break;
                  }

                  valid = true;
                  return _context.abrupt("break", 33);

                case 25:
                  _context.next = 30;
                  break;

                case 27:
                  _context.prev = 27;
                  _context.t0 = _context["catch"](17);
                  return _context.abrupt("continue", 30);

                case 30:
                  _iteratorNormalCompletion2 = true;
                  _context.next = 14;
                  break;

                case 33:
                  _context.next = 39;
                  break;

                case 35:
                  _context.prev = 35;
                  _context.t1 = _context["catch"](12);
                  _didIteratorError2 = true;
                  _iteratorError2 = _context.t1;

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
                  _iteratorNormalCompletion = true;
                  _context.next = 7;
                  break;

                case 50:
                  _context.next = 56;
                  break;

                case 52:
                  _context.prev = 52;
                  _context.t2 = _context["catch"](5);
                  _didIteratorError = true;
                  _iteratorError = _context.t2;

                case 56:
                  _context.prev = 56;
                  _context.prev = 57;

                  if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                    _iterator["return"]();
                  }

                case 59:
                  _context.prev = 59;

                  if (!_didIteratorError) {
                    _context.next = 62;
                    break;
                  }

                  throw _iteratorError;

                case 62:
                  return _context.finish(59);

                case 63:
                  return _context.finish(56);

                case 64:
                  return _context.abrupt("return", valid);

                case 65:
                case "end":
                  return _context.stop();
              }
            }
          },
          _callee,
          null,
          [[5, 52, 56, 64], [12, 35, 39, 47], [17, 27], [40, , 42, 46], [57, , 59, 63]]
        );
      })
    );

    return function checkCorrect(_x) {
      return _ref2.apply(this, arguments);
    };
  })(); // exact match evaluator

var exactMatchEvaluator =
  /*#__PURE__*/
  (function() {
    var _ref4 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(userResponse, answers, checks) {
        var score,
          maxScore,
          evaluation,
          getAnswerCorrectMethods,
          _iteratorNormalCompletion3,
          _didIteratorError3,
          _iteratorError3,
          _iterator3,
          _step3,
          answer,
          corrects,
          valid,
          _iteratorNormalCompletion4,
          _didIteratorError4,
          _iteratorError4,
          _iterator4,
          _step4,
          correctAnswers,
          res,
          isExact;

        return _regenerator["default"].wrap(
          function _callee2$(_context2) {
            while (1) {
              switch ((_context2.prev = _context2.next)) {
                case 0:
                  score = 0;
                  maxScore = 1;
                  evaluation = [];
                  _context2.prev = 3;

                  getAnswerCorrectMethods = function getAnswerCorrectMethods(answer) {
                    if (Array.isArray(answer.value)) {
                      return answer.value.map(function(val) {
                        return val.map(function(_ref5) {
                          var value = _ref5.value;
                          return value;
                        });
                      });
                    }

                    return [];
                  };
                  /* eslint-disable */

                  _iteratorNormalCompletion3 = true;
                  _didIteratorError3 = false;
                  _iteratorError3 = undefined;
                  _context2.prev = 8;
                  _iterator3 = answers[Symbol.iterator]();

                case 10:
                  if ((_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done)) {
                    _context2.next = 50;
                    break;
                  }

                  answer = _step3.value;
                  corrects = getAnswerCorrectMethods(answer);
                  valid = [];
                  _iteratorNormalCompletion4 = true;
                  _didIteratorError4 = false;
                  _iteratorError4 = undefined;
                  _context2.prev = 17;
                  _iterator4 = corrects[Symbol.iterator]();

                case 19:
                  if ((_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done)) {
                    _context2.next = 29;
                    break;
                  }

                  correctAnswers = _step4.value;
                  _context2.next = 23;
                  return checkCorrect({
                    correctAnswers: correctAnswers,
                    userResponse: userResponse,
                    checks: checks
                  });

                case 23:
                  res = _context2.sent;
                  valid.push(res);

                  if (res) {
                    score = Math.max(answer.score, score);
                  }

                case 26:
                  _iteratorNormalCompletion4 = true;
                  _context2.next = 19;
                  break;

                case 29:
                  _context2.next = 35;
                  break;

                case 31:
                  _context2.prev = 31;
                  _context2.t0 = _context2["catch"](17);
                  _didIteratorError4 = true;
                  _iteratorError4 = _context2.t0;

                case 35:
                  _context2.prev = 35;
                  _context2.prev = 36;

                  if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                    _iterator4["return"]();
                  }

                case 38:
                  _context2.prev = 38;

                  if (!_didIteratorError4) {
                    _context2.next = 41;
                    break;
                  }

                  throw _iteratorError4;

                case 41:
                  return _context2.finish(38);

                case 42:
                  return _context2.finish(35);

                case 43:
                  maxScore = Math.max(answer.score, maxScore);
                  evaluation = [].concat((0, _toConsumableArray2["default"])(evaluation), valid);

                  isExact = function isExact(element) {
                    return element;
                  };

                  if (!evaluation.every(isExact)) {
                    score = 0;
                  }

                case 47:
                  _iteratorNormalCompletion3 = true;
                  _context2.next = 10;
                  break;

                case 50:
                  _context2.next = 56;
                  break;

                case 52:
                  _context2.prev = 52;
                  _context2.t1 = _context2["catch"](8);
                  _didIteratorError3 = true;
                  _iteratorError3 = _context2.t1;

                case 56:
                  _context2.prev = 56;
                  _context2.prev = 57;

                  if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                    _iterator3["return"]();
                  }

                case 59:
                  _context2.prev = 59;

                  if (!_didIteratorError3) {
                    _context2.next = 62;
                    break;
                  }

                  throw _iteratorError3;

                case 62:
                  return _context2.finish(59);

                case 63:
                  return _context2.finish(56);

                case 64:
                  _context2.next = 69;
                  break;

                case 66:
                  _context2.prev = 66;
                  _context2.t2 = _context2["catch"](3);
                  console.error(_context2.t2);

                case 69:
                  _context2.prev = 69;
                  return _context2.abrupt("return", {
                    score: score,
                    maxScore: maxScore,
                    evaluation: evaluation
                  });

                case 72:
                case "end":
                  return _context2.stop();
              }
            }
          },
          _callee2,
          null,
          [[3, 66, 69, 72], [8, 52, 56, 64], [17, 31, 35, 43], [36, , 38, 42], [57, , 59, 63]]
        );
      })
    );

    return function exactMatchEvaluator(_x2, _x3, _x4) {
      return _ref4.apply(this, arguments);
    };
  })();

var evaluator =
  /*#__PURE__*/
  (function() {
    var _ref7 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(_ref6) {
        var userResponse,
          validation,
          valid_response,
          _validation$alt_respo,
          alt_responses,
          scoring_type,
          attemptScore,
          answers,
          result,
          checks;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch ((_context3.prev = _context3.next)) {
              case 0:
                (userResponse = _ref6.userResponse), (validation = _ref6.validation);
                (valid_response = validation.valid_response),
                  (_validation$alt_respo = validation.alt_responses),
                  (alt_responses = _validation$alt_respo === void 0 ? [] : _validation$alt_respo),
                  (scoring_type = validation.scoring_type),
                  (attemptScore = validation.min_score_if_attempted);
                answers = [valid_response].concat((0, _toConsumableArray2["default"])(alt_responses));
                _context3.t0 = scoring_type;
                _context3.next = _context3.t0 === _scoring.ScoringType.EXACT_MATCH ? 6 : 6;
                break;

              case 6:
                checks = getChecks(validation);
                _context3.next = 9;
                return exactMatchEvaluator(userResponse, answers, checks);

              case 9:
                result = _context3.sent;

              case 10:
                // if score for attempting is greater than current score
                // let it be the score!
                if (!Number.isNaN(attemptScore) && attemptScore > result.score) {
                  result.score = attemptScore;
                }

                return _context3.abrupt("return", result);

              case 12:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      })
    );

    return function evaluator(_x5) {
      return _ref7.apply(this, arguments);
    };
  })();

var _default = evaluator;
exports["default"] = _default;
