

const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

const _graphsComparison = _interopRequireDefault(require('./graphs-comparison'));

// mcq evaluator method
const evaluator = function evaluator(_ref) {
  const userResponse = _ref.userResponse;


  const validation = _ref.validation;
  let result = {};
  let correct = false;

  let compareResult = _graphsComparison.default.checkAnswer(validation, userResponse);

  correct = compareResult.commonResult;

  if (!correct) {
    if (validation.alt_responses && validation.alt_responses.length > 0) {
      for (let i = 0; i < validation.alt_responses.length; i++) {
        /** for compatibility with graphs-comparison's checkAnswer method */
        const tmpValidation = {};
        tmpValidation.valid_response = validation.alt_responses[i];

        const altResponseCompareResult = _graphsComparison.default.checkAnswer(tmpValidation, userResponse);

        correct = altResponseCompareResult.commonResult;

        if (correct) {
          compareResult = altResponseCompareResult;
          break;
        }
      }
    }
  }


  result = compareResult;
  return result;
};

const _default = evaluator;
exports.default = _default;
