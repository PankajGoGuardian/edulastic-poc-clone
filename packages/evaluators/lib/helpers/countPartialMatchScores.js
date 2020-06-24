

const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const _keys2 = _interopRequireDefault(require("lodash/keys"));

const _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));

const _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

const _constants = require("@edulastic/constants");

const _getMatches = _interopRequireDefault(require("./getMatches"));

const _getEvaluation = _interopRequireDefault(require("./getEvaluation"));

const _clozeTextHelpers = require("./clozeTextHelpers");

const _orderlistHelpers = require("./orderlistHelpers");

const countPartialMatchScores = function countPartialMatchScores(compareFunction) {
  return function (_ref) {
    const answers = _ref.answers;
        const _ref$userResponse = _ref.userResponse;
        const userResponse = _ref$userResponse === void 0 ? [] : _ref$userResponse;
        const qType = _ref.qType;
    const restOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const isOrderlist = qType === _constants.questionType.ORDER_LIST;
    let existingResponse = (0, _cloneDeep2.default)(userResponse);

    if (!isOrderlist && !Array.isArray(userResponse)) {
      existingResponse = (0, _cloneDeep2.default)(userResponse.value);
    }

    let score = 0;
    let maxScore = 0;
    let rightLen = 0;
    let rightIndex = 0;
    answers.forEach((_ref2, ind) => {
      const answer = _ref2.value;
          const totalScore = _ref2.score;

      if ((0, _isEmpty2.default)(answer)) {
        return;
      }

      let numOfanswer = answer.length;
      let matches = 0;

      if (isOrderlist) {
        matches = (0, _orderlistHelpers.getOrderlistMatchs)(existingResponse, answer);
        numOfanswer = (0, _keys2.default)(answer).length;
      } else {
        matches = (0, _getMatches.default)(existingResponse, answer, compareFunction);
      }

      const scorePerAnswer = totalScore / numOfanswer;

      if (restOptions.ignoreCase || restOptions.allowSingleLetterMistake) {
        matches = (0, _clozeTextHelpers.getClozeTextMatches)(existingResponse, answer, restOptions);
      }

      const currentScore = matches * scorePerAnswer;
      score = Math.max(score, currentScore);
      maxScore = Math.max(maxScore, totalScore);

      if (currentScore === score) {
        rightLen = numOfanswer;
        rightIndex = ind;
      }
    });
    const evaluation = (0, _getEvaluation.default)(existingResponse, answers, rightIndex, compareFunction, restOptions);
    return {
      score,
      maxScore,
      rightLen,
      evaluation
    };
  };
};

const _default = countPartialMatchScores;
exports.default = _default;