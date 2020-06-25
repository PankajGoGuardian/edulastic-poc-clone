

const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const _constants = require("@edulastic/constants");

const _mainEvaluator = _interopRequireDefault(require("./mainEvaluator"));

const evaluator = (0, _mainEvaluator.default)(_constants.evaluatorTypes.IS_EQUAL, _constants.questionType.CLOZE_IMAGE_DROP_DOWN);
const _default = evaluator;
exports.default = _default;