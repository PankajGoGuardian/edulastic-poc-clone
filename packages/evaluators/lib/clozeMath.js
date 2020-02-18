"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(
  require("@babel/runtime/helpers/toConsumableArray")
);

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

var _maxBy2 = _interopRequireDefault(require("lodash/maxBy"));

var _get2 = _interopRequireDefault(require("lodash/get"));

var _identity2 = _interopRequireDefault(require("lodash/identity"));

var _groupBy2 = _interopRequireDefault(require("lodash/groupBy"));

var _flatten2 = _interopRequireDefault(require("lodash/flatten"));

var _math = require("./math");

var _clozeText = _interopRequireDefault(require("./clozeText"));

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

// combine unit and value for the clozeMath type Math w/Unit
var combineUnitAndExpression = function combineUnitAndExpression(expression, unit) {
  if (expression.search("=") === -1) {
    return expression + unit;
  }

  return expression.replace(/=/gm, "".concat(unit, "="));
};

var mathEval = function mathEval(_ref) {
  var userResponse,
    validation,
    _validation,
    _userResponse,
    validResponses,
    evaluation,
    _loop,
    _i,
    _Object$keys;

  return _regenerator["default"].async(function mathEval$(_context2) {
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

          _loop = function _loop() {
            var id, checks, answers, requests, results, correct;
            return _regenerator["default"].async(function _loop$(_context) {
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
                      } // removing pattern `<space> after \\`

                      var data = {
                        input: value.replace(/(\\\s|\s)+/g, "").replace(/[$]/g, "\\$"),
                        expected: ans ? ans.replace(/(\\\s|\s)+/g, "").replace(/[$]/g, "\\$") : "",
                        checks: checks
                      };
                      return (0, _math.evaluate)(data);
                    });
                    _context.next = 6;
                    return _regenerator["default"].awrap(Promise.all(requests));

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
            });
          };

          (_i = 0), (_Object$keys = Object.keys(_userResponse));

        case 7:
          if (!(_i < _Object$keys.length)) {
            _context2.next = 13;
            break;
          }

          _context2.next = 10;
          return _regenerator["default"].awrap(_loop());

        case 10:
          _i++;
          _context2.next = 7;
          break;

        case 13:
          return _context2.abrupt("return", evaluation);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  });
};
/**
 * transform user repsonse for the clozeText type evaluator.
 */

var transformUserResponse = function transformUserResponse(userResponse) {
  return Object.keys(userResponse).map(function(id) {
    return _objectSpread(
      {
        id: id
      },
      userResponse[id]
    );
  });
};

var normalEvaluator = function normalEvaluator(_ref2) {
  var _ref2$userResponse,
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

  return _regenerator["default"].async(function normalEvaluator$(_context3) {
    while (1) {
      switch ((_context3.prev = _context3.next)) {
        case 0:
          (_ref2$userResponse = _ref2.userResponse),
            (userResponse = _ref2$userResponse === void 0 ? {} : _ref2$userResponse),
            (validation = _ref2.validation);
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
            (allowSingleLetterMistake =
              _validation$allowSing === void 0 ? false : _validation$allowSing);
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
                validResponse: _objectSpread(
                  {
                    score: 1
                  },
                  validAnswers[i].dropdown
                )
              }
            }).evaluation;
            evaluations = _objectSpread({}, evaluations, {}, dropDownEvaluation);
          }

          if (validAnswers[i].textinput) {
            clozeTextEvaluation = (0, _clozeText["default"])({
              userResponse: transformUserResponse(inputs),
              validation: {
                scoringType: "exactMatch",
                validResponse: _objectSpread(
                  {
                    score: 1
                  },
                  validAnswers[i].textinput
                ),
                ignoreCase: ignoreCase,
                allowSingleLetterMistake: allowSingleLetterMistake
              }
            }).evaluation;
            evaluations = _objectSpread({}, evaluations, {}, clozeTextEvaluation);
          }

          if (!validAnswers[i].value) {
            _context3.next = 20;
            break;
          }

          _context3.next = 18;
          return _regenerator["default"].awrap(
            mathEval({
              userResponse: maths,
              validation: {
                scoringType: "exactMatch",
                validResponse: validAnswers[i]
              }
            })
          );

        case 18:
          mathEvaluation = _context3.sent;
          evaluations = _objectSpread({}, evaluations, {}, mathEvaluation);

        case 20:
          if (!validAnswers[i].mathUnits) {
            _context3.next = 25;
            break;
          }

          _context3.next = 23;
          return _regenerator["default"].awrap(
            mathEval({
              userResponse: mathUnits,
              validation: {
                scoringType: "exactMatch",
                validResponse: validAnswers[i].mathUnits
              }
            })
          );

        case 23:
          _mathEvaluation = _context3.sent;
          evaluations = _objectSpread({}, evaluations, {}, _mathEvaluation);

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
  });
};
/**
 * mix and match math evluator
 *
 */

var mixAndMatchMathEvaluator = function mixAndMatchMathEvaluator(_ref3) {
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

  return _regenerator["default"].async(
    function mixAndMatchMathEvaluator$(_context5) {
      while (1) {
        switch ((_context5.prev = _context5.next)) {
          case 0:
            (userResponse = _ref3.userResponse), (validation = _ref3.validation);
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
                answersArray.push.apply(
                  answersArray,
                  (0, _toConsumableArray2["default"])(altResp.value)
                );
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

            _loop2 = function _loop2() {
              var id, validAnswers, calculations, result, correct;
              return _regenerator["default"].async(function _loop2$(_context4) {
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
                          input = combineUnitAndExpression(
                            _userResponse[id].value,
                            _userResponse[id].unit
                          );
                        } // removing pattern `<space> after \\`

                        return (0, _math.evaluate)({
                          checks: checks,
                          input: input.replace(/(\\\s|\s)+/g, "").replace(/[$]/g, "\\$"),
                          expected: expected.replace(/(\\\s|\s)+/g, "").replace(/[$]/g, "\\$")
                        });
                      });
                      _context4.next = 5;
                      return _regenerator["default"].awrap(Promise.all(calculations));

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
              });
            };

            (_i2 = 0), (_Object$keys2 = Object.keys(_userResponse));

          case 27:
            if (!(_i2 < _Object$keys2.length)) {
              _context5.next = 33;
              break;
            }

            _context5.next = 30;
            return _regenerator["default"].awrap(_loop2());

          case 30:
            _i2++;
            _context5.next = 27;
            break;

          case 33:
            return _context5.abrupt("return", evaluations);

          case 34:
          case "end":
            return _context5.stop();
        }
      }
    },
    null,
    null,
    [[7, 11, 15, 23], [16, , 18, 22]]
  );
};
/**
 * mix and match evaluators
 */

var mixAndMatchEvaluator = function mixAndMatchEvaluator(_ref4) {
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

  return _regenerator["default"].async(function mixAndMatchEvaluator$(_context6) {
    while (1) {
      switch ((_context6.prev = _context6.next)) {
        case 0:
          (userResponse = _ref4.userResponse), (validation = _ref4.validation);
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
            (allowSingleLetterMistake =
              _validation$allowSing2 === void 0 ? false : _validation$allowSing2);
          (_userResponse$inputs2 = userResponse.inputs),
            (inputs = _userResponse$inputs2 === void 0 ? {} : _userResponse$inputs2),
            (_userResponse$dropDow2 = userResponse.dropDowns),
            (dropDowns = _userResponse$dropDow2 === void 0 ? {} : _userResponse$dropDow2),
            (_userResponse$maths2 = userResponse.maths),
            (maths = _userResponse$maths2 === void 0 ? {} : _userResponse$maths2),
            (_userResponse$mathUni2 = userResponse.mathUnits),
            (mathUnits = _userResponse$mathUni2 === void 0 ? {} : _userResponse$mathUni2);
          alt_inputs = altResponses.map(function(alt_res) {
            return _objectSpread(
              {
                score: 1
              },
              alt_res.textinput
            );
          });
          alt_dropdowns = altResponses.map(function(alt_res) {
            return _objectSpread(
              {
                score: 1
              },
              alt_res.dropdown
            );
          });
          altMathUnits = altResponses.map(function(alt_res) {
            return _objectSpread(
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
                  validResponse: _objectSpread(
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
                  validResponse: _objectSpread(
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
          return _regenerator["default"].awrap(
            mixAndMatchMathEvaluator({
              userResponse: maths,
              validation: {
                validResponse: validResponse,
                altResponses: altResponses
              }
            })
          );

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
          return _regenerator["default"].awrap(
            mixAndMatchMathEvaluator({
              userResponse: mathUnits,
              validation: {
                validResponse: validResponse.mathUnits,
                altResponses: altMathUnits
              }
            })
          );

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
          evaluation = _objectSpread(
            {},
            dropDownEvaluation,
            {},
            clozeTextEvaluation,
            {},
            mathEvaluation,
            {},
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
  });
};

var _default = function _default(_ref5) {
  var _ref5$userResponse = _ref5.userResponse,
    userResponse = _ref5$userResponse === void 0 ? {} : _ref5$userResponse,
    validation = _ref5.validation;
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
