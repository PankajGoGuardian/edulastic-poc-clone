"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _maxBy3 = _interopRequireDefault(require("lodash/maxBy"));

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

var _rounding = require("./const/rounding");

var _scoring = require("./const/scoring");

var _getPartialPerResponse = _interopRequireDefault(require("./helpers/getPartialPerResponse"));

var _getMaxScore = _interopRequireDefault(require("./helpers/getMaxScore"));

var _getPenaltyScore = _interopRequireDefault(require("./helpers/getPenaltyScore"));

var exactMatchEvaluator = function exactMatchEvaluator(_ref, answers, _ref2) {
  var userResponse = _ref.value;
  var automarkable = _ref2.automarkable,
    min_score_if_attempted = _ref2.min_score_if_attempted,
    max_score = _ref2.max_score;
  var score = 0;
  var evaluation = [];
  var maxScore = (0, _getMaxScore.default)(answers);
  userResponse = userResponse.map(function(res) {
    return res || [];
  }); // eslint-disable-next-line no-restricted-syntax

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (
      var _iterator = answers[Symbol.iterator](), _step;
      !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
      _iteratorNormalCompletion = true
    ) {
      var answer = _step.value;
      var answerValue = answer.value,
        answerScore = answer.score;

      if ((0, _isEqual2.default)(userResponse, answerValue)) {
        evaluation = (0, _cloneDeep2.default)(answerValue);
        score = answerScore;
        break;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (automarkable) {
    if (min_score_if_attempted) {
      maxScore = Math.max(maxScore, min_score_if_attempted);
      score = Math.max(min_score_if_attempted, score);
    }
  } else if (max_score) {
    maxScore = Math.max(max_score, maxScore);
  }

  return {
    score: score,
    maxScore: maxScore,
    evaluation: evaluation
  };
};

var compare = function compare(answer, response) {
  return response.map(function(a) {
    if (Array.isArray(answer)) {
      return answer.includes(a);
    }

    return null;
  });
};

var handleCount = function handleCount(byValue) {
  return function(acc, v) {
    if (v === byValue) {
      acc += 1;
    }

    return acc;
  };
};

var getCount = function getCount(rows) {
  return rows.reduce(
    function(acc) {
      var row = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var trueCount = Array.isArray(row) ? row.reduce(handleCount(true), 0) : 0;
      var falseCount = Array.isArray(row) ? row.reduce(handleCount(false), 0) : 0;
      acc = {
        trueCount: acc.trueCount + trueCount,
        falseCount: acc.falseCount + falseCount
      };
      return acc;
    },
    {
      trueCount: 0,
      falseCount: 0
    }
  );
};

var getScorePerAnswer = function getScorePerAnswer(_ref3) {
  var penalty = _ref3.penalty,
    score = _ref3.score,
    count = _ref3.count,
    falseCount = _ref3.falseCount;
  var result = score / count;

  if (penalty) {
    var perScore = count > 0 ? score / count : 0;
    var minusScore = falseCount > 0 ? penalty / falseCount : 0;
    result = perScore - minusScore;
  }

  return result;
};

var partialMatchEvaluator = function partialMatchEvaluator(_ref4, answers, _ref5) {
  var userResponse = _ref4.value;
  var automarkable = _ref5.automarkable,
    min_score_if_attempted = _ref5.min_score_if_attempted,
    max_score = _ref5.max_score,
    scoring_type = _ref5.scoring_type,
    rounding = _ref5.rounding,
    penalty = _ref5.penalty;
  var maxScore = (0, _getMaxScore.default)(answers);
  var isRound = rounding === _rounding.rounding.ROUND_DOWN || scoring_type === _scoring.ScoringType.PARTIAL_MATCH;
  userResponse = userResponse.map(function(res) {
    return res || [];
  });
  var result = answers.map(function(answer) {
    var answerValue = answer.value,
      answerScore = answer.score;
    var res = answerValue.map(function(a, i) {
      return compare(a, userResponse[i]);
    });

    var _getCount = getCount(res),
      falseCount = _getCount.falseCount;

    var count = answerValue.reduce(function(acc, val) {
      acc += Array.isArray(val) ? val.length : 0;
      return acc;
    }, 0);
    var scorePerAnswer = getScorePerAnswer({
      score: answerScore,
      penalty: penalty,
      count: count,
      falseCount: falseCount
    });
    var scoreRes = res.flat().reduce(function(acc, val) {
      if (val === true) {
        acc += scorePerAnswer;
      }

      return acc;
    }, 0);
    return {
      score: scoreRes,
      evaluation: res
    };
  }); // eslint-disable-next-line prefer-const

  var _maxBy2 = (0, _maxBy3.default)(result, function(res) {
      return res.score;
    }),
    score = _maxBy2.score,
    evaluation = _maxBy2.evaluation;

  if (automarkable) {
    if (min_score_if_attempted) {
      maxScore = Math.max(maxScore, min_score_if_attempted);
      score = Math.max(min_score_if_attempted, score);
    }
  } else if (max_score) {
    maxScore = Math.max(max_score, maxScore);
  }

  if (penalty > 0) {
    score = (0, _getPenaltyScore.default)({
      score: score,
      penalty: penalty,
      evaluation: evaluation
    });
  }

  result = {
    score: isRound ? Math.floor(score) : +score.toFixed(4),
    maxScore: maxScore,
    evaluation: evaluation
  };
  return result;
};

var evaluator = function evaluator(_ref6) {
  var _ref6$userResponse = _ref6.userResponse,
    userResponse =
      _ref6$userResponse === void 0
        ? {
            value: []
          }
        : _ref6$userResponse,
    validation = _ref6.validation;
  var valid_response = validation.valid_response,
    alt_responses = validation.alt_responses,
    scoring_type = validation.scoring_type;
  var answers = [valid_response].concat((0, _toConsumableArray2.default)(alt_responses));

  switch (scoring_type) {
    case _scoring.ScoringType.PARTIAL_MATCH:
      return (0, _getPartialPerResponse.default)(userResponse.length)(
        partialMatchEvaluator(userResponse, answers, validation)
      );

    case _scoring.ScoringType.PARTIAL_MATCH_V2:
      return partialMatchEvaluator(userResponse, answers, validation);

    case _scoring.ScoringType.EXACT_MATCH:
    default:
      return exactMatchEvaluator(userResponse, answers, validation);
  }
};

var _default = evaluator;
exports.default = _default;
