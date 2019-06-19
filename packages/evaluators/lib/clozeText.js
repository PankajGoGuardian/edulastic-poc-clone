"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _get2 = _interopRequireDefault(require("lodash/get"));

var _max2 = _interopRequireDefault(require("lodash/max"));

var _maxBy2 = _interopRequireDefault(require("lodash/maxBy"));

var _identity2 = _interopRequireDefault(require("lodash/identity"));

var _fastLevenshtein = require("fast-levenshtein");

// create an `{id: value}` list from object
var createAnswerObject = function createAnswerObject(answers) {
  var responses = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (
      var _iterator = answers[Symbol.iterator](), _step;
      !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
      _iteratorNormalCompletion = true
    ) {
      var ans = _step.value;
      if (ans) responses[ans.id] = ans.value;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
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
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (
      var _iterator2 = answers[Symbol.iterator](), _step2;
      !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
      _iteratorNormalCompletion2 = true
    ) {
      var answer = _step2.value;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (
          var _iterator3 = answer.value[Symbol.iterator](), _step3;
          !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done);
          _iteratorNormalCompletion3 = true
        ) {
          var choice = _step3.value;
          answersById[choice.id] = !answersById[choice.id]
            ? [choice.value.trim()]
            : [].concat((0, _toConsumableArray2["default"])(answersById[choice.id]), [choice.value.trim()]);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return answersById;
}; // mix and match evaluator

var mixAndMatchEvaluator = function mixAndMatchEvaluator(_ref) {
  var userResponse = _ref.userResponse,
    validation = _ref.validation;
  var responses = createAnswerObject(userResponse);
  var answers = [validation.valid_response].concat((0, _toConsumableArray2["default"])(validation.alt_responses || []));
  var maxScore = (0, _max2["default"])(
    answers.map(function(i) {
      return i.score;
    })
  );
  var evaluation = {};
  var answersById = groupChoiceById(answers);
  var optionCount = (0, _get2["default"])(validation, "valid_response.value.length", 0);
  var score = 0;
  var questionScore = (0, _get2["default"])(validation, "valid_response.score", 1);

  var _loop = function _loop() {
    var id = _Object$keys[_i];
    var answerSet = answersById[id];
    var userResp = responses[id];
    evaluation[id] = answerSet.some(function(item) {
      return compareChoice(item, userResp, validation.allowSingleLetterMistake, validation.ignoreCase);
    });
  };

  for (var _i = 0, _Object$keys = Object.keys(responses); _i < _Object$keys.length; _i++) {
    _loop();
  } // correct and wrong answer count

  var correctAnswerCount = Object.values(evaluation).filter(_identity2["default"]).length;
  var wrongAnswerCount = Object.values(evaluation).filter(function(i) {
    return !i;
  }).length;

  if (validation.scoring_type === "partialMatch") {
    score = (correctAnswerCount / optionCount) * questionScore;

    if (validation.penalty) {
      var penalty = validation.penalty * wrongAnswerCount;
      score -= penalty;
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
  var answers = [validation.valid_response].concat((0, _toConsumableArray2["default"])(validation.alt_responses || []));
  var evaluations = [];
  var maxScore = (0, _max2["default"])(
    answers.map(function(i) {
      return i.score;
    })
  );
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (
      var _iterator4 = answers[Symbol.iterator](), _step4;
      !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done);
      _iteratorNormalCompletion4 = true
    ) {
      var answer = _step4.value;
      var currentEvaluation = {};
      var currentScore = 0;
      var answerObj = createAnswerObject(answer.value);

      for (var _i2 = 0, _Object$keys2 = Object.keys(responses); _i2 < _Object$keys2.length; _i2++) {
        var id = _Object$keys2[_i2];
        currentEvaluation[id] = compareChoice(
          answerObj[id],
          responses[id],
          validation.allowSingleLetterMistake,
          validation.ignoreCase
        );
      }

      var correctAnswerCount = Object.values(currentEvaluation).filter(_identity2["default"]).length; // if scoring type is "partialMatch", calculate the partial score

      if (validation.scoring_type === "partialMatch") {
        var questionScore = answer.score;
        currentScore = questionScore * (correctAnswerCount / answer.value.length); // if penalty is present

        if (validation.penalty) {
          var wrongAnswerCount = Object.values(currentEvaluation).filter(function(i) {
            return !i;
          }).length;
          var penalty = validation.penalty * wrongAnswerCount;
          currentScore -= penalty;
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
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
        _iterator4["return"]();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  var correct = (0, _maxBy2["default"])(evaluations, "score"); // if user doesnt get correct answers at all, send back the evaluation to first one.

  var evaluation = correct.score === 0 ? evaluations[0] : correct; // if score for attempting is present

  if (validation.min_score_if_attempted && evaluation.score < validation.min_score_if_attempted) {
    evaluation.score = validation.min_score_if_attempted;
  }

  return (0, _objectSpread2["default"])({}, evaluation, {
    maxScore: maxScore
  });
}; // cloze text evaluator

var evaluator = function evaluator(_ref3) {
  var _ref3$userResponse = _ref3.userResponse,
    userResponse = _ref3$userResponse === void 0 ? [] : _ref3$userResponse,
    _ref3$validation = _ref3.validation,
    validation = _ref3$validation === void 0 ? {} : _ref3$validation;
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

var _default = evaluator;
exports["default"] = _default;
