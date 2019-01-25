"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _api = require("@edulastic/api");

var _lodash = require("lodash");

var _scoring = require("./const/scoring");

var getChecks = function getChecks(validation) {
  var altResponses = validation.alt_responses || [];
  var values = (0, _toConsumableArray2.default)(validation.valid_response.value).concat((0, _toConsumableArray2.default)(altResponses.reduce(function (acc, res) {
    return (0, _toConsumableArray2.default)(acc).concat((0, _toConsumableArray2.default)(res.value));
  }, [])));
  return values.reduce(function (valAcc, val, valIndex) {
    var options = val.options || {};
    options = (0, _lodash.omitBy)(options, function (f) {
      return f === false;
    });
    var midRes = Object.keys(options).reduce(function (acc, key, i) {
      var fieldVal = options[key];
      acc += i === 0 ? ':' : '';

      if (key === 'argument') {
        return acc;
      }

      if (fieldVal === false) {
        return acc;
      }

      if (key === 'setThousandsSeparator') {
        if (fieldVal.length) {
          var stringArr = "[".concat(fieldVal.map(function (f) {
            return "'".concat(f, "'");
          }), "]");
          acc += "".concat(key, "=").concat(stringArr);
        } else {
          return acc;
        }
      } else if (key === 'allowThousandsSeparator') {
        return acc;
      } else if (key === 'setDecimalSeparator') {
        acc += "".concat(key, "='").concat(fieldVal, "'");
      } else if (key === 'allowedUnits') {
        acc += "".concat(key, "=[").concat(fieldVal, "]");
      } else if (key === 'syntax') {
        acc += options.argument === undefined ? fieldVal : "".concat(fieldVal, "=").concat(options.argument);
      } else {
        acc += "".concat(key, "=").concat(fieldVal);
      }

      return "".concat(acc, ",");
    }, val.method);

    if (midRes[midRes.length - 1] === ',') {
      midRes = midRes.slice(0, midRes.length - 1);
    }

    valAcc += midRes;
    valAcc += valIndex + 1 === values.length ? '' : ';';
    return valAcc;
  }, '');
}; // exact match evaluator


var exactMatchEvaluator =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(userResponse, answers, checks) {
    var score, maxScore, evaluation, getAnswerCorrectMethods, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, answer, corrects, valid, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, correct, data, _ref2, result;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            score = 0;
            maxScore = 0;
            evaluation = [];

            getAnswerCorrectMethods = function getAnswerCorrectMethods(answer) {
              if (answer.value && answer.value.length) {
                return answer.value.map(function (val) {
                  return val.value;
                });
              }

              return [];
            };
            /* eslint-disable */


            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 7;
            _iterator = answers[Symbol.iterator]();

          case 9:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 51;
              break;
            }

            answer = _step.value;
            corrects = getAnswerCorrectMethods(answer);
            valid = false;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context.prev = 16;
            _iterator2 = corrects[Symbol.iterator]();

          case 18:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context.next = 31;
              break;
            }

            correct = _step2.value;
            data = {
              input: userResponse.replace(/\\ /g, ' '),
              expected: correct ? correct.replace(/\\ /g, ' ') : ':',
              checks: checks
            };
            _context.next = 23;
            return _api.evaluateApi.evaluate(data);

          case 23:
            _ref2 = _context.sent;
            result = _ref2.result;

            if (!(result === 'true')) {
              _context.next = 28;
              break;
            }

            valid = true;
            return _context.abrupt("break", 31);

          case 28:
            _iteratorNormalCompletion2 = true;
            _context.next = 18;
            break;

          case 31:
            _context.next = 37;
            break;

          case 33:
            _context.prev = 33;
            _context.t0 = _context["catch"](16);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t0;

          case 37:
            _context.prev = 37;
            _context.prev = 38;

            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }

          case 40:
            _context.prev = 40;

            if (!_didIteratorError2) {
              _context.next = 43;
              break;
            }

            throw _iteratorError2;

          case 43:
            return _context.finish(40);

          case 44:
            return _context.finish(37);

          case 45:
            if (valid) {
              score = Math.max(answer.score, score);
            }

            maxScore = Math.max(answer.score, maxScore);
            evaluation = (0, _toConsumableArray2.default)(evaluation).concat([valid]);

          case 48:
            _iteratorNormalCompletion = true;
            _context.next = 9;
            break;

          case 51:
            _context.next = 57;
            break;

          case 53:
            _context.prev = 53;
            _context.t1 = _context["catch"](7);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 57:
            _context.prev = 57;
            _context.prev = 58;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 60:
            _context.prev = 60;

            if (!_didIteratorError) {
              _context.next = 63;
              break;
            }

            throw _iteratorError;

          case 63:
            return _context.finish(60);

          case 64:
            return _context.finish(57);

          case 65:
            return _context.abrupt("return", {
              score: score,
              maxScore: maxScore,
              evaluation: evaluation
            });

          case 66:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[7, 53, 57, 65], [16, 33, 37, 45], [38,, 40, 44], [58,, 60, 64]]);
  }));

  return function exactMatchEvaluator(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var evaluator =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(_ref3) {
    var userResponse, validation, valid_response, _validation$alt_respo, alt_responses, scoring_type, attemptScore, answers, result, checks;

    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userResponse = _ref3.userResponse, validation = _ref3.validation;
            valid_response = validation.valid_response, _validation$alt_respo = validation.alt_responses, alt_responses = _validation$alt_respo === void 0 ? [] : _validation$alt_respo, scoring_type = validation.scoring_type, attemptScore = validation.min_score_if_attempted;
            answers = [valid_response].concat((0, _toConsumableArray2.default)(alt_responses));
            _context2.t0 = scoring_type;
            _context2.next = _context2.t0 === _scoring.ScoringType.EXACT_MATCH ? 6 : 6;
            break;

          case 6:
            checks = getChecks(validation);
            _context2.next = 9;
            return exactMatchEvaluator(userResponse, answers, checks);

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
    }, _callee2, this);
  }));

  return function evaluator(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

var _default = evaluator;
exports.default = _default;