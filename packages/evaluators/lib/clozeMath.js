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

var _clozeText = _interopRequireDefault(require("./clozeText"));

var url = "https://edulastic-poc.snapwiz.net/math-api/evaluate";

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
                  _iterator = correctAnswers[Symbol.iterator]();

                case 7:
                  if ((_iteratorNormalCompletion = (_step = _iterator.next()).done)) {
                    _context.next = 27;
                    break;
                  }

                  correct = _step.value;
                  data = {
                    input: userResponse.replace(/\\ /g, " "),
                    expected: correct ? correct.replace(/\\ /g, " ") : ":",
                    checks: checks
                  };
                  console.log(data);
                  _context.prev = 11;
                  _context.next = 14;
                  return evaluate(data);

                case 14:
                  _ref3 = _context.sent;
                  result = _ref3.result;

                  if (!(result === "true")) {
                    _context.next = 19;
                    break;
                  }

                  valid = true;
                  return _context.abrupt("break", 27);

                case 19:
                  _context.next = 24;
                  break;

                case 21:
                  _context.prev = 21;
                  _context.t0 = _context["catch"](11);
                  return _context.abrupt("continue", 24);

                case 24:
                  _iteratorNormalCompletion = true;
                  _context.next = 7;
                  break;

                case 27:
                  _context.next = 33;
                  break;

                case 29:
                  _context.prev = 29;
                  _context.t1 = _context["catch"](5);
                  _didIteratorError = true;
                  _iteratorError = _context.t1;

                case 33:
                  _context.prev = 33;
                  _context.prev = 34;

                  if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                    _iterator["return"]();
                  }

                case 36:
                  _context.prev = 36;

                  if (!_didIteratorError) {
                    _context.next = 39;
                    break;
                  }

                  throw _iteratorError;

                case 39:
                  return _context.finish(36);

                case 40:
                  return _context.finish(33);

                case 41:
                  return _context.abrupt("return", valid);

                case 42:
                case "end":
                  return _context.stop();
              }
            }
          },
          _callee,
          null,
          [[5, 29, 33, 41], [11, 21], [34, , 36, 40]]
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
      _regenerator["default"].mark(function _callee5(userResponse, answers, checks) {
        var score, maxScore, evaluation, correctIndex, asyncForEach, getAnswerCorrectMethods;
        return _regenerator["default"].wrap(
          function _callee5$(_context5) {
            while (1) {
              switch ((_context5.prev = _context5.next)) {
                case 0:
                  score = 0;
                  maxScore = 1;
                  evaluation = [];
                  correctIndex = 0;
                  console.log("&&&&&", userResponse, answers, checks);

                  asyncForEach =
                    /*#__PURE__*/
                    (function() {
                      var _ref5 = (0, _asyncToGenerator2["default"])(
                        /*#__PURE__*/
                        _regenerator["default"].mark(function _callee2(array, callback) {
                          var index;
                          return _regenerator["default"].wrap(function _callee2$(_context2) {
                            while (1) {
                              switch ((_context2.prev = _context2.next)) {
                                case 0:
                                  index = 0;

                                case 1:
                                  if (!(index < array.length)) {
                                    _context2.next = 7;
                                    break;
                                  }

                                  _context2.next = 4;
                                  return callback(array[index], index, array);

                                case 4:
                                  index++;
                                  _context2.next = 1;
                                  break;

                                case 7:
                                case "end":
                                  return _context2.stop();
                              }
                            }
                          }, _callee2);
                        })
                      );

                      return function asyncForEach(_x5, _x6) {
                        return _ref5.apply(this, arguments);
                      };
                    })();

                  _context5.prev = 6;

                  getAnswerCorrectMethods = function getAnswerCorrectMethods(answer) {
                    if (Array.isArray(answer.value)) {
                      return answer.value.map(function(val) {
                        return val.map(function(_ref6) {
                          var value = _ref6.value;
                          return value;
                        });
                      });
                    }

                    return [];
                  };

                  _context5.next = 10;
                  return asyncForEach(
                    answers,
                    /*#__PURE__*/
                    (function() {
                      var _ref7 = (0, _asyncToGenerator2["default"])(
                        /*#__PURE__*/
                        _regenerator["default"].mark(function _callee4(answer, answerIndex) {
                          var corrects, valid, isExact;
                          return _regenerator["default"].wrap(function _callee4$(_context4) {
                            while (1) {
                              switch ((_context4.prev = _context4.next)) {
                                case 0:
                                  corrects = getAnswerCorrectMethods(answer);
                                  valid = [];
                                  _context4.next = 4;
                                  return asyncForEach(
                                    userResponse,
                                    /*#__PURE__*/
                                    (function() {
                                      var _ref8 = (0, _asyncToGenerator2["default"])(
                                        /*#__PURE__*/
                                        _regenerator["default"].mark(function _callee3(userAns, index) {
                                          var res;
                                          return _regenerator["default"].wrap(function _callee3$(_context3) {
                                            while (1) {
                                              switch ((_context3.prev = _context3.next)) {
                                                case 0:
                                                  _context3.next = 2;
                                                  return checkCorrect({
                                                    correctAnswers: corrects[index],
                                                    userResponse: userAns,
                                                    checks: checks
                                                  });

                                                case 2:
                                                  res = _context3.sent;
                                                  valid.push(res);

                                                case 4:
                                                case "end":
                                                  return _context3.stop();
                                              }
                                            }
                                          }, _callee3);
                                        })
                                      );

                                      return function(_x9, _x10) {
                                        return _ref8.apply(this, arguments);
                                      };
                                    })()
                                  );

                                case 4:
                                  evaluation.push([].concat(valid));

                                  isExact = function isExact(element) {
                                    return element;
                                  };

                                  if (valid.every(isExact)) {
                                    score = Math.max(answer.score, score);
                                    correctIndex = answerIndex;
                                  }

                                  maxScore = Math.max(answer.score, maxScore);

                                case 8:
                                case "end":
                                  return _context4.stop();
                              }
                            }
                          }, _callee4);
                        })
                      );

                      return function(_x7, _x8) {
                        return _ref7.apply(this, arguments);
                      };
                    })()
                  );

                case 10:
                  _context5.next = 15;
                  break;

                case 12:
                  _context5.prev = 12;
                  _context5.t0 = _context5["catch"](6);
                  console.error(_context5.t0);

                case 15:
                  _context5.prev = 15;
                  return _context5.abrupt("return", {
                    score: score,
                    maxScore: maxScore,
                    evaluation: evaluation[correctIndex]
                  });

                case 18:
                case "end":
                  return _context5.stop();
              }
            }
          },
          _callee5,
          null,
          [[6, 12, 15, 18]]
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
    var _ref10 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6(_ref9) {
        var _ref9$userResponse,
          userResponse,
          validation,
          valid_response,
          valid_dropdown,
          valid_inputs,
          _validation$alt_respo,
          alt_responses,
          scoring_type,
          attemptScore,
          answers,
          _userResponse$dropDow,
          _dropDownResponse,
          _userResponse$inputs,
          _inputsResponse,
          _userResponse$math,
          _mathResponse,
          result,
          _ref11,
          _inputEvaluation,
          _inputScore,
          _inputMaxScore,
          _ref12,
          _dropdownEvaluation,
          _dropdownScore,
          __dropdownMaxScore,
          checks;

        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch ((_context6.prev = _context6.next)) {
              case 0:
                (_ref9$userResponse = _ref9.userResponse),
                  (userResponse = _ref9$userResponse === void 0 ? {} : _ref9$userResponse),
                  (validation = _ref9.validation);
                (valid_response = validation.valid_response),
                  (valid_dropdown = validation.valid_dropdown),
                  (valid_inputs = validation.valid_inputs),
                  (_validation$alt_respo = validation.alt_responses),
                  (alt_responses = _validation$alt_respo === void 0 ? [] : _validation$alt_respo),
                  (scoring_type = validation.scoring_type),
                  (attemptScore = validation.min_score_if_attempted);
                answers = [valid_response].concat((0, _toConsumableArray2["default"])(alt_responses));
                (_userResponse$dropDow = userResponse.dropDown),
                  (_dropDownResponse = _userResponse$dropDow === void 0 ? [] : _userResponse$dropDow),
                  (_userResponse$inputs = userResponse.inputs),
                  (_inputsResponse = _userResponse$inputs === void 0 ? [] : _userResponse$inputs),
                  (_userResponse$math = userResponse.math),
                  (_mathResponse = _userResponse$math === void 0 ? [] : _userResponse$math);
                _context6.next = 6;
                return (0, _clozeText["default"])({
                  userResponse: _inputsResponse,
                  validation: {
                    scoring_type: scoring_type,
                    alt_responses: [],
                    valid_response: (0, _objectSpread2["default"])({}, valid_inputs)
                  }
                });

              case 6:
                _ref11 = _context6.sent;
                _inputEvaluation = _ref11.evaluation;
                _inputScore = _ref11.score;
                _inputMaxScore = _ref11.maxScore;
                _context6.next = 12;
                return (0, _clozeText["default"])({
                  userResponse: _dropDownResponse,
                  validation: {
                    scoring_type: scoring_type,
                    alt_responses: [],
                    valid_response: (0, _objectSpread2["default"])({}, valid_dropdown)
                  }
                });

              case 12:
                _ref12 = _context6.sent;
                _dropdownEvaluation = _ref12.evaluation;
                _dropdownScore = _ref12.score;
                __dropdownMaxScore = _ref12.maxScore;
                console.log("evaluator::validation", validation);
                console.log("evaluator::userResponse", userResponse);
                _context6.t0 = scoring_type;
                _context6.next = _context6.t0 === _scoring.ScoringType.EXACT_MATCH ? 21 : 21;
                break;

              case 21:
                checks = getChecks(validation);
                console.log(userResponse, answers, checks);
                _context6.next = 25;
                return exactMatchEvaluator(userResponse, answers, checks);

              case 25:
                result = _context6.sent;

              case 26:
                // if score for attempting is greater than current score
                // let it be the score!
                if (!Number.isNaN(attemptScore) && attemptScore > result.score) {
                  result.score = attemptScore;
                }

                console.log(_inputEvaluation, _inputScore, _inputMaxScore);
                console.log(_dropdownEvaluation, _dropdownScore, __dropdownMaxScore);
                return _context6.abrupt("return", result);

              case 30:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      })
    );

    return function evaluator(_x11) {
      return _ref10.apply(this, arguments);
    };
  })();

var _default = evaluator;
exports["default"] = _default;
