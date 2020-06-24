"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _keys2 = _interopRequireDefault(require("lodash/keys"));

var _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));

var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

var _constants = require("@edulastic/constants");

var _getEvaluation = _interopRequireDefault(require("./getEvaluation"));

var _getMatches = _interopRequireDefault(require("./getMatches"));

var _clozeTextHelpers = require("./clozeTextHelpers");

var _orderlistHelpers = require("./orderlistHelpers");

var countExactMatchScores = function countExactMatchScores(compareFunction) {
  return function (_ref) {
    var answers = _ref.answers,
        _ref$userResponse = _ref.userResponse,
        userResponse = _ref$userResponse === void 0 ? [] : _ref$userResponse,
        qType = _ref.qType;
    var restOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var isOrderlist = qType === _constants.questionType.ORDER_LIST;
    var existingResponse = (0, _cloneDeep2["default"])(userResponse);

    if (!isOrderlist && !Array.isArray(userResponse)) {
      existingResponse = (0, _cloneDeep2["default"])(userResponse.value);
    }

    var score = 0;
    var maxScore = 0;
    var matchCount = 0;
    var rightLen = 0;
    var rightIndex = 0;
    answers.forEach(function (_ref2, index) {
      var answer = _ref2.value,
          totalScore = _ref2.score;

      if ((0, _isEmpty2["default"])(answer)) {
        return;
      }

      var currentMatchCount = 0;
      var numOfanswer = answer.length;
      var numOfResponse = existingResponse.length;

      if (isOrderlist) {
        currentMatchCount = (0, _orderlistHelpers.getOrderlistMatchs)(existingResponse, answer);
        numOfanswer = (0, _keys2["default"])(answer).length;
        numOfResponse = (0, _keys2["default"])(existingResponse).length;
      } else {
        currentMatchCount = (0, _getMatches["default"])(existingResponse, answer, compareFunction);
      }

      var matches = currentMatchCount === numOfanswer;

      if (restOptions.ignoreCase || restOptions.allowSingleLetterMistake) {
        matches = (0, _clozeTextHelpers.getClozeTextMatches)(existingResponse, answer, restOptions) === numOfanswer;
      }

      var currentScore = matches && numOfResponse === numOfanswer ? totalScore : 0;
      score = Math.max(score, currentScore);
      maxScore = Math.max(maxScore, totalScore);
      matchCount = Math.max(matchCount, currentMatchCount);

      if (currentScore === score && score !== 0 || currentMatchCount === matchCount && matchCount !== 0) {
        rightLen = numOfanswer;
        rightIndex = index;
      }
    });
    var evaluation = (0, _getEvaluation["default"])(existingResponse, answers, rightIndex, compareFunction, restOptions);
    return {
      score: score,
      maxScore: maxScore,
      rightLen: rightLen,
      evaluation: evaluation
    };
  };
};

var _default = countExactMatchScores;
exports["default"] = _default;