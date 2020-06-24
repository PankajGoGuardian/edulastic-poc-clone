

const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

const _zip2 = _interopRequireDefault(require("lodash/zip"));

const _identity2 = _interopRequireDefault(require("lodash/identity"));

const _scoring = require("./const/scoring");

function _createForOfIteratorHelper(o) {
  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {
      let i = 0;
      const F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return { done: true };
          return { done: false, value: o[i++] };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }
    throw new TypeError(
      "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  }
  let it;
    let normalCompletion = true;
    let didErr = false;
    let err;
  return {
    s: function s() {
      it = o[Symbol.iterator]();
    },
    n: function n() {
      const step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  let n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

const exactMatchEvaluator = function exactMatchEvaluator() {
  const rawAnswers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  const rawUserResponse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const listKeys = Object.keys(rawAnswers[0].value);
  const answers = rawAnswers.map(ans => ({ 
    score: ans.score,
    value: listKeys.map(l => ans.value[l] || null)
  }));
  const userResponse = listKeys.map(l => rawUserResponse[l] || null);
  let evaluation = [];
  let score = 0;
  let maxScore = 0;


  const _iterator = _createForOfIteratorHelper(answers);
    let _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
      const validAnswer = _step.value;
      const answer = validAnswer.value;
        const possibleMaxScore = validAnswer.score;
      if (!Array.isArray(answer)) continue;
      maxScore = Math.max(possibleMaxScore || 0, maxScore);
      const currentEvaluation = answer.map((item, index) => {
        const resp = userResponse === null || userResponse === void 0 ? void 0 : userResponse[index];
        if (!item && !resp) return true;
        return item === resp;
      });
      if (currentEvaluation.every(_identity2.default)) score = possibleMaxScore;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  if (score) {
    evaluation = Array(userResponse.length).fill(true);
  } else {
    const correctAnswer = _zip2.default.apply(
      void 0,
      (0, _toConsumableArray2.default)(
        answers.map((i) => i.value)
      )
    );

    evaluation = userResponse.map((item, index) => {
      if (!item) return null;
      return correctAnswer[index].includes(item);
    });
  }

  const evaluationMap = {};
  listKeys.forEach((l, ind) => evaluationMap[l] = evaluation[ind]);

  return {
    score,
    maxScore,
    evaluation: evaluationMap
  };
};

const partialMatchEvaluator = function partialMatchEvaluator() {
  const rawAnswers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  const rawUserResponse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const listKeys = Object.keys(rawAnswers[0].value);
  const answers = rawAnswers.map(ans => ({ 
    score: ans.score,
    value: listKeys.map(l => ans.value[l] || null)
  }));
  const userResponse = listKeys.map(l => rawUserResponse[l] || null);
  let evaluation = [];
  let score = 0;
  let maxScore = 0;

  const _iterator2 = _createForOfIteratorHelper(answers);
    let _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
      const validAnswer = _step2.value;
      const answer = validAnswer.value;
        const possibleMaxScore = validAnswer.score;
      if (!Array.isArray(answer)) continue;
      maxScore = Math.max(possibleMaxScore || 0, maxScore);
      const answerLength = answer.filter(_identity2.default).length;
      const currentEvaluation = answer.map((item, index) => {
        const resp = userResponse === null || userResponse === void 0 ? void 0 : userResponse[index];
        if (!resp) return null;
        return item === resp;
      });
      const correctCount = currentEvaluation.filter(_identity2.default).length;
      const currentScore = (possibleMaxScore / answerLength) * correctCount;

      if (currentScore > score) {
        evaluation = currentEvaluation;
        score = currentScore;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  if (evaluation.length === 0) {
    let _answers$;

    const correctAnswer = ((_answers$ = answers[0]) === null || _answers$ === void 0 ? void 0 : _answers$.value) || [];
    evaluation = userResponse.map((item, index) => {
      if (!item) return null;
      return item === correctAnswer[index];
    });
  }

  const evaluationMap = {};
  listKeys.forEach((l, ind) => evaluationMap[l] = evaluation[ind]);

  return {
    score,
    maxScore,
    evaluation: evaluationMap
  };
};
/**
 *
 * match list evaluator.
 */

const evaluator = function evaluator(_ref) {
  const _ref$userResponse = _ref.userResponse;
    const userResponse = _ref$userResponse === void 0 ? [] : _ref$userResponse;
    const validation = _ref.validation;
  const validResponse = validation.validResponse;
    const _validation$altRespon = validation.altResponses;
    const altResponses = _validation$altRespon === void 0 ? [] : _validation$altRespon;
    const scoringType = validation.scoringType;
  const answers = [validResponse].concat((0, _toConsumableArray2.default)(altResponses));
  return scoringType === _scoring.ScoringType.EXACT_MATCH
    ? exactMatchEvaluator(answers, userResponse)
    : partialMatchEvaluator(answers, userResponse);
};

const _default = evaluator;
exports.default = _default;
