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

var _round2 = _interopRequireDefault(require("lodash/round"));

var _isString2 = _interopRequireDefault(require("lodash/isString"));

var _isNumber2 = _interopRequireDefault(require("lodash/isNumber"));

var _flatten2 = _interopRequireDefault(require("lodash/flatten"));

var _omitBy2 = _interopRequireDefault(require("lodash/omitBy"));

var _axios = _interopRequireDefault(require("axios"));

var _scoring = require("./const/scoring");

var _clozeText = _interopRequireDefault(require("./clozeText"));

var url = process.env.POI_APP_MATH_EVALUATE_API || "https://edulastic-poc.snapwiz.net/math-api/evaluate";

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
                    _context.next = 26;
                    break;
                  }

                  correct = _step.value;
                  data = {
                    input:
                      (0, _isString2["default"])(userResponse) || (0, _isNumber2["default"])(userResponse)
                        ? userResponse.replace(/\\ /g, " ")
                        : "",
                    expected: correct ? correct.replace(/\\ /g, " ") : ":",
                    checks: checks
                  };
                  _context.prev = 10;
                  _context.next = 13;
                  return evaluate(data);

                case 13:
                  _ref3 = _context.sent;
                  result = _ref3.result;

                  if (!(result === "true")) {
                    _context.next = 18;
                    break;
                  }

                  valid = true;
                  return _context.abrupt("break", 26);

                case 18:
                  _context.next = 23;
                  break;

                case 20:
                  _context.prev = 20;
                  _context.t0 = _context["catch"](10);
                  return _context.abrupt("continue", 23);

                case 23:
                  _iteratorNormalCompletion = true;
                  _context.next = 7;
                  break;

                case 26:
                  _context.next = 32;
                  break;

                case 28:
                  _context.prev = 28;
                  _context.t1 = _context["catch"](5);
                  _didIteratorError = true;
                  _iteratorError = _context.t1;

                case 32:
                  _context.prev = 32;
                  _context.prev = 33;

                  if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                    _iterator["return"]();
                  }

                case 35:
                  _context.prev = 35;

                  if (!_didIteratorError) {
                    _context.next = 38;
                    break;
                  }

                  throw _iteratorError;

                case 38:
                  return _context.finish(35);

                case 39:
                  return _context.finish(32);

                case 40:
                  return _context.abrupt("return", valid);

                case 41:
                case "end":
                  return _context.stop();
              }
            }
          },
          _callee,
          null,
          [[5, 28, 32, 40], [10, 20], [33, , 35, 39]]
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

                  _context5.prev = 5;

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

                  _context5.next = 9;
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

                case 9:
                  _context5.next = 14;
                  break;

                case 11:
                  _context5.prev = 11;
                  _context5.t0 = _context5["catch"](5);
                  console.error(_context5.t0);

                case 14:
                  _context5.prev = 14;
                  return _context5.abrupt("return", {
                    score: score,
                    maxScore: maxScore,
                    evaluation: evaluation[correctIndex]
                  });

                case 17:
                case "end":
                  return _context5.stop();
              }
            }
          },
          _callee5,
          null,
          [[5, 11, 14, 17]]
        );
      })
    );

    return function exactMatchEvaluator(_x2, _x3, _x4) {
      return _ref4.apply(this, arguments);
    };
  })(); // const

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
          entered,
          inputsResults,
          dropDownResults,
          mathResults,
          checks,
          corrects,
          evaluation,
          score,
          maxScore;

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
                entered = _dropDownResponse.filter(function(response) {
                  return response;
                }).length;
                entered += _inputsResponse.filter(function(response) {
                  return response;
                }).length;
                entered += _mathResponse.filter(function(response) {
                  return response;
                }).length;
                _context6.next = 9;
                return (0, _clozeText["default"])({
                  userResponse: _inputsResponse,
                  validation: {
                    scoring_type: scoring_type,
                    alt_responses: [],
                    valid_response: (0, _objectSpread2["default"])({}, valid_inputs)
                  }
                });

              case 9:
                inputsResults = _context6.sent;
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
                dropDownResults = _context6.sent;
                mathResults = {};
                _context6.t0 = scoring_type;
                _context6.next = _context6.t0 === _scoring.ScoringType.EXACT_MATCH ? 17 : 17;
                break;

              case 17:
                checks = getChecks(validation);
                _context6.next = 20;
                return exactMatchEvaluator(_mathResponse, answers, checks);

              case 20:
                mathResults = _context6.sent;

              case 21:
                // if score for attempting is greater than current score
                // let it be the score!
                if (!Number.isNaN(attemptScore) && attemptScore > mathResults.score) {
                  mathResults.score = attemptScore;
                }

                corrects = inputsResults.evaluation.filter(function(answer) {
                  return answer;
                }).length;
                corrects += dropDownResults.evaluation.filter(function(answer) {
                  return answer;
                }).length;
                corrects += mathResults.evaluation
                  ? mathResults.evaluation.filter(function(answer) {
                      return answer;
                    }).length
                  : 0;
                evaluation = {
                  mathResults: mathResults,
                  inputsResults: inputsResults,
                  dropDownResults: dropDownResults
                };
                score = (0, _round2["default"])(corrects / entered, 2);
                maxScore = 1;
                return _context6.abrupt("return", {
                  evaluation: evaluation,
                  score: score,
                  maxScore: maxScore
                });

              case 29:
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
