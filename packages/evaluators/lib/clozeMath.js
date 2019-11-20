"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

var _maxBy2 = _interopRequireDefault(require("lodash/maxBy"));

var _get2 = _interopRequireDefault(require("lodash/get"));

var _identity2 = _interopRequireDefault(require("lodash/identity"));

var _groupBy2 = _interopRequireDefault(require("lodash/groupBy"));

var _flatten2 = _interopRequireDefault(require("lodash/flatten"));

var _math = require("./math");

var _clozeText = _interopRequireDefault(require("./clozeText"));

// combine unit and value for the clozeMath type Math w/Unit
var combineUnitAndExpression = function combineUnitAndExpression(expression, unit) {
  if (expression.search("=") === -1) {
    return expression + unit;
  }

  return expression.replace(/=/gm, "".concat(unit, "="));
};

var mathEval =
  /*#__PURE__*/
  (function() {
    var _ref2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(_ref) {
        var userResponse, validation, _validation, _userResponse, validResponses, evaluation, _loop, _i, _Object$keys;

        return _regenerator["default"].wrap(function _callee$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                (userResponse = _ref.userResponse), (validation = _ref.validation);
                _validation = (0, _cloneDeep2["default"])(validation);
                _userResponse = (0, _cloneDeep2["default"])(userResponse);
                validResponses = (0, _groupBy2["default"])(
                  (0, _flatten2["default"])(_validation.validResponse.value),
                  "id"
                );
                evaluation = {}; // parallelize network request!!

                _loop =
                  /*#__PURE__*/
                  _regenerator["default"].mark(function _loop() {
                    var id, checks, answers, requests, results, correct;
                    return _regenerator["default"].wrap(function _loop$(_context) {
                      while (1) {
                        switch ((_context.prev = _context.next)) {
                          case 0:
                            id = _Object$keys[_i];
                            checks = (0, _math.getChecks)({
                              value: validResponses[id]
                            });
                            answers = (validResponses[id] || []).map(function(item) {
                              var _item$options = item.options,
                                options = _item$options === void 0 ? {} : _item$options;

                              if (options.unit) {
                                return combineUnitAndExpression(item.value, options.unit);
                              }

                              return item.value;
                            });
                            requests = answers.map(function(ans) {
                              var value = _userResponse[id].value;
                              var unit = _userResponse[id].unit;

                              if (unit) {
                                value = combineUnitAndExpression(value, unit);
                              }

                              var data = {
                                input: value.replace(/\s+/g, " ").replace(/[$]/g, "\\$"),
                                expected: ans ? ans.replace(/\s+/g, " ").replace(/[$]/g, "\\$") : "",
                                checks: checks
                              };
                              return (0, _math.evaluate)(data);
                            });
                            _context.next = 6;
                            return Promise.all(requests);

                          case 6:
                            results = _context.sent;
                            correct = results.some(function(item) {
                              return item.result === "true";
                            });
                            evaluation[id] = correct;

                          case 9:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _loop);
                  });
                (_i = 0), (_Object$keys = Object.keys(_userResponse));

              case 7:
                if (!(_i < _Object$keys.length)) {
                  _context2.next = 12;
                  break;
                }

                return _context2.delegateYield(_loop(), "t0", 9);

              case 9:
                _i++;
                _context2.next = 7;
                break;

              case 12:
                return _context2.abrupt("return", evaluation);

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee);
      })
    );

    return function mathEval(_x) {
      return _ref2.apply(this, arguments);
    };
  })();
/**
 * transform user repsonse for the clozeText type evaluator.
 */

var transformUserResponse = function transformUserResponse(userResponse) {
  return Object.keys(userResponse).map(function(id) {
    return (0, _objectSpread2["default"])(
      {
        id: id
      },
      userResponse[id]
    );
  });
};

var normalEvaluator =
  /*#__PURE__*/
  (function() {
    var _ref4 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(_ref3) {
        var _ref3$userResponse,
          userResponse,
          validation,
          validResponse,
          _validation$altRespon,
          altResponses,
          scoringType,
          minScoreIfAttempted,
          _validation$penalty,
          penalty,
          _validation$ignoreCas,
          ignoreCase,
          _validation$allowSing,
          allowSingleLetterMistake,
          _userResponse$inputs,
          inputs,
          _userResponse$dropDow,
          dropDowns,
          _userResponse$maths,
          maths,
          _userResponse$mathUni,
          mathUnits,
          score,
          maxScore,
          allEvaluations,
          validAnswers,
          i,
          evaluations,
          currentScore,
          questionScore,
          dropDownEvaluation,
          clozeTextEvaluation,
          mathEvaluation,
          _mathEvaluation,
          correctCount,
          answersCount,
          scoreOfAnswer,
          penaltyOfAnwer,
          penaltyScore,
          selectedEvaluation;

        return _regenerator["default"].wrap(function _callee2$(_context3) {
          while (1) {
            switch ((_context3.prev = _context3.next)) {
              case 0:
                (_ref3$userResponse = _ref3.userResponse),
                  (userResponse = _ref3$userResponse === void 0 ? {} : _ref3$userResponse),
                  (validation = _ref3.validation);
                (validResponse = validation.validResponse),
                  (_validation$altRespon = validation.altResponses),
                  (altResponses = _validation$altRespon === void 0 ? [] : _validation$altRespon),
                  (scoringType = validation.scoringType),
                  (minScoreIfAttempted = validation.minScoreIfAttempted),
                  (_validation$penalty = validation.penalty),
                  (penalty = _validation$penalty === void 0 ? 0 : _validation$penalty),
                  (_validation$ignoreCas = validation.ignoreCase),
                  (ignoreCase = _validation$ignoreCas === void 0 ? false : _validation$ignoreCas),
                  (_validation$allowSing = validation.allowSingleLetterMistake),
                  (allowSingleLetterMistake = _validation$allowSing === void 0 ? false : _validation$allowSing);
                (_userResponse$inputs = userResponse.inputs),
                  (inputs = _userResponse$inputs === void 0 ? {} : _userResponse$inputs),
                  (_userResponse$dropDow = userResponse.dropDowns),
                  (dropDowns = _userResponse$dropDow === void 0 ? {} : _userResponse$dropDow),
                  (_userResponse$maths = userResponse.maths),
                  (maths = _userResponse$maths === void 0 ? {} : _userResponse$maths),
                  (_userResponse$mathUni = userResponse.mathUnits),
                  (mathUnits = _userResponse$mathUni === void 0 ? {} : _userResponse$mathUni);
                score = 0;
                maxScore = 0;
                allEvaluations = [];
                validAnswers = [validResponse].concat((0, _toConsumableArray2["default"])(altResponses));
                i = 0;

              case 8:
                if (!(i < validAnswers.length)) {
                  _context3.next = 37;
                  break;
                }

                evaluations = {};
                currentScore = 0;
                questionScore = (validAnswers[i] && validAnswers[i].score) || 1;
                maxScore = Math.max(questionScore, maxScore);

                if (validAnswers[i].dropdown) {
                  dropDownEvaluation = (0, _clozeText["default"])({
                    userResponse: transformUserResponse(dropDowns),
                    validation: {
                      scoringType: "exactMatch",
                      validResponse: (0, _objectSpread2["default"])(
                        {
                          score: 1
                        },
                        validAnswers[i].dropdown
                      )
                    }
                  }).evaluation;
                  evaluations = (0, _objectSpread2["default"])({}, evaluations, dropDownEvaluation);
                }

                if (validAnswers[i].textinput) {
                  clozeTextEvaluation = (0, _clozeText["default"])({
                    userResponse: transformUserResponse(inputs),
                    validation: {
                      scoringType: "exactMatch",
                      validResponse: (0, _objectSpread2["default"])(
                        {
                          score: 1
                        },
                        validAnswers[i].textinput
                      ),
                      ignoreCase: ignoreCase,
                      allowSingleLetterMistake: allowSingleLetterMistake
                    }
                  }).evaluation;
                  evaluations = (0, _objectSpread2["default"])({}, evaluations, clozeTextEvaluation);
                }

                if (!validAnswers[i].value) {
                  _context3.next = 20;
                  break;
                }

                _context3.next = 18;
                return mathEval({
                  userResponse: maths,
                  validation: {
                    scoringType: "exactMatch",
                    validResponse: validAnswers[i]
                  }
                });

              case 18:
                mathEvaluation = _context3.sent;
                evaluations = (0, _objectSpread2["default"])({}, evaluations, mathEvaluation);

              case 20:
                if (!validAnswers[i].mathUnits) {
                  _context3.next = 25;
                  break;
                }

                _context3.next = 23;
                return mathEval({
                  userResponse: mathUnits,
                  validation: {
                    scoringType: "exactMatch",
                    validResponse: validAnswers[i].mathUnits
                  }
                });

              case 23:
                _mathEvaluation = _context3.sent;
                evaluations = (0, _objectSpread2["default"])({}, evaluations, _mathEvaluation);

              case 25:
                correctCount = Object.values(evaluations).filter(_identity2["default"]).length;
                answersCount =
                  (0, _get2["default"])(validAnswers[i].dropdown, ["value", "length"], 0) +
                  (0, _get2["default"])(validAnswers[i].mathUnits, ["value", "length"], 0) +
                  (0, _get2["default"])(validAnswers[i], ["value", "length"], 0) +
                  (0, _get2["default"])(validAnswers[i].textinput, ["value", "length"], 0);
                scoreOfAnswer = maxScore / answersCount;
                penaltyOfAnwer = penalty / answersCount;
                penaltyScore = penaltyOfAnwer * (answersCount - correctCount);
                currentScore = scoreOfAnswer * correctCount;

                if (scoringType === "partialMatch") {
                  currentScore -= penaltyScore;
                }

                score = Math.max(score, currentScore);
                allEvaluations.push({
                  evaluation: evaluations,
                  score: currentScore
                });

              case 34:
                i++;
                _context3.next = 8;
                break;

              case 37:
                selectedEvaluation = (0, _maxBy2["default"])(allEvaluations, "score");

                if (score === 0) {
                  selectedEvaluation = allEvaluations[0].evaluation;
                } else {
                  selectedEvaluation = selectedEvaluation.evaluation;
                }

                if (score < 0) {
                  score = 0;
                }

                if (minScoreIfAttempted && score < minScoreIfAttempted) {
                  score = minScoreIfAttempted;
                }

                return _context3.abrupt("return", {
                  score: score,
                  evaluation: selectedEvaluation,
                  maxScore: maxScore
                });

              case 42:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee2);
      })
    );

    return function normalEvaluator(_x2) {
      return _ref4.apply(this, arguments);
    };
  })();
/**
 * mix and match math evluator
 *
 */

var mixAndMatchMathEvaluator =
  /*#__PURE__*/
  (function() {
    var _ref6 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(_ref5) {
        var userResponse,
          validation,
          _validation,
          _userResponse,
          answersArray,
          _iteratorNormalCompletion,
          _didIteratorError,
          _iteratorError,
          _iterator,
          _step,
          altResp,
          answersById,
          evaluations,
          _loop2,
          _i2,
          _Object$keys2;

        return _regenerator["default"].wrap(
          function _callee3$(_context5) {
            while (1) {
              switch ((_context5.prev = _context5.next)) {
                case 0:
                  (userResponse = _ref5.userResponse), (validation = _ref5.validation);
                  _validation = (0, _cloneDeep2["default"])(validation);
                  _userResponse = (0, _cloneDeep2["default"])(userResponse);
                  answersArray = _validation.validResponse.value || [];
                  _iteratorNormalCompletion = true;
                  _didIteratorError = false;
                  _iteratorError = undefined;
                  _context5.prev = 7;

                  for (
                    _iterator = _validation.altResponses[Symbol.iterator]();
                    !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
                    _iteratorNormalCompletion = true
                  ) {
                    altResp = _step.value;
                    if (altResp.value && Array.isArray(altResp.value))
                      answersArray.push.apply(answersArray, (0, _toConsumableArray2["default"])(altResp.value));
                  }

                  _context5.next = 15;
                  break;

                case 11:
                  _context5.prev = 11;
                  _context5.t0 = _context5["catch"](7);
                  _didIteratorError = true;
                  _iteratorError = _context5.t0;

                case 15:
                  _context5.prev = 15;
                  _context5.prev = 16;

                  if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                    _iterator["return"]();
                  }

                case 18:
                  _context5.prev = 18;

                  if (!_didIteratorError) {
                    _context5.next = 21;
                    break;
                  }

                  throw _iteratorError;

                case 21:
                  return _context5.finish(18);

                case 22:
                  return _context5.finish(15);

                case 23:
                  answersById = (0, _groupBy2["default"])((0, _flatten2["default"])(answersArray), "id");
                  evaluations = {}; // parallelize this at some point

                  _loop2 =
                    /*#__PURE__*/
                    _regenerator["default"].mark(function _loop2() {
                      var id, validAnswers, calculations, result, correct;
                      return _regenerator["default"].wrap(function _loop2$(_context4) {
                        while (1) {
                          switch ((_context4.prev = _context4.next)) {
                            case 0:
                              id = _Object$keys2[_i2];
                              validAnswers = answersById[id];
                              calculations = validAnswers.map(function(validAnswer) {
                                var checks = (0, _math.getChecks)({
                                  value: [validAnswer]
                                });
                                var expected = validAnswer.value || "";
                                var input = _userResponse[id].value;
                                var _validAnswer$options = validAnswer.options,
                                  options = _validAnswer$options === void 0 ? {} : _validAnswer$options;

                                if (options.unit) {
                                  expected = combineUnitAndExpression(validAnswer.value, options.unit);
                                }

                                if (_userResponse[id].unit) {
                                  input = combineUnitAndExpression(_userResponse[id].value, _userResponse[id].unit);
                                }

                                return (0, _math.evaluate)({
                                  checks: checks,
                                  input: input.replace(/\s+/g, " ").replace(/[$]/g, "\\$"),
                                  expected: expected.replace(/\s+/g, " ").replace(/[$]/g, "\\$")
                                });
                              });
                              _context4.next = 5;
                              return Promise.all(calculations);

                            case 5:
                              result = _context4.sent;
                              correct = result.some(function(item) {
                                return item.result === "true";
                              });
                              evaluations[id] = correct;

                            case 8:
                            case "end":
                              return _context4.stop();
                          }
                        }
                      }, _loop2);
                    });
                  (_i2 = 0), (_Object$keys2 = Object.keys(_userResponse));

                case 27:
                  if (!(_i2 < _Object$keys2.length)) {
                    _context5.next = 32;
                    break;
                  }

                  return _context5.delegateYield(_loop2(), "t1", 29);

                case 29:
                  _i2++;
                  _context5.next = 27;
                  break;

                case 32:
                  return _context5.abrupt("return", evaluations);

                case 33:
                case "end":
                  return _context5.stop();
              }
            }
          },
          _callee3,
          null,
          [[7, 11, 15, 23], [16, , 18, 22]]
        );
      })
    );

    return function mixAndMatchMathEvaluator(_x3) {
      return _ref6.apply(this, arguments);
    };
  })();
/**
 * mix and match evaluators
 */

var mixAndMatchEvaluator =
  /*#__PURE__*/
  (function() {
    var _ref8 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(_ref7) {
        var userResponse,
          validation,
          validResponse,
          _validation$altRespon2,
          altResponses,
          _validation$minScoreI,
          minScoreIfAttempted,
          _validation$penalty2,
          penalty,
          _validation$ignoreCas2,
          ignoreCase,
          _validation$allowSing2,
          allowSingleLetterMistake,
          _userResponse$inputs2,
          inputs,
          _userResponse$dropDow2,
          dropDowns,
          _userResponse$maths2,
          maths,
          _userResponse$mathUni2,
          mathUnits,
          alt_inputs,
          alt_dropdowns,
          altMathUnits,
          questionScore,
          score,
          optionCount,
          clozeTextEvaluation,
          dropDownEvaluation,
          mathEvaluation,
          mathUnitsEvaluation,
          evaluation,
          correctAnswerCount,
          wrongAnswerCount,
          negativeScore;

        return _regenerator["default"].wrap(function _callee4$(_context6) {
          while (1) {
            switch ((_context6.prev = _context6.next)) {
              case 0:
                (userResponse = _ref7.userResponse), (validation = _ref7.validation);
                (validResponse = validation.validResponse),
                  (_validation$altRespon2 = validation.altResponses),
                  (altResponses = _validation$altRespon2 === void 0 ? [] : _validation$altRespon2),
                  (_validation$minScoreI = validation.minScoreIfAttempted),
                  (minScoreIfAttempted = _validation$minScoreI === void 0 ? 0 : _validation$minScoreI),
                  (_validation$penalty2 = validation.penalty),
                  (penalty = _validation$penalty2 === void 0 ? 0 : _validation$penalty2),
                  (_validation$ignoreCas2 = validation.ignoreCase),
                  (ignoreCase = _validation$ignoreCas2 === void 0 ? false : _validation$ignoreCas2),
                  (_validation$allowSing2 = validation.allowSingleLetterMistake),
                  (allowSingleLetterMistake = _validation$allowSing2 === void 0 ? false : _validation$allowSing2);
                (_userResponse$inputs2 = userResponse.inputs),
                  (inputs = _userResponse$inputs2 === void 0 ? {} : _userResponse$inputs2),
                  (_userResponse$dropDow2 = userResponse.dropDowns),
                  (dropDowns = _userResponse$dropDow2 === void 0 ? {} : _userResponse$dropDow2),
                  (_userResponse$maths2 = userResponse.maths),
                  (maths = _userResponse$maths2 === void 0 ? {} : _userResponse$maths2),
                  (_userResponse$mathUni2 = userResponse.mathUnits),
                  (mathUnits = _userResponse$mathUni2 === void 0 ? {} : _userResponse$mathUni2);
                alt_inputs = altResponses.map(function(alt_res) {
                  return (0, _objectSpread2["default"])(
                    {
                      score: 1
                    },
                    alt_res.textinput
                  );
                });
                alt_dropdowns = altResponses.map(function(alt_res) {
                  return (0, _objectSpread2["default"])(
                    {
                      score: 1
                    },
                    alt_res.dropdown
                  );
                });
                altMathUnits = altResponses.map(function(alt_res) {
                  return (0, _objectSpread2["default"])(
                    {
                      score: 1
                    },
                    alt_res.mathUnits
                  );
                });
                questionScore = (validResponse && validResponse.score) || 1;
                score = 0;
                optionCount =
                  (0, _get2["default"])(validResponse.dropdown, ["value", "length"], 0) +
                  (0, _get2["default"])(validResponse.mathUnits, ["value", "length"], 0) +
                  (0, _get2["default"])(validResponse, ["value", "length"], 0) +
                  (0, _get2["default"])(validResponse.textinput, ["value", "length"], 0); // cloze-text evaluation!

                clozeTextEvaluation =
                  (validResponse.textinput &&
                    (0, _clozeText["default"])({
                      userResponse: transformUserResponse(inputs),
                      validation: {
                        scoringType: "exactMatch",
                        validResponse: (0, _objectSpread2["default"])(
                          {
                            score: 1
                          },
                          validResponse.textinput
                        ),
                        altResponses: alt_inputs,
                        mixAndMatch: true,
                        ignoreCase: ignoreCase,
                        allowSingleLetterMistake: allowSingleLetterMistake
                      }
                    }).evaluation) ||
                  {}; // dropdown evaluation

                dropDownEvaluation =
                  (validResponse.dropdown &&
                    (0, _clozeText["default"])({
                      userResponse: transformUserResponse(dropDowns),
                      validation: {
                        scoringType: "exactMatch",
                        validResponse: (0, _objectSpread2["default"])(
                          {
                            score: 1
                          },
                          validResponse.dropdown
                        ),
                        altResponses: alt_dropdowns,
                        mixAndMatch: true
                      }
                    }).evaluation) ||
                  {}; // math evaluations

                _context6.t1 = validResponse;

                if (!_context6.t1) {
                  _context6.next = 16;
                  break;
                }

                _context6.next = 15;
                return mixAndMatchMathEvaluator({
                  userResponse: maths,
                  validation: {
                    validResponse: validResponse,
                    altResponses: altResponses
                  }
                });

              case 15:
                _context6.t1 = _context6.sent;

              case 16:
                _context6.t0 = _context6.t1;

                if (_context6.t0) {
                  _context6.next = 19;
                  break;
                }

                _context6.t0 = {};

              case 19:
                mathEvaluation = _context6.t0;
                _context6.t3 = validResponse.mathUnits;

                if (!_context6.t3) {
                  _context6.next = 25;
                  break;
                }

                _context6.next = 24;
                return mixAndMatchMathEvaluator({
                  userResponse: mathUnits,
                  validation: {
                    validResponse: validResponse.mathUnits,
                    altResponses: altMathUnits
                  }
                });

              case 24:
                _context6.t3 = _context6.sent;

              case 25:
                _context6.t2 = _context6.t3;

                if (_context6.t2) {
                  _context6.next = 28;
                  break;
                }

                _context6.t2 = {};

              case 28:
                mathUnitsEvaluation = _context6.t2;
                evaluation = (0, _objectSpread2["default"])(
                  {},
                  dropDownEvaluation,
                  clozeTextEvaluation,
                  mathEvaluation,
                  mathUnitsEvaluation
                );
                correctAnswerCount = Object.values(evaluation).filter(_identity2["default"]).length;
                wrongAnswerCount = Object.values(evaluation).filter(function(i) {
                  return !i;
                }).length;

                if (validation.scoringType === "partialMatch") {
                  score = (correctAnswerCount / optionCount) * questionScore;

                  if (validation.penalty) {
                    negativeScore = penalty * wrongAnswerCount;
                    score -= negativeScore;
                  }
                } else if (correctAnswerCount === optionCount) {
                  score = questionScore;
                }

                score = Math.max(score, 0, minScoreIfAttempted);
                return _context6.abrupt("return", {
                  score: score,
                  evaluation: evaluation,
                  maxScore: questionScore
                });

              case 35:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee4);
      })
    );

    return function mixAndMatchEvaluator(_x4) {
      return _ref8.apply(this, arguments);
    };
  })();

var _default = function _default(_ref9) {
  var _ref9$userResponse = _ref9.userResponse,
    userResponse = _ref9$userResponse === void 0 ? {} : _ref9$userResponse,
    validation = _ref9.validation;
  return validation.mixAndMatch
    ? mixAndMatchEvaluator({
        userResponse: userResponse,
        validation: validation
      })
    : normalEvaluator({
        userResponse: userResponse,
        validation: validation
      });
};

exports["default"] = _default;
