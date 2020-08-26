

const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

const _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

const _keys2 = _interopRequireDefault(require("lodash/keys"));

const _maxBy2 = _interopRequireDefault(require("lodash/maxBy"));

const _fastLevenshtein = require("fast-levenshtein");

const _rounding = require("./const/rounding");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { let i = 0; const F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } let it; let normalCompletion = true; let didErr = false; let err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { const step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { const keys = Object.keys(object); if (Object.getOwnPropertySymbols) { let symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter((sym) => Object.getOwnPropertyDescriptor(object, sym).enumerable); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (let i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach((key) => { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach((key) => { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 *
 * @param {string} answer  // correct answer
 * @param {string} response  // user response
 * @param {boolean} allowSingleLetterMistake  // is single letter mistake accepted
 * @param {boolean} ignoreCase  // ignore case of answer
 */
const compareChoice = function compareChoice(answer, response) {
  const allowSingleLetterMistake = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  const ignoreCase = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  const attempted = response && response.length;
  if (!attempted) return null;
  answer = ignoreCase ? answer.trim().toLowerCase() : answer.trim();
  response = ignoreCase ? response.trim().toLowerCase() : response.trim(); // is single letter mistake allowed?
  // if yes, then check if "levenshtein-distance" is less than 1
  // else it should be a an exact match
  // eslint-disable-next-line max-len

  return allowSingleLetterMistake ? (0, _fastLevenshtein.get)(answer, response) <= 1 : answer === response;
};
/**
 *
 * @param {Array} userResponse
 * @param {Object} validation
 */


const groupChoiceByIndex = function groupChoiceByIndex(answers, validation) {
  let _validation$validResp;

  // grouping the answers at particular index together
  // [[a11, a12], [a21, a22]] => [[a11, a21], a[12, a22]]
  const responses = ((_validation$validResp = validation.validResponse) === null || _validation$validResp === void 0 ? void 0 : _validation$validResp.value) || {};
  const answerSet = [];
  (0, _keys2.default)(responses).forEach((id) => {
    answers.forEach((answer) => {
      answerSet[id] = answerSet[id] || new Set([]);
      answerSet[id].add(answer.value[id]);
    });
  });
  return answerSet;
};

const mixAndMatchEvaluator = function mixAndMatchEvaluator(_ref) {
  let _validation$validResp2;

  const userResponse = _ref.userResponse;
      const validation = _ref.validation;
  const response = userResponse;
  const allowSingleLetterMistake = validation.allowSingleLetterMistake;
      const ignoreCase = validation.ignoreCase; // combining validAnswer and alternate answers

  const answers = [_objectSpread({}, validation.validResponse)].concat((0, _toConsumableArray2.default)(validation.altResponses || []));
  const optionCount = (0, _keys2.default)((_validation$validResp2 = validation.validResponse) === null || _validation$validResp2 === void 0 ? void 0 : _validation$validResp2.value).length || 0;
  const maxScore = answers.reduce((_maxScore, answer) => Math.max(_maxScore, answer.score), 0);
  let score = 0; // grouping all the responses at particular index together

  const answerSet = groupChoiceByIndex(answers, validation);
  const evaluation = {};
  (0, _keys2.default)(response).forEach((id) => {
    const answersById = answerSet[id].values();
    let found = false;

    const _iterator = _createForOfIteratorHelper(answersById);
        let _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        const answer = _step.value;
        found = compareChoice(answer, response[id], allowSingleLetterMistake, ignoreCase);
        if (found) break;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    evaluation[id] = found;
  });
  const correctAnswerCount = (0, _keys2.default)(evaluation).filter((id) => evaluation[id]).length;

  if (validation.scoringType === "partialMatch") {
    // get partial score
    score = maxScore * (correctAnswerCount / optionCount);

    if (validation.penalty) {
      const totalPenalty = validation.penalty;
      const wrongAnswerCount = (0, _keys2.default)(evaluation).filter((id) => evaluation[id] === false).length;
      const penalty = totalPenalty / optionCount * wrongAnswerCount;
      score = Math.max(0, score - penalty); // if round down, but score achieved is not full score, then round down to nearest integer

      if (validation.rounding === _rounding.rounding.ROUND_DOWN && score !== maxScore) {
        score = Math.floor(score);
      }
    }
  } else if (correctAnswerCount === optionCount) {
    // exactMatch  (all correct)
    score = maxScore;
  }

  return {
    score,
    maxScore,
    evaluation
  };
};

const normalEvaluator = function normalEvaluator(_ref2) {
  const userResponse = _ref2.userResponse;
      const validation = _ref2.validation;
  let _validation$validResp3 = validation.validResponse;
  _validation$validResp3 = _validation$validResp3 === void 0 ? {} : _validation$validResp3;
  const _validation$validResp4 = _validation$validResp3.value;
      const value = _validation$validResp4 === void 0 ? {} : _validation$validResp4;
  const optionCount = (0, _keys2.default)(value).length || 0;
  const allowSingleLetterMistake = validation.allowSingleLetterMistake;
      const ignoreCase = validation.ignoreCase; // combining the correct answer and alternate answers

  const answers = [_objectSpread({}, validation.validResponse)].concat((0, _toConsumableArray2.default)(validation.altResponses || []));
  const maxScore = answers.reduce((_maxScore, answer) => Math.max(_maxScore, answer.score), 0);
  const evaluations = [];
  const response = userResponse;
  answers.forEach((answer) => {
    let currentScore = 0; // calculating the evaluation for every answer
    // comparing user respose with the answer

    const evaluation = {};
    (0, _keys2.default)(answer.value).forEach((id) => {
      evaluation[id] = compareChoice(answer.value[id], response[id], allowSingleLetterMistake, ignoreCase);
    });
    const correctAnswerCount = (0, _keys2.default)(evaluation).filter((id) => evaluation[id]).length;

    if (validation.scoringType === "partialMatch") {
      currentScore = parseFloat(answer.score * (correctAnswerCount / optionCount));

      if (validation.penalty) {
        const totalPenalty = validation.penalty;
        const wrongAnswerCount = (0, _keys2.default)(evaluation).filter((id) => evaluation[id] === false).length;
        const penalty = totalPenalty / optionCount * wrongAnswerCount;
        currentScore = Math.max(0, currentScore - penalty); // if round down, but score achieved is not full score, then round down to nearest integer

        if (validation.rounding === _rounding.rounding.ROUND_DOWN && currentScore !== answer.score) {
          currentScore = Math.floor(currentScore);
        }
      }
    } else if (correctAnswerCount === optionCount && optionCount !== 0) {
      // exact match (all correct)
      currentScore = answer.score;
    }

    evaluations.push({
      score: currentScore,
      evaluation
    });
  }); // the evaluation which gave the highest score

  const correct = (0, _maxBy2.default)(evaluations, "score"); // returning the first evaluation if no answers are correct

  const evaluation = correct.score === 0 ? evaluations[0].evaluation : correct.evaluation;
  return {
    evaluation,
    score: parseFloat(correct.score),
    maxScore
  };
};
/**
 *
 * @param {Array} userResponse
 * @param {Object} validation
 */


const evaluator = function evaluator(_ref3) {
  const _ref3$userResponse = _ref3.userResponse;
      const userResponse = _ref3$userResponse === void 0 ? {} : _ref3$userResponse;
      const _ref3$validation = _ref3.validation;
      const validation = _ref3$validation === void 0 ? {} : _ref3$validation;
  return validation.mixAndMatch ? mixAndMatchEvaluator({
    userResponse,
    validation
  }) : normalEvaluator({
    userResponse,
    validation
  });
};

const _default = evaluator;
exports.default = _default;