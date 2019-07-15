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

var _maxBy2 = _interopRequireDefault(require("lodash/maxBy"));

var _get2 = _interopRequireDefault(require("lodash/get"));

var _identity2 = _interopRequireDefault(require("lodash/identity"));

var _groupBy2 = _interopRequireDefault(require("lodash/groupBy"));

var _flatten2 = _interopRequireDefault(require("lodash/flatten"));

var _math = require("./math");

var _clozeText = _interopRequireDefault(require("./clozeText"));

var mathEval =
  /*#__PURE__*/
  (function() {
    var _ref2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(_ref) {
        var userResponse, validation, validResponses, evaluation, _loop, _i, _Object$keys;

        return _regenerator["default"].wrap(function _callee$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                (userResponse = _ref.userResponse), (validation = _ref.validation);
                validResponses = (0, _groupBy2["default"])(
                  (0, _flatten2["default"])(validation.valid_response.value),
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
                              return item.value;
                            });
                            requests = answers.map(function(ans) {
                              var data = {
                                input: userResponse[id].value.replace(/\\ /g, " "),
                                expected: ans ? ans.replace(/\\ /g, " ") : "",
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
                (_i = 0), (_Object$keys = Object.keys(userResponse));

              case 5:
                if (!(_i < _Object$keys.length)) {
                  _context2.next = 10;
                  break;
                }

                return _context2.delegateYield(_loop(), "t0", 7);

              case 7:
                _i++;
                _context2.next = 5;
                break;

              case 10:
                return _context2.abrupt("return", evaluation);

              case 11:
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
          valid_response,
          valid_dropdown,
          valid_inputs,
          _validation$alt_respo,
          alt_responses,
          _validation$alt_dropd,
          alt_dropdowns,
          _validation$alt_input,
          alt_inputs,
          scoring_type,
          min_score_if_attempted,
          penalty,
          _userResponse$inputs,
          inputs,
          _userResponse$dropDow,
          dropDowns,
          _userResponse$maths,
          maths,
          mathAnswers,
          dropDownAnswers,
          textAnswers,
          score,
          maxScore,
          allEvaluations,
          alterAnswersCount,
          i,
          dropDownValidation,
          clozeTextValidation,
          mathValidation,
          questionScore,
          currentScore,
          evaluations,
          dropDownEvaluation,
          clozeTextEvaluation,
          mathEvaluation,
          correctCount,
          wrongCount,
          answersCount,
          negativeScore,
          selectedEvaluation;

        return _regenerator["default"].wrap(function _callee2$(_context3) {
          while (1) {
            switch ((_context3.prev = _context3.next)) {
              case 0:
                (_ref3$userResponse = _ref3.userResponse),
                  (userResponse = _ref3$userResponse === void 0 ? {} : _ref3$userResponse),
                  (validation = _ref3.validation);
                (valid_response = validation.valid_response),
                  (valid_dropdown = validation.valid_dropdown),
                  (valid_inputs = validation.valid_inputs),
                  (_validation$alt_respo = validation.alt_responses),
                  (alt_responses = _validation$alt_respo === void 0 ? [] : _validation$alt_respo),
                  (_validation$alt_dropd = validation.alt_dropdowns),
                  (alt_dropdowns = _validation$alt_dropd === void 0 ? [] : _validation$alt_dropd),
                  (_validation$alt_input = validation.alt_inputs),
                  (alt_inputs = _validation$alt_input === void 0 ? [] : _validation$alt_input),
                  (scoring_type = validation.scoring_type),
                  (min_score_if_attempted = validation.min_score_if_attempted),
                  (penalty = validation.penalty);
                (_userResponse$inputs = userResponse.inputs),
                  (inputs = _userResponse$inputs === void 0 ? {} : _userResponse$inputs),
                  (_userResponse$dropDow = userResponse.dropDowns),
                  (dropDowns = _userResponse$dropDow === void 0 ? {} : _userResponse$dropDow),
                  (_userResponse$maths = userResponse.maths),
                  (maths = _userResponse$maths === void 0 ? {} : _userResponse$maths);
                mathAnswers = [valid_response].concat((0, _toConsumableArray2["default"])(alt_responses));
                dropDownAnswers = [valid_dropdown].concat((0, _toConsumableArray2["default"])(alt_dropdowns));
                textAnswers = [valid_inputs].concat((0, _toConsumableArray2["default"])(alt_inputs));
                score = 0;
                maxScore = 0;
                allEvaluations = [];
                alterAnswersCount = Math.max(mathAnswers.length, dropDownAnswers.length, textAnswers.length);
                i = 0;

              case 11:
                if (!(i < alterAnswersCount)) {
                  _context3.next = 35;
                  break;
                }

                dropDownValidation = dropDownAnswers[i];
                clozeTextValidation = textAnswers[i];
                mathValidation = mathAnswers[i];
                questionScore =
                  (textAnswers[i] && textAnswers[i].score) ||
                  (mathAnswers[i] && mathAnswers[i].score) ||
                  (dropDownAnswers[i] && dropDownAnswers[i].score) ||
                  1;
                currentScore = 0;
                evaluations = {};
                maxScore = Math.max(questionScore, maxScore);

                if (dropDownValidation) {
                  dropDownEvaluation = (0, _clozeText["default"])({
                    userResponse: transformUserResponse(dropDowns),
                    validation: {
                      scoring_type: "exactMatch",
                      valid_response: dropDownValidation
                    }
                  }).evaluation;
                  evaluations = (0, _objectSpread2["default"])({}, evaluations, dropDownEvaluation);
                }

                if (clozeTextValidation) {
                  clozeTextEvaluation = (0, _clozeText["default"])({
                    userResponse: transformUserResponse(inputs),
                    validation: {
                      scoring_type: "exactMatch",
                      valid_response: clozeTextValidation
                    }
                  }).evaluation;
                  evaluations = (0, _objectSpread2["default"])({}, evaluations, clozeTextEvaluation);
                }

                if (!mathValidation) {
                  _context3.next = 26;
                  break;
                }

                _context3.next = 24;
                return mathEval({
                  userResponse: maths,
                  validation: {
                    scoring_type: "exactMatch",
                    valid_response: mathValidation
                  }
                });

              case 24:
                mathEvaluation = _context3.sent;
                evaluations = (0, _objectSpread2["default"])({}, evaluations, mathEvaluation);

              case 26:
                correctCount = Object.values(evaluations).filter(_identity2["default"]).length;
                wrongCount = Object.values(evaluations).filter(function(x) {
                  return !x;
                }).length;
                answersCount =
                  (0, _get2["default"])(dropDownValidation, ["value", "length"], 0) +
                  (0, _get2["default"])(mathValidation, ["value", "length"], 0) +
                  (0, _get2["default"])(clozeTextValidation, ["value", "length"], 0);

                if (scoring_type === "partialMatch") {
                  currentScore = questionScore * (correctCount / answersCount);

                  if (penalty) {
                    negativeScore = penalty * wrongCount;
                    currentScore -= negativeScore;
                  }
                } else if (correctCount === answersCount) {
                  currentScore = questionScore;
                }

                score = Math.max(score, currentScore);
                allEvaluations.push({
                  evaluation: evaluations,
                  score: currentScore
                });

              case 32:
                i++;
                _context3.next = 11;
                break;

              case 35:
                selectedEvaluation = (0, _maxBy2["default"])(allEvaluations, "score");

                if (score === 0) {
                  selectedEvaluation = allEvaluations[0].evaluation;
                } else {
                  selectedEvaluation = selectedEvaluation.evaluation;
                }

                if (score < 0) {
                  score = 0;
                }

                if (min_score_if_attempted && score < min_score_if_attempted) {
                  score = min_score_if_attempted;
                }

                return _context3.abrupt("return", {
                  score: score,
                  evaluation: selectedEvaluation,
                  maxScore: maxScore
                });

              case 40:
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
                  answersArray = (0, _toConsumableArray2["default"])(validation.valid_response.value || []);
                  _iteratorNormalCompletion = true;
                  _didIteratorError = false;
                  _iteratorError = undefined;
                  _context5.prev = 5;

                  for (
                    _iterator = validation.alt_responses[Symbol.iterator]();
                    !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
                    _iteratorNormalCompletion = true
                  ) {
                    altResp = _step.value;
                    if (altResp.value && Array.isArray(altResp.value))
                      answersArray.push.apply(answersArray, (0, _toConsumableArray2["default"])(altResp.value));
                  }

                  _context5.next = 13;
                  break;

                case 9:
                  _context5.prev = 9;
                  _context5.t0 = _context5["catch"](5);
                  _didIteratorError = true;
                  _iteratorError = _context5.t0;

                case 13:
                  _context5.prev = 13;
                  _context5.prev = 14;

                  if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                    _iterator["return"]();
                  }

                case 16:
                  _context5.prev = 16;

                  if (!_didIteratorError) {
                    _context5.next = 19;
                    break;
                  }

                  throw _iteratorError;

                case 19:
                  return _context5.finish(16);

                case 20:
                  return _context5.finish(13);

                case 21:
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
                                var expected = (validAnswer.value || "").replace(/\\ /g, " ");
                                var input = userResponse[id].value.replace(/\\ /g, " ");
                                return (0, _math.evaluate)({
                                  input: input,
                                  checks: checks,
                                  expected: expected
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
                  (_i2 = 0), (_Object$keys2 = Object.keys(userResponse));

                case 25:
                  if (!(_i2 < _Object$keys2.length)) {
                    _context5.next = 30;
                    break;
                  }

                  return _context5.delegateYield(_loop2(), "t1", 27);

                case 27:
                  _i2++;
                  _context5.next = 25;
                  break;

                case 30:
                  return _context5.abrupt("return", evaluations);

                case 31:
                case "end":
                  return _context5.stop();
              }
            }
          },
          _callee3,
          null,
          [[5, 9, 13, 21], [14, , 16, 20]]
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
          valid_response,
          valid_dropdown,
          valid_inputs,
          _validation$alt_respo2,
          alt_responses,
          _validation$alt_dropd2,
          alt_dropdowns,
          _validation$alt_input2,
          alt_inputs,
          scoring_type,
          _validation$min_score,
          min_score_if_attempted,
          penalty,
          _userResponse$inputs2,
          inputs,
          _userResponse$dropDow2,
          dropDowns,
          _userResponse$maths2,
          maths,
          questionScore,
          score,
          optionCount,
          clozeTextEvaluation,
          dropDownEvaluation,
          mathEvaluation,
          evaluation,
          correctAnswerCount,
          wrongAnswerCount,
          negativeScore;

        return _regenerator["default"].wrap(function _callee4$(_context6) {
          while (1) {
            switch ((_context6.prev = _context6.next)) {
              case 0:
                (userResponse = _ref7.userResponse), (validation = _ref7.validation);
                (valid_response = validation.valid_response),
                  (valid_dropdown = validation.valid_dropdown),
                  (valid_inputs = validation.valid_inputs),
                  (_validation$alt_respo2 = validation.alt_responses),
                  (alt_responses = _validation$alt_respo2 === void 0 ? [] : _validation$alt_respo2),
                  (_validation$alt_dropd2 = validation.alt_dropdowns),
                  (alt_dropdowns = _validation$alt_dropd2 === void 0 ? [] : _validation$alt_dropd2),
                  (_validation$alt_input2 = validation.alt_inputs),
                  (alt_inputs = _validation$alt_input2 === void 0 ? [] : _validation$alt_input2),
                  (scoring_type = validation.scoring_type),
                  (_validation$min_score = validation.min_score_if_attempted),
                  (min_score_if_attempted = _validation$min_score === void 0 ? 0 : _validation$min_score),
                  (penalty = validation.penalty);
                (_userResponse$inputs2 = userResponse.inputs),
                  (inputs = _userResponse$inputs2 === void 0 ? {} : _userResponse$inputs2),
                  (_userResponse$dropDow2 = userResponse.dropDowns),
                  (dropDowns = _userResponse$dropDow2 === void 0 ? {} : _userResponse$dropDow2),
                  (_userResponse$maths2 = userResponse.maths),
                  (maths = _userResponse$maths2 === void 0 ? {} : _userResponse$maths2);
                questionScore =
                  (valid_inputs && valid_inputs.score) ||
                  (valid_response && valid_response.score) ||
                  (valid_dropdown && valid_dropdown.score) ||
                  1;
                score = 0;
                optionCount =
                  (0, _get2["default"])(valid_response, ["value", "length"], 0) +
                  (0, _get2["default"])(valid_inputs, ["value", "length"], 0) +
                  (0, _get2["default"])(valid_dropdown, ["value", "length"], 0); // cloze-text evaluation!

                clozeTextEvaluation =
                  (valid_inputs &&
                    (0, _clozeText["default"])({
                      userResponse: transformUserResponse(inputs),
                      validation: {
                        scoring_type: "exactMatch",
                        valid_response: valid_inputs,
                        alt_responses: alt_inputs,
                        mixAndMatch: true
                      }
                    }).evaluation) ||
                  {}; // dropdown evaluation

                dropDownEvaluation =
                  (valid_dropdown &&
                    (0, _clozeText["default"])({
                      userResponse: transformUserResponse(dropDowns),
                      validation: {
                        scoring_type: "exactMatch",
                        valid_response: valid_dropdown,
                        alt_responses: alt_dropdowns,
                        mixAndMatch: true
                      }
                    }).evaluation) ||
                  {}; // math evaluations

                _context6.next = 10;
                return mixAndMatchMathEvaluator({
                  userResponse: maths,
                  validation: {
                    valid_response: valid_response,
                    alt_responses: alt_responses
                  }
                });

              case 10:
                mathEvaluation = _context6.sent;
                evaluation = (0, _objectSpread2["default"])(
                  {},
                  dropDownEvaluation,
                  clozeTextEvaluation,
                  mathEvaluation
                );
                correctAnswerCount = Object.values(evaluation).filter(_identity2["default"]).length;
                wrongAnswerCount = Object.values(evaluation).filter(function(i) {
                  return !i;
                }).length;

                if (validation.scoring_type === "partialMatch") {
                  score = (correctAnswerCount / optionCount) * questionScore;

                  if (validation.penalty) {
                    negativeScore = penalty * wrongAnswerCount;
                    score -= negativeScore;
                  }
                } else if (correctAnswerCount === optionCount) {
                  score = questionScore;
                }

                score = Math.max(score, 0, min_score_if_attempted);
                return _context6.abrupt("return", {
                  score: score,
                  evaluation: evaluation,
                  maxScore: questionScore
                });

              case 17:
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
