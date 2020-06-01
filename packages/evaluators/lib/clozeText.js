"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _isArray2 = _interopRequireDefault(require("lodash/isArray"));

var _get2 = _interopRequireDefault(require("lodash/get"));

var _max2 = _interopRequireDefault(require("lodash/max"));

var _maxBy2 = _interopRequireDefault(require("lodash/maxBy"));

var _identity2 = _interopRequireDefault(require("lodash/identity"));

var _fastLevenshtein = require("fast-levenshtein");

var _rounding = require("./const/rounding");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// create an `{id: value}` list from object
var createAnswerObject = function createAnswerObject(answers) {
  var responses = {};

  var _iterator = _createForOfIteratorHelper(answers),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var ans = _step.value;
      if (ans) responses[ans.id] = ans.value;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return responses;
};
/**
 *
 * @param {string} answer  // correct answer
 * @param {string} response  // user response
 * @param {boolean} allowSingleLetterMistake  // is single letter mistake accepted
 * @param {boolean} ignoreCase  // ignore case of answer
 */


var compareChoice = function compareChoice(answer, response) {
  var allowSingleLetterMistake = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var ignoreCase = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  // trimmmm...
  answer = ignoreCase ? answer.trim().toLowerCase() : answer.trim();
  response = ignoreCase ? response.trim().toLowerCase() : response.trim(); // is single letter mistake allowed?
  // if yes, then check if "levenshtein-distance" is less than 1
  // else it should be a an exact match

  return allowSingleLetterMistake ? (0, _fastLevenshtein.get)(answer, response) <= 1 : answer === response;
};

var groupChoiceById = function groupChoiceById(answers) {
  var answersById = {};

  var _iterator2 = _createForOfIteratorHelper(answers),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var answer = _step2.value;

      var _iterator3 = _createForOfIteratorHelper(answer.value),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var choice = _step3.value;

          if ((0, _isArray2["default"])(choice.value)) {
            answersById[choice.id] = !answersById[choice.id] ? choice.value.map(function (v) {
              return v.trim();
            }) : [].concat((0, _toConsumableArray2["default"])(answersById[choice.id]), (0, _toConsumableArray2["default"])(choice.value.map(function (v) {
              return v.trim();
            })));
          } else {
            answersById[choice.id] = !answersById[choice.id] ? [choice.value.trim()] : [].concat((0, _toConsumableArray2["default"])(answersById[choice.id]), [choice.value.trim()]);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return answersById;
}; // mix and match evaluator


var mixAndMatchEvaluator = function mixAndMatchEvaluator(_ref) {
  var userResponse = _ref.userResponse,
      validation = _ref.validation;
  var responses = createAnswerObject(userResponse);
  var answers = [validation.validResponse].concat((0, _toConsumableArray2["default"])(validation.altResponses || []));
  var maxScore = (0, _max2["default"])(answers.map(function (i) {
    return i.score;
  }));
  var evaluation = {};
  var answersById = groupChoiceById(answers);
  var optionCount = (0, _get2["default"])(validation, "validResponse.value.length", 0);
  var score = 0;
  var questionScore = (0, _get2["default"])(validation, "validResponse.score", 1);

  var _loop = function _loop() {
    var id = _Object$keys[_i];
    var answerSet = answersById[id];
    var userResp = responses[id];
    evaluation[id] = answerSet.some(function (item) {
      return compareChoice(item, userResp, validation.allowSingleLetterMistake, validation.ignoreCase);
    });
  };

  for (var _i = 0, _Object$keys = Object.keys(responses); _i < _Object$keys.length; _i++) {
    _loop();
  } // correct and wrong answer count


  var correctAnswerCount = Object.values(evaluation).filter(_identity2["default"]).length;
  var wrongAnswerCount = Object.values(evaluation).filter(function (i) {
    return !i;
  }).length;

  if (validation.scoringType === "partialMatch") {
    score = correctAnswerCount / optionCount * questionScore;

    if (validation.penalty) {
      var penalty = validation.penalty * wrongAnswerCount;
      score -= penalty;
    } // if rounding is selected, but score achieved is not full score, then round down to nearest integer


    if (validation.rounding === _rounding.rounding.ROUND_DOWN && score !== questionScore) {
      score = Math.floor(score);
    }
  } else if (correctAnswerCount === optionCount) {
    score = questionScore;
  }

  score = Math.max(score, 0);
  return {
    score: score,
    evaluation: evaluation,
    maxScore: maxScore
  };
}; // normal evaluator


var normalEvaluator = function normalEvaluator(_ref2) {
  var userResponse = _ref2.userResponse,
      validation = _ref2.validation;
  var responses = createAnswerObject(userResponse);
  var answers = [validation.validResponse].concat((0, _toConsumableArray2["default"])(validation.altResponses || []));
  var evaluations = [];
  var maxScore = (0, _max2["default"])(answers.map(function (i) {
    return i.score;
  }));

  var _iterator4 = _createForOfIteratorHelper(answers),
      _step4;

  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var answer = _step4.value;
      var currentEvaluation = {};
      var currentScore = 0;
      var answerObj = createAnswerObject(answer.value);

      for (var _i2 = 0, _Object$keys2 = Object.keys(responses); _i2 < _Object$keys2.length; _i2++) {
        var id = _Object$keys2[_i2];
        currentEvaluation[id] = compareChoice(answerObj[id], responses[id], validation.allowSingleLetterMistake, validation.ignoreCase);
      }

      var correctAnswerCount = Object.values(currentEvaluation).filter(_identity2["default"]).length; // if scoring type is "partialMatch", calculate the partial score

      if (validation.scoringType === "partialMatch") {
        var questionScore = answer.score;
        currentScore = questionScore * (correctAnswerCount / answer.value.length); // if penalty is present

        if (validation.penalty) {
          var wrongAnswerCount = Object.values(currentEvaluation).filter(function (i) {
            return !i;
          }).length;
          var penalty = validation.penalty * wrongAnswerCount;
          currentScore -= penalty;
        } // if rounding is selected, but score achieved is not full score, then round down to nearest integer


        if (validation.rounding === _rounding.rounding.ROUND_DOWN && currentScore !== answer.score) {
          currentScore = Math.floor(currentScore);
        } // if less than 0, round it to 0


        currentScore = currentScore > 0 ? currentScore : 0;
      } else if (correctAnswerCount === answer.value.length) {
        // in case of exact match
        currentScore = answer.score;
      }

      evaluations.push({
        score: currentScore,
        evaluation: currentEvaluation
      });
    } // one which gave max score from the set of answers

  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }

  var correct = (0, _maxBy2["default"])(evaluations, "score"); // if user doesnt get correct answers at all, send back the evaluation to first one.

  var evaluation = correct.score === 0 ? evaluations[0] : correct; // if score for attempting is present

  if (validation.minScoreIfAttempted && evaluation.score < validation.minScoreIfAttempted) {
    evaluation.score = validation.minScoreIfAttempted;
  }

  return _objectSpread({}, evaluation, {
    maxScore: maxScore
  });
}; // cloze text evaluator


var evaluator = function evaluator(_ref3) {
  var _ref3$userResponse = _ref3.userResponse,
      userResponse = _ref3$userResponse === void 0 ? [] : _ref3$userResponse,
      _ref3$validation = _ref3.validation,
      validation = _ref3$validation === void 0 ? {} : _ref3$validation;
  return validation.mixAndMatch ? mixAndMatchEvaluator({
    userResponse: userResponse,
    validation: validation
  }) : normalEvaluator({
    userResponse: userResponse,
    validation: validation
  });
};

var _default = evaluator;
exports["default"] = _default;