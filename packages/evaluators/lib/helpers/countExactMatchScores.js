

const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const _keys2 = _interopRequireDefault(require("lodash/keys"));

const _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));

const _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

const _constants = require("@edulastic/constants");

const _getEvaluation = _interopRequireDefault(require("./getEvaluation"));

const _getMatches = _interopRequireDefault(require("./getMatches"));

const _clozeTextHelpers = require("./clozeTextHelpers");

const _orderlistHelpers = require("./orderlistHelpers");

const countExactMatchScores = function countExactMatchScores(compareFunction) {
  return function (_ref) {
    const answers = _ref.answers;
        const _ref$userResponse = _ref.userResponse;
        const userResponse = _ref$userResponse === void 0 ? [] : _ref$userResponse;
        const qType = _ref.qType;
    const restOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const isObjectAnswers = qType === _constants.questionType.ORDER_LIST || qType === _constants.questionType.CLOZE_IMAGE_DROP_DOWN;
    let existingResponse = (0, _cloneDeep2.default)(userResponse);

    if (!isObjectAnswers && !Array.isArray(userResponse)) {
      existingResponse = (0, _cloneDeep2.default)(userResponse.value);
    }

    let score = 0;
    let maxScore = 0;
    let matchCount = 0;
    let rightLen = 0;
    let rightIndex = 0;
    answers.forEach((_ref2, index) => {
      const answer = _ref2.value;
          const totalScore = _ref2.score;

      if ((0, _isEmpty2.default)(answer)) {
        return;
      }

      let currentMatchCount = 0;
      let numOfanswer = answer.length;
      let numOfResponse = existingResponse.length;

      if (isObjectAnswers) {
        currentMatchCount = (0, _orderlistHelpers.getOrderlistMatchs)(existingResponse, answer);
        numOfanswer = (0, _keys2.default)(answer).length;
        numOfResponse = (0, _keys2.default)(existingResponse).length;
      } else {
        currentMatchCount = (0, _getMatches.default)(existingResponse, answer, compareFunction);
      }

      let matches = currentMatchCount === numOfanswer;

      if (restOptions.ignoreCase || restOptions.allowSingleLetterMistake) {
        matches = (0, _clozeTextHelpers.getClozeTextMatches)(existingResponse, answer, restOptions) === numOfanswer;
      }

      const currentScore = matches && numOfResponse === numOfanswer ? totalScore : 0;
      score = Math.max(score, currentScore);
      maxScore = Math.max(maxScore, totalScore);
      matchCount = Math.max(matchCount, currentMatchCount);

      if (currentScore === score && score !== 0 || currentMatchCount === matchCount && matchCount !== 0) {
        rightLen = numOfanswer;
        rightIndex = index;
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

const _default = countExactMatchScores;
exports.default = _default;