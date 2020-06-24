

const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

const _scoring = require("./const/scoring");

const _countPartialMatchScores = _interopRequireDefault(require("./helpers/countPartialMatchScores"));

const _partialMatchTemplate = _interopRequireDefault(require("./helpers/partialMatchTemplate"));

const _exactMatchTemplate = _interopRequireDefault(require("./helpers/exactMatchTemplate"));

const _countExactMatchScores = _interopRequireDefault(require("./helpers/countExactMatchScores"));

const evaluator = function evaluator(evaluatorType) {
  const qType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  return function (_ref) {
    const _ref$userResponse = _ref.userResponse;
        const userResponse = _ref$userResponse === void 0 ? [] : _ref$userResponse;
        const validation = _ref.validation;
    const validResponse = validation.validResponse;
        const _validation$altRespon = validation.altResponses;
        const altResponses = _validation$altRespon === void 0 ? [] : _validation$altRespon;
        const scoringType = validation.scoringType;
    const answers = [validResponse].concat((0, _toConsumableArray2.default)(altResponses));

    switch (scoringType) {
      case _scoring.ScoringType.EXACT_MATCH:
        return (0, _exactMatchTemplate.default)((0, _countExactMatchScores.default)(evaluatorType), {
          userResponse,
          answers,
          validation,
          qType
        });

      case _scoring.ScoringType.PARTIAL_MATCH:
      case _scoring.ScoringType.PARTIAL_MATCH_V2:
      default:
        return (0, _partialMatchTemplate.default)((0, _countPartialMatchScores.default)(evaluatorType), {
          userResponse,
          answers,
          validation,
          qType
        });
    }
  };
};

const _default = evaluator;
exports.default = _default;