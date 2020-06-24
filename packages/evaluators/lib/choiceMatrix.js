"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _keys2 = _interopRequireDefault(require("lodash/keys"));

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));

var _rounding = require("./const/rounding");

var _scoring = require("./const/scoring");

var ROUND_DOWN = _rounding.rounding.ROUND_DOWN,
    NONE = _rounding.rounding.NONE;
var PARTIAL_MATCH = _scoring.ScoringType.PARTIAL_MATCH,
    EXACT_MATCH = _scoring.ScoringType.EXACT_MATCH;
/**
 *
 * @param {Array} allAnswers
 * get the max score from correct answer or alternate answers
 */

var getMaxScore = function getMaxScore(allAnswers) {
  var maxScore = allAnswers.reduce(function (max, current) {
    if (current.score > max) {
      max = current.score;
    }

    return max;
  }, -1);
  return maxScore;
};
/**
 *
 * @param {Array<Number[]>} userResponse
 * @param {Array<Object>} allAnswers
 *
 * validate the user response against all the answers
 * get evaluations against all the answers
 * also store the total correct, incorrect attempts against each answer set
 */


var getEvaluationExactMatch = function getEvaluationExactMatch(userResponse, allAnswers) {
  var evaluations = allAnswers.map(function (answer) {
    var value = answer.value,
        score = answer.score;
    var actualCorrectAnswers = (0, _keys2["default"])(value).length;
    var correctAttempts = 0;
    var incorrectAttempts = 0; // get the evaluation and score

    var evaluation = {};
    (0, _keys2["default"])(userResponse).forEach(function (responseId) {
      var correct = (0, _isEqual2["default"])(value[responseId], userResponse[responseId]);
      correct ? correctAttempts++ : incorrectAttempts++;
      evaluation[responseId] = correct;
    });
    return {
      result: evaluation,
      correctAttempts: correctAttempts,
      incorrectAttempts: incorrectAttempts,
      maxScore: score,
      actualCorrectAnswers: actualCorrectAnswers
    };
  });
  return evaluations;
};
/**
 *
 * @param {Array<Number[]>} userResponse
 * @param {Object} validation
 *
 * scoring is given on all or nothing basis
 * highlights are shown according to best match from all answer sets
 */


var exactMatchEvaluator = function exactMatchEvaluator() {
  var userResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var validation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _validation$validResp = validation.validResponse,
      validResponse = _validation$validResp === void 0 ? {} : _validation$validResp,
      _validation$altRespon = validation.altResponses,
      altResponses = _validation$altRespon === void 0 ? [] : _validation$altRespon;
  var allAnswers = [validResponse].concat((0, _toConsumableArray2["default"])(altResponses));
  var score = 0;
  var maxScore = getMaxScore(allAnswers);
  var evaluation = {};

  if ((0, _isEmpty2["default"])(userResponse)) {
    // user did not attempt any answer, return back without evaluating anything
    return {
      score: score,
      maxScore: maxScore,
      evaluation: evaluation
    };
  }

  var evaluations = getEvaluationExactMatch(userResponse, allAnswers);
  var allCorrectAnswerAttempt = evaluations.find(function (obj) {
    var correctAttempts = obj.correctAttempts,
        incorrectAttempts = obj.incorrectAttempts,
        actualCorrectAnswers = obj.actualCorrectAnswers;
    return incorrectAttempts === 0 && correctAttempts === actualCorrectAnswers; // no incorrect answer, and exactly same answer as set by user
  });

  if (allCorrectAnswerAttempt) {
    maxScore = allCorrectAnswerAttempt.maxScore;
    score = maxScore;
    evaluation = allCorrectAnswerAttempt.result;
  } else {
    /**
     * show highlight against the best possible match
     * in case of a tie,
     * it will show the hightlights against the first, among the ones having a tie
     *
     * consider score of individual answer set when determining the best match
     * sets having higher score will have higher priority than others
     */
    var bestMatch = evaluations.reduce(function (acc, curr) {
      var correctAttempts = acc.correctAttempts,
          incorrectAttempts = acc.incorrectAttempts,
          maxScoreForAllCorrect = acc.maxScore,
          actualCorrectAnswers = acc.actualCorrectAnswers;
      var individualScore = maxScoreForAllCorrect / actualCorrectAnswers;
      var accScore = (correctAttempts - incorrectAttempts) * individualScore;
      var currentCorrectAtttempts = curr.correctAttempts,
          currentIncorrectAttempts = curr.incorrectAttempts,
          currMaxScoreForAllCorrect = curr.maxScore,
          actualCorrectAnswersCurrent = curr.actualCorrectAnswers;
      var individualScoreCurrent = currMaxScoreForAllCorrect / actualCorrectAnswersCurrent;
      var currScore = (currentCorrectAtttempts - currentIncorrectAttempts) * individualScoreCurrent;

      if (currScore > accScore) {
        return curr;
      }

      return acc;
    });
    evaluation = bestMatch.result;
  }

  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
};
/**
 *
 * @param {Array<Number[]>} userResponse
 * @param {Array<Object>} allAnswers
 * @param {Number} penalty
 *
 * get the evaluation against all answers and score for each answer set
 * score and penalty are calculated on individual option basis
 */


var getEvaluationPartialMatch = function getEvaluationPartialMatch(userResponse, allAnswers, penalty) {
  var evaluations = allAnswers.map(function (answer) {
    var correctAnsMaxScore = answer.score,
        value = answer.value;
    var actualCorrectAnswers = (0, _keys2["default"])(value).length; // total correct answers set by teacher for current answer set

    var scorePerCorrectAnswer = correctAnsMaxScore / actualCorrectAnswers;
    var penaltyPerIncorrectAnswer = penalty / actualCorrectAnswers;
    var currentScore = 0;
    var correctAnswers = 0;
    var incorrectAnswers = 0; // get the evaluation for the current answer set

    var currentEvaluation = {};
    (0, _keys2["default"])(userResponse).forEach(function (responseId) {
      var isCorrect = (0, _isEqual2["default"])(value[responseId], userResponse[responseId]);
      isCorrect ? correctAnswers++ : incorrectAnswers++;
      currentEvaluation[responseId] = isCorrect;
    });
    var correctAnswerScore = correctAnswers * scorePerCorrectAnswer;
    var penalisation = incorrectAnswers * penaltyPerIncorrectAnswer;
    currentScore = Math.max(0, correctAnswerScore - penalisation); // score achieved for current answer set

    return {
      evaluation: currentEvaluation,
      score: currentScore,
      maxScore: correctAnsMaxScore
    };
  });
  return evaluations;
};

var partialMatchEvaluator = function partialMatchEvaluator(userResponse, validation) {
  var _validation$validResp2 = validation.validResponse,
      validResponse = _validation$validResp2 === void 0 ? {} : _validation$validResp2,
      _validation$altRespon2 = validation.altResponses,
      altResponses = _validation$altRespon2 === void 0 ? [] : _validation$altRespon2,
      _validation$penalty = validation.penalty,
      penalty = _validation$penalty === void 0 ? 0 : _validation$penalty,
      _validation$rounding = validation.rounding,
      rounding = _validation$rounding === void 0 ? NONE : _validation$rounding;
  var allAnswers = [validResponse].concat((0, _toConsumableArray2["default"])(altResponses));
  var score = 0;
  var maxScore = getMaxScore(allAnswers);
  var evaluation = [];
  var evaluations = getEvaluationPartialMatch(userResponse, allAnswers, penalty);

  if (evaluations.length > 0) {
    var maxByScore = evaluations.reduce(function (acc, curr) {
      if (curr.score > acc.score) {
        return curr;
      }

      return acc;
    }); // if rounding is selected, round down, otherwise keep the score as it is.

    score = rounding === ROUND_DOWN ? Math.floor(maxByScore.score) : maxByScore.score;
    maxScore = maxByScore.maxScore;
    evaluation = maxByScore.evaluation;
  }

  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
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
  var scoringType = validation.scoringType;

  if (scoringType !== PARTIAL_MATCH && scoringType !== EXACT_MATCH) {
    return {
      score: 0,
      maxScore: 0,
      evaluation: {}
    };
  }

  var _userResponse$value = userResponse.value,
      value = _userResponse$value === void 0 ? {} : _userResponse$value;

  switch (scoringType) {
    case EXACT_MATCH:
      return exactMatchEvaluator(value, validation);

    case PARTIAL_MATCH:
      return partialMatchEvaluator(value, validation);

    default:
      return {
        score: 0,
        maxScore: 0,
        evaluation: {}
      };
  }
};

var _default = evaluator;
exports["default"] = _default;