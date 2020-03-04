"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

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

/**
 *
 * @param {Array} allAnswers
 * Group all the answers together
 * Input: [{ value: [ [0], [1] ] }, { value: [ [1], [1] ] }
 * Output: [ [0,1], [0,1] ]
 */
var getAnswerSet = function getAnswerSet(allAnswers) {
  var answerSet = [];
  allAnswers.forEach(function(answer) {
    answer.value.forEach(function(row, rowIndex) {
      answerSet[rowIndex] = answerSet[rowIndex] || [];

      if (row) {
        row.forEach(function(ans) {
          if (!answerSet[rowIndex].includes(ans)) {
            answerSet[rowIndex].push(ans);
          }
        });
      }
    });
  });
  return answerSet;
};
/**
 *
 * @param {Array} allAnswers
 * get the max score from correct answer or alternate answers
 */

var getMaxScore = function getMaxScore(allAnswers) {
  var maxScore = allAnswers.reduce(function(max, current) {
    if (current.score > max) {
      max = current.score;
    }

    return max;
  }, -1);
  return maxScore;
};
/**
 *
 * @param {Array} userAnswers
 * transform the user answer for showing correct validation
 * put the value to the correct index
 * Input: [[0], [1], [0], [0]]
 * Output: [[0], [undefined, 1], [0]]
 */

var transformUserAnswer = function transformUserAnswer() {
  var userAnswers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return userAnswers.map(function(row) {
    var _row = [];

    if (row) {
      row.forEach(function(col) {
        _row[col] = _row[col] || col;
      });
    }

    return _row;
  });
};
/**
 *
 * @param {Array} userAnswers
 * @param {Array} answerSet
 */

var evaluateAnswers = function evaluateAnswers(userAnswers, answerSet) {
  var transformedUserAnswers = transformUserAnswer(userAnswers);
  var evaluation = transformedUserAnswers.map(function(row, rowIndex) {
    if (row) {
      return row.map(function(ans) {
        return answerSet[rowIndex].includes(ans);
      });
    }

    return row;
  });
  return evaluation;
};
/**
 *
 * @param {Array.<number[]>} evaluation
 */

var getAnswerCount = function getAnswerCount(evaluation) {
  var correct = 0;
  var incorrect = 0;
  evaluation.forEach(function(row) {
    if (row) {
      row.forEach(function(ans) {
        ans === true ? correct++ : incorrect++;
      });
    }
  });
  return [correct, incorrect];
};
/**
 *
 * @param {userResponse} Object
 * @param {validation} Object
 */

var evaluator = function evaluator(_ref) {
  var _ref$userResponse = _ref.userResponse,
    userResponse = _ref$userResponse === void 0 ? {} : _ref$userResponse,
    _ref$validation = _ref.validation,
    validation = _ref$validation === void 0 ? {} : _ref$validation;
  var _userResponse$value = userResponse.value,
    userAnswers = _userResponse$value === void 0 ? [] : _userResponse$value;
  var validResponse = validation.validResponse,
    altResponses = validation.altResponses,
    scoringType = validation.scoringType,
    _validation$penalty = validation.penalty,
    penalty = _validation$penalty === void 0 ? 0 : _validation$penalty;
  var allAnswers = [_objectSpread({}, validResponse)].concat((0, _toConsumableArray2["default"])(altResponses));
  var score = 0; // initial score

  var maxScore = getMaxScore(allAnswers);

  if (!userAnswers.length) {
    return {
      score: score,
      maxScore: maxScore,
      evaluation: []
    };
  }

  var answerSet = getAnswerSet(allAnswers);
  var evaluation = evaluateAnswers(userAnswers, answerSet);
  var correctAnswerRows = evaluation.filter(function(arr) {
    return (
      arr.length > 0 &&
      arr.every(function(ans) {
        return ans === true;
      })
    );
  });

  var _getAnswerCount = getAnswerCount(evaluation),
    _getAnswerCount2 = (0, _slicedToArray2["default"])(_getAnswerCount, 2),
    correctAnswers = _getAnswerCount2[0],
    incorrectAnswers = _getAnswerCount2[1];

  if (scoringType === "partialMatch") {
    var individualScore = maxScore / evaluation.length;
    var correctAnswerScore = Math.min(correctAnswers * individualScore, maxScore);
    var penalisation = incorrectAnswers * penalty;
    score = Math.max(correctAnswerScore - penalisation, 0).toPrecision(2);
  } else if (correctAnswerRows.length === evaluation.length) {
    // exact match with all answers correct
    score = maxScore;
  }

  var evaluationObject = {
    score: parseFloat(score),
    maxScore: maxScore,
    evaluation: evaluation
  };
  return evaluationObject;
};

var _default = evaluator;
exports["default"] = _default;
