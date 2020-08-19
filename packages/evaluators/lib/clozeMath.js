"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));

var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

var _maxBy2 = _interopRequireDefault(require("lodash/maxBy"));

var _get2 = _interopRequireDefault(require("lodash/get"));

var _identity2 = _interopRequireDefault(require("lodash/identity"));

var _groupBy2 = _interopRequireDefault(require("lodash/groupBy"));

var _flatten2 = _interopRequireDefault(require("lodash/flatten"));

var _constants = require("@edulastic/constants");

var _math = require("./math");

var _clozeText = _interopRequireDefault(require("./clozeText"));

var _filterEmptyUserAnswers = require("./helpers/filterEmptyUserAnswers");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// combine unit and value for the clozeMath type Math w/Unit
var combineUnitAndExpression = function combineUnitAndExpression() {
  var expression = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var unit = arguments.length > 1 ? arguments[1] : undefined;

  if (expression.search("=") === -1) {
    return expression + unit;
  }

  return expression.replace(/=/gm, "".concat(unit, "="));
};

var mathEval = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var userResponse, validation, _validation, _userResponse, validResponses, evaluation, _loop, _i, _Object$keys;

    return _regenerator["default"].wrap(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userResponse = _ref.userResponse, validation = _ref.validation;
            _validation = (0, _cloneDeep2["default"])(validation);
            _userResponse = (0, _cloneDeep2["default"])(userResponse);
            validResponses = (0, _groupBy2["default"])((0, _flatten2["default"])(_validation.validResponse.value), "id");
            evaluation = {}; // parallelize network request!!

            _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
              var id, checks, answers, requests, results, correct;
              return _regenerator["default"].wrap(function _loop$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      id = _Object$keys[_i];
                      checks = (0, _math.getChecks)({
                        value: validResponses[id]
                      });
                      answers = (validResponses[id] || []).map(function (item) {
                        var _item$options = item.options,
                            options = _item$options === void 0 ? {} : _item$options;

                        if (options.unit) {
                          return combineUnitAndExpression(item.value, options.unit);
                        }

                        return item.value;
                      });
                      requests = answers.map(function (ans) {
                        var _userResponse$id$valu = _userResponse[id].value,
                            value = _userResponse$id$valu === void 0 ? "" : _userResponse$id$valu;
                        var unit = _userResponse[id].unit;

                        if (unit) {
                          value = combineUnitAndExpression(value, unit);
                        } // removing pattern `<space> after \\`


                        var data = {
                          input: value.replace(/(\\\s|\s)+/g, "").replace(/(\\)?\$]/g, "\\$"),
                          expected: ans ? ans.replace(/(\\\s|\s)+/g, "").replace(/(\\)?\$/g, "\\$") : "",
                          checks: checks
                        };
                        return (0, _math.evaluate)(data);
                      });
                      _context.next = 6;
                      return Promise.all(requests);

                    case 6:
                      results = _context.sent;
                      correct = results.some(function (item) {
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
            _i = 0, _Object$keys = Object.keys(_userResponse);

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
  }));

  return function mathEval(_x) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * transform user repsonse for the clozeText type evaluator.
 */


var transformUserResponse = function transformUserResponse(userResponse) {
  return Object.keys(userResponse).map(function (id) {
    return _objectSpread({
      id: id
    }, userResponse[id]);
  });
};

var normalEvaluator = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref3) {
    var _ref3$userResponse, userResponse, validation, validResponse, _validation$altRespon, altResponses, scoringType, minScoreIfAttempted, _validation$penalty, penalty, _validation$ignoreCas, ignoreCase, _validation$allowSing, allowSingleLetterMistake, _userResponse$inputs, inputs, _userResponse$dropDow, dropDowns, _userResponse$maths, maths, _userResponse$mathUni, mathUnits, score, maxScore, allEvaluations, _maths, _mathUnits, validAnswers, i, evaluations, currentScore, questionScore, dropDownEvaluation, clozeTextEvaluation, mathEvaluation, _mathEvaluation, correctCount, answersCount, scoreOfAnswer, penaltyOfAnwer, penaltyScore, selectedEvaluation;

    return _regenerator["default"].wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _ref3$userResponse = _ref3.userResponse, userResponse = _ref3$userResponse === void 0 ? {} : _ref3$userResponse, validation = _ref3.validation;
            validResponse = validation.validResponse, _validation$altRespon = validation.altResponses, altResponses = _validation$altRespon === void 0 ? [] : _validation$altRespon, scoringType = validation.scoringType, minScoreIfAttempted = validation.minScoreIfAttempted, _validation$penalty = validation.penalty, penalty = _validation$penalty === void 0 ? 0 : _validation$penalty, _validation$ignoreCas = validation.ignoreCase, ignoreCase = _validation$ignoreCas === void 0 ? false : _validation$ignoreCas, _validation$allowSing = validation.allowSingleLetterMistake, allowSingleLetterMistake = _validation$allowSing === void 0 ? false : _validation$allowSing;
            _userResponse$inputs = userResponse.inputs, inputs = _userResponse$inputs === void 0 ? {} : _userResponse$inputs, _userResponse$dropDow = userResponse.dropDowns, dropDowns = _userResponse$dropDow === void 0 ? {} : _userResponse$dropDow, _userResponse$maths = userResponse.maths, maths = _userResponse$maths === void 0 ? {} : _userResponse$maths, _userResponse$mathUni = userResponse.mathUnits, mathUnits = _userResponse$mathUni === void 0 ? {} : _userResponse$mathUni;
            score = 0;
            maxScore = 0;
            allEvaluations = [];
            _maths = (0, _filterEmptyUserAnswers.filterEmptyAnswers)({
              type: "maths",
              userAnswers: maths
            });
            _mathUnits = (0, _filterEmptyUserAnswers.filterEmptyAnswers)({
              type: "mathWithUnits",
              userAnswers: mathUnits
            });
            validAnswers = [validResponse].concat((0, _toConsumableArray2["default"])(altResponses));
            i = 0;

          case 10:
            if (!(i < validAnswers.length)) {
              _context3.next = 38;
              break;
            }

            evaluations = {};
            currentScore = 0;
            questionScore = validAnswers[i] && validAnswers[i].score || 1;
            maxScore = Math.max(questionScore, maxScore);

            if (!(0, _isEmpty2["default"])(validAnswers[i].dropdown)) {
              dropDownEvaluation = (0, _clozeText["default"])({
                userResponse: transformUserResponse(dropDowns),
                validation: {
                  scoringType: _constants.evaluationType.EXACT_MATCH,
                  validResponse: _objectSpread({
                    score: 1
                  }, validAnswers[i].dropdown)
                }
              }).evaluation;
              evaluations = _objectSpread({}, evaluations, {}, dropDownEvaluation);
            }

            if (!(0, _isEmpty2["default"])(validAnswers[i].textinput)) {
              clozeTextEvaluation = (0, _clozeText["default"])({
                userResponse: transformUserResponse(inputs),
                validation: {
                  scoringType: _constants.evaluationType.EXACT_MATCH,
                  validResponse: _objectSpread({
                    score: 1
                  }, validAnswers[i].textinput),
                  ignoreCase: ignoreCase,
                  allowSingleLetterMistake: allowSingleLetterMistake
                }
              }).evaluation;
              evaluations = _objectSpread({}, evaluations, {}, clozeTextEvaluation);
            }

            if ((0, _isEmpty2["default"])(validAnswers[i].value)) {
              _context3.next = 22;
              break;
            }

            _context3.next = 20;
            return mathEval({
              userResponse: _maths,
              validation: {
                scoringType: _constants.evaluationType.EXACT_MATCH,
                validResponse: validAnswers[i]
              }
            });

          case 20:
            mathEvaluation = _context3.sent;
            evaluations = _objectSpread({}, evaluations, {}, mathEvaluation);

          case 22:
            if ((0, _isEmpty2["default"])(validAnswers[i].mathUnits)) {
              _context3.next = 27;
              break;
            }

            _context3.next = 25;
            return mathEval({
              userResponse: _mathUnits,
              validation: {
                scoringType: _constants.evaluationType.EXACT_MATCH,
                validResponse: validAnswers[i].mathUnits
              }
            });

          case 25:
            _mathEvaluation = _context3.sent;
            evaluations = _objectSpread({}, evaluations, {}, _mathEvaluation);

          case 27:
            correctCount = Object.values(evaluations).filter(_identity2["default"]).length;
            answersCount = (0, _get2["default"])(validAnswers[i].dropdown, ["value", "length"], 0) + (0, _get2["default"])(validAnswers[i].mathUnits, ["value", "length"], 0) + (0, _get2["default"])(validAnswers[i], ["value", "length"], 0) + (0, _get2["default"])(validAnswers[i].textinput, ["value", "length"], 0);
            scoreOfAnswer = maxScore / answersCount;
            penaltyOfAnwer = penalty / answersCount;
            penaltyScore = penaltyOfAnwer * (answersCount - correctCount);

            if (scoringType === _constants.evaluationType.EXACT_MATCH) {
              currentScore = correctCount === answersCount ? maxScore : 0;
            } else {
              // partial match
              currentScore = scoreOfAnswer * correctCount;
              currentScore -= penaltyScore;
            }

            score = Math.max(score, currentScore);
            allEvaluations.push({
              evaluation: evaluations,
              score: currentScore
            });

          case 35:
            i++;
            _context3.next = 10;
            break;

          case 38:
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

          case 43:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee2);
  }));

  return function normalEvaluator(_x2) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * mix and match math evluator
 *
 */


var mixAndMatchMathEvaluator = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref5) {
    var userResponse, validation, _validation, _userResponse, answersArray, _iterator, _step, altResp, answersById, evaluations, _loop2, _i2, _Object$keys2;

    return _regenerator["default"].wrap(function _callee3$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            userResponse = _ref5.userResponse, validation = _ref5.validation;
            _validation = (0, _cloneDeep2["default"])(validation);
            _userResponse = (0, _cloneDeep2["default"])(userResponse);
            answersArray = _validation.validResponse.value || [];
            _iterator = _createForOfIteratorHelper(_validation.altResponses);

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                altResp = _step.value;
                if (altResp.value && Array.isArray(altResp.value)) answersArray.push.apply(answersArray, (0, _toConsumableArray2["default"])(altResp.value));
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }

            answersById = (0, _groupBy2["default"])((0, _flatten2["default"])(answersArray), "id");
            evaluations = {}; // parallelize this at some point

            _loop2 = /*#__PURE__*/_regenerator["default"].mark(function _loop2() {
              var id, validAnswers, calculations, result, correct;
              return _regenerator["default"].wrap(function _loop2$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      id = _Object$keys2[_i2];
                      validAnswers = answersById[id];
                      calculations = validAnswers.map(function (validAnswer) {
                        var checks = (0, _math.getChecks)({
                          value: [validAnswer]
                        });
                        var expected = validAnswer.value || "";
                        var input = _userResponse[id].value || "";
                        var _validAnswer$options = validAnswer.options,
                            options = _validAnswer$options === void 0 ? {} : _validAnswer$options;

                        if (options.unit) {
                          var correctAnswerExpression = validAnswer.value || "";
                          var correctAnswerUnit = options.unit;
                          expected = combineUnitAndExpression(correctAnswerExpression, correctAnswerUnit);
                        }

                        if (_userResponse[id].unit) {
                          var userAnswerExpression = _userResponse[id].value || "";
                          var userAnswerUnit = _userResponse[id].unit;
                          input = combineUnitAndExpression(userAnswerExpression, userAnswerUnit);
                        } // removing pattern `<space> after \\`


                        return (0, _math.evaluate)({
                          checks: checks,
                          input: input.replace(/(\\\s|\s)+/g, "").replace(/(\\)?\$]/g, "\\$"),
                          expected: expected.replace(/(\\\s|\s)+/g, "").replace(/(\\)?\$]/g, "\\$")
                        });
                      });
                      _context4.next = 5;
                      return Promise.all(calculations);

                    case 5:
                      result = _context4.sent;
                      correct = result.some(function (item) {
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
            _i2 = 0, _Object$keys2 = Object.keys(_userResponse);

          case 10:
            if (!(_i2 < _Object$keys2.length)) {
              _context5.next = 15;
              break;
            }

            return _context5.delegateYield(_loop2(), "t0", 12);

          case 12:
            _i2++;
            _context5.next = 10;
            break;

          case 15:
            return _context5.abrupt("return", evaluations);

          case 16:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee3);
  }));

  return function mixAndMatchMathEvaluator(_x3) {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * mix and match evaluators
 */


var mixAndMatchEvaluator = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref7) {
    var userResponse, validation, validResponse, _validation$altRespon2, altResponses, _validation$minScoreI, minScoreIfAttempted, _validation$penalty2, penalty, _validation$ignoreCas2, ignoreCase, _validation$allowSing2, allowSingleLetterMistake, _userResponse$inputs2, inputs, _userResponse$dropDow2, dropDowns, _userResponse$maths2, maths, _userResponse$mathUni2, mathUnits, _maths, _mathUnits, alt_inputs, alt_dropdowns, altMathUnits, questionScore, score, optionCount, clozeTextEvaluation, dropDownEvaluation, mathEvaluation, mathUnitsEvaluation, evaluation, correctAnswerCount, wrongAnswerCount, negativeScore;

    return _regenerator["default"].wrap(function _callee4$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            userResponse = _ref7.userResponse, validation = _ref7.validation;
            validResponse = validation.validResponse, _validation$altRespon2 = validation.altResponses, altResponses = _validation$altRespon2 === void 0 ? [] : _validation$altRespon2, _validation$minScoreI = validation.minScoreIfAttempted, minScoreIfAttempted = _validation$minScoreI === void 0 ? 0 : _validation$minScoreI, _validation$penalty2 = validation.penalty, penalty = _validation$penalty2 === void 0 ? 0 : _validation$penalty2, _validation$ignoreCas2 = validation.ignoreCase, ignoreCase = _validation$ignoreCas2 === void 0 ? false : _validation$ignoreCas2, _validation$allowSing2 = validation.allowSingleLetterMistake, allowSingleLetterMistake = _validation$allowSing2 === void 0 ? false : _validation$allowSing2;
            _userResponse$inputs2 = userResponse.inputs, inputs = _userResponse$inputs2 === void 0 ? {} : _userResponse$inputs2, _userResponse$dropDow2 = userResponse.dropDowns, dropDowns = _userResponse$dropDow2 === void 0 ? {} : _userResponse$dropDow2, _userResponse$maths2 = userResponse.maths, maths = _userResponse$maths2 === void 0 ? {} : _userResponse$maths2, _userResponse$mathUni2 = userResponse.mathUnits, mathUnits = _userResponse$mathUni2 === void 0 ? {} : _userResponse$mathUni2;
            _maths = (0, _filterEmptyUserAnswers.filterEmptyAnswers)({
              type: "maths",
              userAnswers: maths
            });
            _mathUnits = (0, _filterEmptyUserAnswers.filterEmptyAnswers)({
              type: "mathWithUnits",
              userAnswers: mathUnits
            });
            alt_inputs = altResponses.map(function (alt_res) {
              return _objectSpread({
                score: 1
              }, alt_res.textinput);
            });
            alt_dropdowns = altResponses.map(function (alt_res) {
              return _objectSpread({
                score: 1
              }, alt_res.dropdown);
            });
            altMathUnits = altResponses.map(function (alt_res) {
              return _objectSpread({
                score: 1
              }, alt_res.mathUnits);
            });
            questionScore = validResponse && validResponse.score || 1;
            score = 0;
            optionCount = (0, _get2["default"])(validResponse.dropdown, ["value", "length"], 0) + (0, _get2["default"])(validResponse.mathUnits, ["value", "length"], 0) + (0, _get2["default"])(validResponse, ["value", "length"], 0) + (0, _get2["default"])(validResponse.textinput, ["value", "length"], 0); // cloze-text evaluation!

            clozeTextEvaluation = !(0, _isEmpty2["default"])(validResponse.textinput) && (0, _clozeText["default"])({
              userResponse: transformUserResponse(inputs),
              validation: {
                scoringType: _constants.evaluationType.EXACT_MATCH,
                validResponse: _objectSpread({
                  score: 1
                }, validResponse.textinput),
                altResponses: alt_inputs,
                mixAndMatch: true,
                ignoreCase: ignoreCase,
                allowSingleLetterMistake: allowSingleLetterMistake
              }
            }).evaluation || {}; // dropdown evaluation

            dropDownEvaluation = !(0, _isEmpty2["default"])(validResponse.dropdown) && (0, _clozeText["default"])({
              userResponse: transformUserResponse(dropDowns),
              validation: {
                scoringType: _constants.evaluationType.EXACT_MATCH,
                validResponse: _objectSpread({
                  score: 1
                }, validResponse.dropdown),
                altResponses: alt_dropdowns,
                mixAndMatch: true
              }
            }).evaluation || {}; // math evaluations

            _context6.t1 = !(0, _isEmpty2["default"])(validResponse.value);

            if (!_context6.t1) {
              _context6.next = 18;
              break;
            }

            _context6.next = 17;
            return mixAndMatchMathEvaluator({
              userResponse: _maths,
              validation: {
                validResponse: validResponse,
                altResponses: altResponses
              }
            });

          case 17:
            _context6.t1 = _context6.sent;

          case 18:
            _context6.t0 = _context6.t1;

            if (_context6.t0) {
              _context6.next = 21;
              break;
            }

            _context6.t0 = {};

          case 21:
            mathEvaluation = _context6.t0;
            _context6.t3 = !(0, _isEmpty2["default"])(validResponse.mathUnits);

            if (!_context6.t3) {
              _context6.next = 27;
              break;
            }

            _context6.next = 26;
            return mixAndMatchMathEvaluator({
              userResponse: _mathUnits,
              validation: {
                validResponse: validResponse.mathUnits,
                altResponses: altMathUnits
              }
            });

          case 26:
            _context6.t3 = _context6.sent;

          case 27:
            _context6.t2 = _context6.t3;

            if (_context6.t2) {
              _context6.next = 30;
              break;
            }

            _context6.t2 = {};

          case 30:
            mathUnitsEvaluation = _context6.t2;
            evaluation = _objectSpread({}, dropDownEvaluation, {}, clozeTextEvaluation, {}, mathEvaluation, {}, mathUnitsEvaluation);
            correctAnswerCount = Object.values(evaluation).filter(_identity2["default"]).length;
            wrongAnswerCount = Object.values(evaluation).filter(function (i) {
              return !i;
            }).length;

            if (validation.scoringType === _constants.evaluationType.PARTIAL_MATCH) {
              score = correctAnswerCount / optionCount * questionScore;

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

          case 37:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee4);
  }));

  return function mixAndMatchEvaluator(_x4) {
    return _ref8.apply(this, arguments);
  };
}();

var _default = function _default(_ref9) {
  var _ref9$userResponse = _ref9.userResponse,
      userResponse = _ref9$userResponse === void 0 ? {} : _ref9$userResponse,
      validation = _ref9.validation;
  return validation.mixAndMatch ? mixAndMatchEvaluator({
    userResponse: userResponse,
    validation: validation
  }) : normalEvaluator({
    userResponse: userResponse,
    validation: validation
  });
};

exports["default"] = _default;