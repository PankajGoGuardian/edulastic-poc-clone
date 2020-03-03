"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _identity2 = _interopRequireDefault(require("lodash/identity"));

var _flatten2 = _interopRequireDefault(require("lodash/flatten"));

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _scoring = require("./const/scoring");

var rowEvaluation = function rowEvaluation() {
  var answer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var userResponse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var prevEvaluation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var mainRow = answer.slice();
  var evaluation = userResponse.map(function(i, index) {
    if (mainRow.includes(i)) {
      mainRow.splice(mainRow.indexOf(i), 1);
      return true;
    }

    return prevEvaluation[index] || false;
  });
  return evaluation;
};
/**
 * exact match evaluator
 * @param {Array} answers - possible set of correct answer
 * @param {Array} userReponse - answers set by user
 */

var exactMatchEvaluator = function exactMatchEvaluator() {
  var answers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var userResponse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var evaluation = [];
  var score = 0;
  var maxScore = 0; // evaluate for each set of possible correct answer.

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (
      var _iterator = answers[Symbol.iterator](), _step;
      !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
      _iteratorNormalCompletion = true
    ) {
      var correctAnswer = _step.value;
      var _answer = correctAnswer.value,
        possibleMaxScore = correctAnswer.score; // handle the empty scenario.

      if (!Array.isArray(_answer)) {
        continue;
      } // maxScore is max amongs all possible maxScores in possible set of responses.

      maxScore = Math.max(possibleMaxScore || 0, maxScore);
      var correct = true; // check if all rows matches.
      // check equality in set handles order issue - here order in each row of response doesnt matter.

      _answer.forEach(function(row, i) {
        if (!userResponse[i] || !(0, _isEqual2["default"])(row.slice().sort(), userResponse[i].slice().sort()))
          correct = false;
      }); // if muliple set of correct answer matches, give user max among them!

      if (correct) {
        score = Math.max(score, possibleMaxScore || 0);
      }
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

  if (score) {
    // if score exist, that means its a perfect match. hence set every element
    // in every row as true.
    evaluation = userResponse.map(function(row, i) {
      return new Array(row.length).fill(true);
    });
  } else {
    // if its not a perfect match, construct evaluation based on
    // first possible set of answer.
    var answer = answers[0].value;
    evaluation = userResponse.map(function(row, i) {
      var answerRow = answer[i] || [];
      return rowEvaluation(answerRow, row);
    });
  }

  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
};

var partialMatchEvaluator = function partialMatchEvaluator() {
  var answers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var userResponse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var evaluation = [];
  var score = 0;
  var maxScore = 0;
  var prevEvaluation = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    var _loop = function _loop() {
      var answer = _step2.value;
      var currentAnswer = answer.value,
        possibleMaxScore = answer.score;
      maxScore = Math.max(maxScore, possibleMaxScore || 0);
      var currentEvalution = userResponse.map(function(row, i) {
        var answerRow = currentAnswer[i] || [];
        return rowEvaluation(answerRow, row, prevEvaluation[i]);
      });
      var answersCount = (0, _flatten2["default"])(currentAnswer).length;
      var correctCount = currentEvalution.reduce(function(correct, item) {
        var rowCorrectCount = item.filter(_identity2["default"]).length;
        return (correct += rowCorrectCount);
      }, 0);
      var currentScore = (possibleMaxScore * correctCount) / answersCount;

      if (currentScore > score) {
        score = currentScore;
        evaluation = currentEvalution;
      } else {
        evaluation = currentEvalution;
      }

      prevEvaluation = evaluation;
    };

    for (
      var _iterator2 = answers[Symbol.iterator](), _step2;
      !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
      _iteratorNormalCompletion2 = true
    ) {
      _loop();
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

  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
};

var evaluator = function evaluator(_ref) {
  var _ref$userResponse = _ref.userResponse,
    userResponse = _ref$userResponse === void 0 ? [] : _ref$userResponse,
    validation = _ref.validation;
  var validResponse = validation.validResponse,
    _validation$altRespon = validation.altResponses,
    altResponses = _validation$altRespon === void 0 ? [] : _validation$altRespon,
    scoringType = validation.scoringType;
  var answers = [validResponse].concat((0, _toConsumableArray2["default"])(altResponses));
  return scoringType === _scoring.ScoringType.EXACT_MATCH
    ? exactMatchEvaluator(answers, userResponse)
    : partialMatchEvaluator(answers, userResponse);
};

var _default = evaluator;
exports["default"] = _default;
